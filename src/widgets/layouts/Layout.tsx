import { PropsWithChildren } from "react"
import { Header } from "../header/Header"
import { Footer } from "../footer/Footer"

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  )
}
