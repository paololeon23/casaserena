import { Container, SectionHeading } from "./ui";

const terms = [
  {
    title: "La reserva no queda hecha aquí",
    text: "Elegir fechas y abrir WhatsApp es una consulta. La habitación queda reservada solo cuando Casa Serena responde y acepta. Esta página no cobra ni emite un comprobante.",
  },
  {
    title: "Qué se ve en el calendario",
    text: "Una noche tachada está reservada. El nombre de la persona no se publica. Del 14 al 16 se ocupan las noches del 14 y del 15; el 16 es el día de salida y puede ser el ingreso de otro huésped. Si la hoja no carga, no tomes el calendario como lista de días libres.",
  },
  {
    title: "Cuántas personas caben",
    text: "Se indican de 2 a 4 personas. AURA es una cama matrimonial y ALMA son dos camas. Si el grupo no cabe en lo que se ve en las fotos, Casa Serena lo confirma por WhatsApp. Si llegan más de 4, se puede rechazar el ingreso.",
  },
  {
    title: "Cómo se entrega y qué se cuida",
    text: "La habitación se entrega limpia y como se ve en las fotos de esta página. Si al llegar no corresponde, dilo antes de aceptar la estadía. El huésped responde por daños, faltantes y suciedad extraordinaria.",
  },
  {
    title: "Precio, horario y cancelación",
    text: "El precio, la hora de ingreso, la hora de salida y la cancelación se acuerdan por WhatsApp antes de la llegada. Esta página no publica un precio ni una penalidad que no haya sido confirmada.",
  },
  {
    title: "Nombre, DNI y celular",
    text: "Se piden para identificar la consulta, llevar el registro del alojamiento y, más adelante, enviarte avisos de Casa Serena. No aparecen en el calendario. Al abrir WhatsApp aceptas ese uso.",
  },
  {
    title: "El punto del mapa",
    text: "El mapa marca el punto exacto que Casa Serena publicó. La forma de llegar se coordina por WhatsApp si hace falta un detalle más.",
  },
];

export function Policies() {
  return (
    <section id="terminos" className="scroll-mt-24 bg-white pb-4 pt-6 md:pb-6 md:pt-8">
      <Container>
        <SectionHeading
          eyebrow="Antes de reservar"
          title="Reglas"
          text="Léelas antes de escribir. Sirven para que la estadía quede clara y no haya un reclamo después."
        />
        <div className="mt-8 grid gap-px overflow-hidden rounded-[1.4rem] border border-line bg-line md:grid-cols-2">
          {terms.map((item, index) => (
            <article key={item.title} className="bg-white p-6 sm:p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em]">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-3xl tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed">{item.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
