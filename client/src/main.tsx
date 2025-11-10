import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Force le thème sombre et capture les erreurs globales pour éviter les écrans noirs
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
  document.body.classList.add('dark');
  window.addEventListener('error', (ev) => {
    console.error('[CLIENT GLOBAL ERROR]', ev.error || ev.message);
  });
  window.addEventListener('unhandledrejection', (ev: any) => {
    console.error('[CLIENT UNHANDLED REJECTION]', ev.reason);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
