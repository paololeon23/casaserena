import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg px-6 py-24 text-center" role="alert">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Casa Serena</p>
          <h1 className="mt-3 font-display text-4xl">No se pudo mostrar la página</h1>
          <p className="mt-4 text-ink/75">
            Recarga el navegador. Si el problema continúa, revisa los datos en la configuración.
          </p>
          <button
            type="button"
            className="mt-6 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
