import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Privacy Policy — CodeHiring",
  description: "How CodeHiring collects, uses, and protects your data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/codehiring-logo.svg" alt="CodeHiring" width={120} height={30} className="h-7 w-auto" />
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Privacy Policy</span>
          <Link href="/" className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-muted-foreground">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed mb-4">When you use CodeHiring, we collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong className="text-foreground">Account data</strong> — name, email address, role (student / college / recruiter), and password (hashed).</li>
              <li><strong className="text-foreground">Profile data</strong> — college, branch, graduation year, company name, designation, and preferences you provide.</li>
              <li><strong className="text-foreground">Platform usernames</strong> — LeetCode, GitHub, Codeforces, and other coding platform handles you connect.</li>
              <li><strong className="text-foreground">Performance data</strong> — coding stats fetched from third-party platforms via public APIs (problems solved, ratings, contest history).</li>
              <li><strong className="text-foreground">Usage data</strong> — pages visited, features used, and session metadata for improving the product.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>To operate and improve the CodeHiring platform.</li>
              <li>To display your coding performance to colleges and recruiters (based on your permissions).</li>
              <li>To provide AI-powered job matching and skill assessments.</li>
              <li>To send product updates, notifications, and essential service emails.</li>
              <li>To generate anonymized aggregate statistics shown on the landing page.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Sharing</h2>
            <p className="leading-relaxed text-sm">
              We do <strong className="text-foreground">not</strong> sell your personal data. Your profile is only visible to recruiters or colleges based on your explicit settings. Aggregate anonymized stats (total students, total problems solved, etc.) are shown publicly on the platform without identifying individuals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Platforms</h2>
            <p className="leading-relaxed text-sm">
              When you connect a coding platform (e.g., LeetCode, GitHub), we fetch your public profile data using that platform's API. We store only the data necessary to display your stats. We are not responsible for the privacy practices of those third-party platforms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Retention</h2>
            <p className="leading-relaxed text-sm">
              We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us at <a href="mailto:support@CodeHiring.io" className="text-primary hover:underline">support@CodeHiring.io</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Security</h2>
            <p className="leading-relaxed text-sm">
              Passwords are hashed using SHA-256 with a server-side salt and never stored in plain text. All data is transmitted over HTTPS. See our <Link href="/security" className="text-primary hover:underline">Security page</Link> for more details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Access the data we hold about you.</li>
              <li>Correct inaccurate information in your profile.</li>
              <li>Request deletion of your account and data.</li>
              <li>Withdraw consent for data processing at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact</h2>
            <p className="leading-relaxed text-sm">
              For privacy-related questions, email us at{" "}
              <a href="mailto:privacy@CodeHiring.io" className="text-primary hover:underline">privacy@CodeHiring.io</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
