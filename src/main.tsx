import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Rule from './static_text/Rule.tsx'

//github pagesで公開するために開発環境とそれ以外とでbasenameが別になるようにする
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={import.meta.env.DEV ? "/" : "/deckMakerCF/"}>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/rule" element={<Rule />}></Route>
    </Routes>
  </BrowserRouter>
);
