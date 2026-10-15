export type OccupiedByRoom = Record<string, string[]>;

export type OccupiedPayload = {
  ok: boolean;
  actualizado: string;
  habitaciones: OccupiedByRoom;
};

export type RegistroPayload = {
  nombre: string;
  dni: string;
  celular: string;
  habitacion: string;
  fecha: string;
  fechaFin: string;
  huespedes: string;
  noches: string;
};

type JsonpWindow = Window & Record<string, (data: OccupiedPayload) => void>;

export function fetchOccupied(url: string): Promise<OccupiedPayload> {
  const callback = `casaSerenaCalendario_${Date.now()}`;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("tiempo"));
    }, 8000);
    const host = window as unknown as JsonpWindow;
    host[callback] = (data) => {
      cleanup();
      if (!data || data.ok === false) {
        reject(new Error("hoja"));
        return;
      }
      resolve(normalizeOccupied(data));
    };
    function cleanup() {
      window.clearTimeout(timer);
      script.remove();
      delete host[callback];
    }
    script.src = `${url}${url.includes("?") ? "&" : "?"}action=ocupadas&callback=${callback}`;
    script.onerror = () => {
      cleanup();
      reject(new Error("red"));
    };
    document.head.appendChild(script);
  });
}

export function normalizeOccupied(data: OccupiedPayload): OccupiedPayload {
  const habitaciones: OccupiedByRoom = {};
  const source = data?.habitaciones ?? {};
  for (const [roomId, nights] of Object.entries(source)) {
    habitaciones[roomId] = Array.isArray(nights) ? nights.filter((iso) => /^\d{4}-\d{2}-\d{2}$/.test(iso)) : [];
  }
  return {
    ok: Boolean(data?.ok),
    actualizado: typeof data?.actualizado === "string" ? data.actualizado : "",
    habitaciones,
  };
}

/** Fecha de estadía como la escribe el encargado: 14-10-2026. */
export function fechaParaHoja(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : iso;
}

/** Envía la ficha a la hoja sin esperar la respuesta, para no bloquear WhatsApp. */
export function sendRegistro(url: string, payload: RegistroPayload) {
  if (!url.trim()) return;
  const body = new URLSearchParams();
  body.set("payload", JSON.stringify(payload));
  void fetch(url, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    body,
  }).catch(() => {
    const frameId = "casa-serena-registro";
    let frame = document.getElementById(frameId) as HTMLIFrameElement | null;
    if (!frame) {
      frame = document.createElement("iframe");
      frame.id = frameId;
      frame.name = frameId;
      frame.hidden = true;
      document.body.append(frame);
    }
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.target = frameId;
    form.hidden = true;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "payload";
    input.value = body.get("payload") ?? "";
    form.append(input);
    document.body.append(form);
    form.submit();
    window.setTimeout(() => form.remove(), 4000);
  });
}
