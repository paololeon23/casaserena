import { Container, SectionHeading } from "./ui";

const terms = [
  {
    title: "Qué se garantiza",
    text: "Cuando Casa Serena confirma la reserva por WhatsApp, la habitación se entrega limpia y conforme a la foto y los videos de esta página. Si al llegar no corresponde a lo confirmado, puedes decirlo por WhatsApp antes de aceptar la estadía.",
  },
  {
    title: "Qué no queda garantizado aquí",
    text: "Esta página no garantiza que las fechas estén libres, ni el precio, ni un reembolso. Nada de eso queda cerrado hasta que el encargado lo responda por WhatsApp. Enviar el formulario no es un contrato ni un pago.",
  },
  {
    title: "Fechas ocupadas de ejemplo",
    text: "Las noches tachadas en el calendario son una simulación. Sirven para mostrar cómo se ve una fecha ocupada. No representan reservas reales y pueden cambiar cuando exista un calendario conectado.",
  },
  {
    title: "Huéspedes y cuidado",
    text: "Debes indicar cuántas personas se quedan. La habitación doble es para 2. Si vienen más, hace falta la confirmación de Casa Serena. El huésped responde por los daños que cause durante la estadía. Eso se conversa directamente con el encargado.",
  },
  {
    title: "Pagos y datos",
    text: "Esta web no cobra ni guarda una cuenta. El nombre, las fechas y la nota solo se escriben en el mensaje de WhatsApp cuando tú lo abres. El horario de ingreso, la salida y la cancelación se acuerdan en esa conversación.",
  },
];

export function Policies() {
  return (
    <section id="terminos" className="scroll-mt-24 bg-white pb-4 pt-6 md:pb-6 md:pt-8">
      <Container>
        <SectionHeading
          eyebrow="Antes de reservar"
          title="Términos y garantía"
          text="Léelo en un minuto. La reserva solo existe cuando Casa Serena la confirma."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-[1.4rem] border border-line bg-line">
          {terms.map((item, index) => (
            <article key={item.title} className="bg-white p-6 sm:p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em]">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed">{item.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
