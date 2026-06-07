import { Header } from "@/components/landing/header"
import { LandingPage } from "@/components/landing/landing-page"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090B] dark">
      <Header />
      <LandingPage />
      <Footer />
    </main>
  )
}
