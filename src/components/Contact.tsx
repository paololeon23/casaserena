import { brand, fullWhatsappNumber, whatsappDisplay, whatsappSource } from "../config/site";
import { Container, PendingNote, SectionHeading } from "./ui";

function isReady(phone: string) {
  return phone.replace(/\D/g, "").length >= 10;
}

export function Contact() {
  const phone = fullWhatsappNumber();
  const ready = isReady(phone);
  const href = ready ? `https://wa.me/${phone}` : null;

  return (
    <section id="contacto" className="scroll-mt-24 border-t border-line py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Escribir" title="Contacto" text="La reserva se conversa por WhatsApp. Esta página no cobra." />
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">WhatsApp</p>
            {ready && href ? (
              <>
                <a className="mt-3 block font-display text-3xl tracking-[-0.03em] underline decoration-ink/20 underline-offset-4" href={href} target="_blank" rel="noreferrer">
                  {whatsappDisplay()}
                </a>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{whatsappSource}</p>
              </>
            ) : (
              <div className="mt-3">
                <PendingNote>Número de WhatsApp sin configurar.</PendingNote>
              </div>
            )}
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">TikTok</p>
            <a className="mt-3 block font-display text-3xl tracking-[-0.03em]" href={brand.tiktokUrl} target="_blank" rel="noreferrer">
              @{brand.tiktokHandle}
            </a>
            <p className="mt-3 text-sm text-ink/65">{brand.publicName}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
