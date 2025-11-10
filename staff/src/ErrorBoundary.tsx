import React from "react";

// Composant ErrorBoundary : capture les erreurs d'exécution React
// et affiche un écran d'erreur lisible au lieu d'un écran noir.
export class ErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean; error?: any }> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Journalisation détaillée en console pour le debug
    // (peut être reliée à un service distant si besoin)
    console.error("[ErrorBoundary] Erreur UI capturée:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-xl w-full space-y-3">
            <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
            <p className="text-sm text-muted-foreground">
              L'interface a rencontré un problème. Veuillez actualiser la page.
            </p>
            {process.env.NODE_ENV !== 'production' && (
              <pre className="text-xs whitespace-pre-wrap bg-muted p-3 rounded-md border border-border overflow-auto max-h-64">
                {String(this.state.error ?? "Erreur inconnue")}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}
