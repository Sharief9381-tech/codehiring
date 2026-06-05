import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Terms of Service — CodeHiring",
  description: "Terms and conditions for using the CodeHiring platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/codehiring-logo.svg" alt="CodeHiring" width={120} height={30} className="h-7 w-auto" />
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Terms of Service</span>
          <Link href="/" className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2025</p>
        </div>

        <div className="space-y-10 text-muted-foreground">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed">
              By creating an account or using CodeHiring, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. These terms apply to all users — students, colleges, and recruiters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Eligibility</h2>
            <p className="text-sm leading-relaxed">
              You must be at least 16 years old to use CodeHiring. By using the platform, you represent that you meet this requirement and that all information you provide is accurate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Account Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must not share your account with others or impersonate another person or entity.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>Notify us immediately at <a href="mailto:support@CodeHiring.io" className="text-primary hover:underline">support@CodeHiring.io</a> if you suspect unauthorized access.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Acceptable Use</h2>
            <p className="text-sm leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Provide false or misleading information in your profile.</li>
              <li>Scrape, crawl, or harvest data from the platform without authorization.</li>
              <li>Use the platform for spam, harassment, or fraudulent activity.</li>
              <li>Attempt to reverse-engineer, hack, or exploit any part of the platform.</li>
              <li>Use another student's coding profile as your own.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Platform Data & Third Parties</h2>
            <p className="text-sm leading-relaxed">
              When you connect a third-party coding platform (LeetCode, GitHub, etc.), you authorize CodeHiring to fetch your public profile data from those platforms. You confirm you have the right to share that data. CodeHiring is not affiliated with or endorsed by any third-party platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">
              All platform content, design, and code is owned by CodeHiring. You retain ownership of your own profile data. You grant CodeHiring a non-exclusive license to display your profile data to authorized parties (recruiters, colleges) as configured in your settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Termination</h2>
            <p className="text-sm leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time. Upon deletion, your personal data will be removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">
              CodeHiring is provided "as is". We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including reliance on profile data for hiring decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to Terms</h2>
            <p className="text-sm leading-relaxed">
              We may update these terms at any time. Continued use of CodeHiring after changes constitutes acceptance of the new terms. We will notify users of material changes via email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions about these terms? Email{" "}
              <a href="mailto:legal@CodeHiring.io" className="text-primary hover:underline">legal@CodeHiring.io</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
