import { Header } from "@/components/landing/header"
import { LandingPage } from "@/components/landing/landing-page"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div style={{ background: "#09090B", color: "#fafafa", minHeight: "100vh" }}>
      <Header />
      <LandingPage />
      <Footer />
    </div>
  )
}
