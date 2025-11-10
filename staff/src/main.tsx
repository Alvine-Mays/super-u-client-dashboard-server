import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Force le thème sombre globalement côté staff et ajoute une capture des erreurs globales
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
  document.body.classList.add('dark');
  window.addEventListener('error', (ev) => {
    console.error('[GLOBAL ERROR]', ev.error || ev.message);
  });
  window.addEventListener('unhandledrejection', (ev: any) => {
    console.error('[UNHANDLED REJECTION]', ev.reason);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
