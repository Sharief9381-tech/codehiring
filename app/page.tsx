import { Header } from "@/components/landing/header"
import { LandingPage } from "@/components/landing/landing-page"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <LandingPage />
      <Footer />
    </main>
  )
}
