/**
 * Audits the aptitude question banks and reports:
 * - Questions per topic in each bank
 * - Difficulty breakdown per topic
 */
import "dotenv/config"
import { QUANTITATIVE_BANK, LOGICAL_REASONING_BANK } from "../lib/quantitative-reasoning"
import { COMMUNICATION_BANK } from "../lib/communication-bank"

function audit(name: string, bank: any[]) {
  console.log(`\n${"=".repeat(60)}`)
  console.log(`${name}  (total: ${bank.length})`)
  console.log("=".repeat(60))

  // Group by topic
  const byTopic: Record<string, { Easy: number; Medium: number; Hard: number; total: number }> = {}
  for (const q of bank) {
    const t = q.topic ?? "Unknown"
    const d = q.difficulty ?? "Medium"
    if (!byTopic[t]) byTopic[t] = { Easy: 0, Medium: 0, Hard: 0, total: 0 }
    byTopic[t].total++
    if (d === "Easy")   byTopic[t].Easy++
    else if (d === "Medium") byTopic[t].Medium++
    else if (d === "Hard")   byTopic[t].Hard++
  }

  const rows = Object.entries(byTopic).sort((a, b) => b[1].total - a[1].total)
  console.log("Topic".padEnd(38) + "Total".padStart(6) + "  Easy".padStart(6) + "  Med".padStart(6) + "  Hard".padStart(6))
  console.log("-".repeat(62))
  for (const [topic, c] of rows) {
    console.log(
      topic.slice(0, 37).padEnd(38) +
      c.total.toString().padStart(6) +
      c.Easy.toString().padStart(7) +
      c.Medium.toString().padStart(6) +
      c.Hard.toString().padStart(7)
    )
  }
}

audit("QUANTITATIVE_BANK (Aptitude)", QUANTITATIVE_BANK)
audit("LOGICAL_REASONING_BANK", LOGICAL_REASONING_BANK)
audit("COMMUNICATION_BANK (Verbal)", COMMUNICATION_BANK)

// Summary
const totalQuant = QUANTITATIVE_BANK.length
const totalLogic = LOGICAL_REASONING_BANK.length
const totalComm  = COMMUNICATION_BANK.length
const totalMedHard = [
  ...QUANTITATIVE_BANK,
  ...LOGICAL_REASONING_BANK,
  ...COMMUNICATION_BANK
].filter(q => q.difficulty === "Medium" || q.difficulty === "Hard").length

console.log(`\n${"=".repeat(60)}`)
console.log("SUMMARY")
console.log("=".repeat(60))
console.log(`Quantitative Aptitude : ${totalQuant}`)
console.log(`Logical Reasoning     : ${totalLogic}`)
console.log(`Communication/Verbal  : ${totalComm}`)
console.log(`TOTAL                 : ${totalQuant + totalLogic + totalComm}`)
console.log(`Medium+Hard only      : ${totalMedHard}`)
