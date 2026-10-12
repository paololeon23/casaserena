import { BookingProvider } from "./context/BookingContext";
import { Booking } from "./components/Booking";
import { Contact } from "./components/Contact";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Location } from "./components/Location";
import { MobileBar } from "./components/MobileBar";
import { Policies } from "./components/Policies";
import { Rooms } from "./components/Rooms";
import { WhatsAppFloat } from "./components/WhatsAppFloat";

export default function App() {
  return (
    <ErrorBoundary>
      <BookingProvider>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido">
          <Hero />
          <Rooms />
          <Booking />
          <Location />
          <Policies />
          <Faq />
          <Contact />
        </main>
        <Footer />
        <WhatsAppFloat />
        <MobileBar />
      </BookingProvider>
    </ErrorBoundary>
  );
}
