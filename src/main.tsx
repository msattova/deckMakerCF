import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter
    basename={
      import.meta.env.DEV ? "/" : "/deckMakerCF/"
    }
  >
    <App />
  </BrowserRouter>
);
