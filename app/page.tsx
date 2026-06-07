import { Header } from "@/components/landing/header"
import { LandingPage } from "@/components/landing/landing-page"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <LandingPage />
      <Footer />
    </div>
  )
}
