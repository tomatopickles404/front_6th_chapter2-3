import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import { Providers } from "app/providers"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Router>
        <App />
      </Router>
    </Providers>
  </StrictMode>,
)
