/**
 * Seed PYQ embeddings into MongoDB pyq_embeddings collection.
 * Uses local 256-dim hash embedding (no OpenAI needed).
 * Also creates pyq_vector_index for Atlas Vector Search.
 * Run: node scripts/seed-pyq-embeddings.mjs
 */
import { MongoClient } from "mongodb"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env
function loadEnv(envPath) {
  try {
    const text = readFileSync(envPath, "utf8")
    for (const line of text.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq < 0) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      if (key && !process.env[key]) process.env[key] = val
    }
  } catch {}
}
loadEnv(join(__dirname, "../.env"))

// 256-dim hash embedding
const VOCAB_SIZE = 256
function hashEmbed(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2)
  const vec = new Array(VOCAB_SIZE).fill(0)
  for (const word of words) {
    let h = 5381
    for (let i = 0; i < word.length; i++) h = ((h << 5) + h) + word.charCodeAt(i)
    vec[Math.abs(h) % VOCAB_SIZE] += 1
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  return vec.map(v => v / norm)
}

// PYQ data from question-bank.ts
const PYQS = [
  // TCS Quantitative
  { company:"tcs", section:"quantitative", year:2023, difficulty:"Medium", topic:"Time & Work", question:"A can do a work in 15 days and B in 20 days. If they work together for 4 days, fraction of work left?", options:["8/15","7/15","9/15","6/15"], correct:0, explanation:"Work/day=7/60. In 4 days=7/15 done. Left=8/15" },
  { company:"tcs", section:"quantitative", year:2023, difficulty:"Medium", topic:"Percentages", question:"If 20% of a number is 120, what is 35% of that number?", options:["200","210","205","195"], correct:1, explanation:"Number=600, 35% of 600=210" },
  { company:"tcs", section:"quantitative", year:2023, difficulty:"Medium", topic:"Speed & Distance", question:"A train 240m long passes a pole in 24 seconds. Time to pass a 650m platform?", options:["89 sec","85 sec","90 sec","80 sec"], correct:0, explanation:"Speed=10m/s, Time=890/10=89sec" },
  { company:"tcs", section:"quantitative", year:2023, difficulty:"Hard", topic:"Probability", question:"Two dice thrown simultaneously. Probability of getting sum 9?", options:["1/9","1/6","5/36","4/36"], correct:0, explanation:"4 pairs sum to 9. P=4/36=1/9" },
  { company:"tcs", section:"quantitative", year:2022, difficulty:"Medium", topic:"Profit & Loss", question:"Shopkeeper sold at 10% loss. If sold Rs.50 more, 5% gain. Cost price?", options:["Rs.333","Rs.300","Rs.400","Rs.350"], correct:0, explanation:"0.15x=50, x=333" },
  { company:"tcs", section:"quantitative", year:2023, difficulty:"Medium", topic:"Number Series", question:"Find missing: 3, 7, 15, 31, 63, ?", options:["127","125","128","124"], correct:0, explanation:"Each term = previous×2+1" },
  { company:"tcs", section:"quantitative", year:2022, difficulty:"Hard", topic:"Permutation & Combination", question:"In how many ways can letters of LEADER be arranged?", options:["360","720","180","540"], correct:0, explanation:"6!/2! = 360 (E repeats twice)" },
  { company:"tcs", section:"quantitative", year:2023, difficulty:"Medium", topic:"Simple Interest", question:"Principal Rs.1200, Rate 5% per annum, Time 3 years. Simple interest?", options:["Rs.180","Rs.200","Rs.150","Rs.210"], correct:0, explanation:"SI = 1200*5*3/100 = 180" },
  // TCS Advanced Aptitude
  { company:"tcs", section:"advanced-aptitude", year:2023, difficulty:"Medium", topic:"Blood Relations", question:"A is father of B. C is mother of B. D is brother of A. How is D related to B?", options:["Uncle","Father","Cousin","Grandfather"], correct:0, explanation:"D is brother of A (father of B), so D is uncle of B" },
  { company:"tcs", section:"advanced-aptitude", year:2023, difficulty:"Medium", topic:"Seating Arrangement", question:"5 people A,B,C,D,E sit in a row. A is left of B, C is right of B, D is left of A. Who sits middle?", options:["A","B","C","D"], correct:1, explanation:"Order: D A B C E — B is in middle" },
  { company:"tcs", section:"advanced-aptitude", year:2022, difficulty:"Hard", topic:"Syllogisms", question:"All cats are dogs. Some dogs are birds. Conclusion: Some cats are birds?", options:["True","False","Maybe","Cannot determine"], correct:3, explanation:"Cannot determine from given statements" },
  { company:"tcs", section:"advanced-aptitude", year:2023, difficulty:"Medium", topic:"Coding-Decoding", question:"If APPLE=30, MANGO=40 then BANANA=?", options:["42","45","40","48"], correct:0, explanation:"Sum of position values of letters" },
  { company:"tcs", section:"advanced-aptitude", year:2023, difficulty:"Medium", topic:"Directions", question:"A person walks 5km North, turns right walks 3km, turns right walks 5km. How far from start?", options:["3km","5km","2km","8km"], correct:0, explanation:"Displaced 3km East from start" },
  // TCS Verbal
  { company:"tcs", section:"verbal", year:2023, difficulty:"Easy", topic:"Vocabulary", question:"Choose word closest in meaning to VERBOSE", options:["Concise","Wordy","Silent","Brief"], correct:1, explanation:"Verbose means using more words than needed" },
  { company:"tcs", section:"verbal", year:2023, difficulty:"Easy", topic:"Grammar", question:"Choose correct sentence: She ___ to school every day.", options:["go","goes","going","gone"], correct:1, explanation:"Third person singular uses 'goes'" },
  { company:"tcs", section:"verbal", year:2022, difficulty:"Medium", topic:"Reading Comprehension", question:"The passage suggests that technology has primarily affected communication by making it faster and more accessible. What is the main theme?", options:["Technology impact","Social media","Education","Health"], correct:0, explanation:"The passage is about technology's impact on communication" },
  // Infosys
  { company:"infosys", section:"quantitative", year:2023, difficulty:"Medium", topic:"Averages", question:"Average of 5 numbers is 40. One excluded, average becomes 38. Excluded number?", options:["48","50","45","42"], correct:0, explanation:"Sum=200. New sum=152. Excluded=48" },
  { company:"infosys", section:"quantitative", year:2023, difficulty:"Medium", topic:"Ratio & Proportion", question:"Ratio A:B=3:5 and B:C=2:3. Find A:B:C", options:["6:10:15","3:5:8","6:15:10","3:6:5"], correct:0, explanation:"A:B:C = 6:10:15" },
  { company:"infosys", section:"advanced-aptitude", year:2023, difficulty:"Medium", topic:"Puzzles", question:"3 boxes: apples, oranges, both. All labels wrong. Pick one fruit from one box to identify all?", options:["From mixed-label box","From apple box","From orange box","Any box"], correct:0, explanation:"Since all labels wrong, mixed-label box has only one type" },
  { company:"infosys", section:"advanced-aptitude", year:2023, difficulty:"Medium", topic:"Data Interpretation", question:"Sales: Jan=100, Feb=120, Mar=90, Apr=130. Average monthly sales?", options:["110","115","105","120"], correct:0, explanation:"(100+120+90+130)/4=440/4=110" },
  // Wipro
  { company:"wipro", section:"quantitative", year:2023, difficulty:"Easy", topic:"Percentages", question:"Reduction of 20% in sugar price enables buying 3kg more for Rs.120. Original price per kg?", options:["Rs.10","Rs.8","Rs.12","Rs.15"], correct:0, explanation:"0.2*120/3=8, original = 8/0.8=10" },
  { company:"wipro", section:"quantitative", year:2023, difficulty:"Easy", topic:"Time & Work", question:"Pipe A fills tank in 4h, B in 6h. Together fill time?", options:["2.4h","3h","2h","3.5h"], correct:0, explanation:"Combined rate=1/4+1/6=5/12. Time=12/5=2.4h" },
  { company:"wipro", section:"advanced-aptitude", year:2023, difficulty:"Easy", topic:"Analogy", question:"Book : Library :: Painting : ?", options:["Museum","Artist","Canvas","Color"], correct:0, explanation:"Books are kept in library, paintings in museum" },
  // Cognizant
  { company:"cognizant", section:"quantitative", year:2023, difficulty:"Easy", topic:"Algebra", question:"If x+y=10 and xy=24, find x²+y²", options:["52","48","100","76"], correct:0, explanation:"x²+y²=(x+y)²-2xy=100-48=52" },
  { company:"cognizant", section:"quantitative", year:2023, difficulty:"Easy", topic:"Number System", question:"LCM of 12, 15, 20 is?", options:["60","120","180","240"], correct:0, explanation:"LCM(12,15,20)=60" },
  // Capgemini
  { company:"capgemini", section:"quantitative", year:2023, difficulty:"Medium", topic:"Number System", question:"Sum of first 50 natural numbers?", options:["1275","1250","1300","1225"], correct:0, explanation:"n(n+1)/2 = 50*51/2 = 1275" },
  { company:"capgemini", section:"advanced-aptitude", year:2023, difficulty:"Easy", topic:"Series", question:"Next in series: 2, 6, 12, 20, 30, ?", options:["42","40","44","38"], correct:0, explanation:"Differences: 4,6,8,10,12 — next is 30+12=42" },
  // Accenture
  { company:"accenture", section:"quantitative", year:2023, difficulty:"Medium", topic:"Data Interpretation", question:"Company revenue: 2020=500, 2021=600, 2022=750. Growth rate 2021-2022?", options:["25%","20%","30%","15%"], correct:0, explanation:"(750-600)/600*100=25%" },
  // Amazon coding
  { company:"amazon", section:"advanced-coding", year:2023, difficulty:"Hard", topic:"Dynamic Programming", question:"Maximum sum subarray (Kadane algorithm). Time complexity?", options:["O(n)","O(n²)","O(n log n)","O(1)"], correct:0, explanation:"Kadane runs O(n) single pass" },
  { company:"amazon", section:"advanced-coding", year:2023, difficulty:"Medium", topic:"Two Pointers", question:"Sorted array, find two numbers summing to target. Best approach?", options:["Two pointers O(n)","Binary search O(n log n)","Hash map O(n)","Brute force O(n²)"], correct:0, explanation:"Two pointers O(n) time O(1) space" },
  { company:"amazon", section:"basic-coding", year:2023, difficulty:"Medium", topic:"Sliding Window", question:"Find max sum of subarray of size k. Time complexity?", options:["O(n)","O(nk)","O(n²)","O(k)"], correct:0, explanation:"Sliding window gives O(n)" },
  // Google
  { company:"google", section:"advanced-coding", year:2023, difficulty:"Hard", topic:"Graph Algorithms", question:"Shortest path in unweighted graph. Which algorithm?", options:["BFS","DFS","Dijkstra","Bellman-Ford"], correct:0, explanation:"BFS gives shortest path in unweighted graphs" },
  { company:"google", section:"advanced-coding", year:2023, difficulty:"Hard", topic:"Dynamic Programming", question:"Number of ways to climb n stairs taking 1 or 2 steps at a time. Pattern?", options:["Fibonacci sequence","Factorial","Powers of 2","Linear"], correct:0, explanation:"f(n)=f(n-1)+f(n-2) — Fibonacci" },
  // Microsoft
  { company:"microsoft", section:"advanced-coding", year:2023, difficulty:"Medium", topic:"Trees", question:"Binary tree height. Recurrence relation?", options:["h(n)=1+max(h(left),h(right))","h(n)=h(left)+h(right)","h(n)=min(h(left),h(right))","h(n)=1"], correct:0, explanation:"Height=1+max of left and right subtree heights" },
  { company:"microsoft", section:"basic-coding", year:2023, difficulty:"Easy", topic:"Arrays", question:"Reverse an array in-place. Time complexity?", options:["O(n)","O(n²)","O(log n)","O(1)"], correct:0, explanation:"Two pointers, swap n/2 times = O(n)" },
  // Deloitte
  { company:"deloitte", section:"quantitative", year:2023, difficulty:"Medium", topic:"Data Interpretation", question:"Sales Q1=50, Q2=70, Q3=60, Q4=80. Average quarterly sales?", options:["65","70","60","75"], correct:0, explanation:"(50+70+60+80)/4=65" },
  { company:"deloitte", section:"verbal", year:2023, difficulty:"Medium", topic:"Critical Reasoning", question:"All published books are reviewed. This book is reviewed. Conclusion: This book is published?", options:["True","False","Cannot determine","Maybe"], correct:2, explanation:"Not all reviewed books need to be published" },
  // JP Morgan
  { company:"jpmorgan", section:"quantitative", year:2023, difficulty:"Medium", topic:"Financial Math", question:"Investment of Rs.10000 at 8% per annum compound interest for 2 years?", options:["Rs.11664","Rs.11600","Rs.11500","Rs.11700"], correct:0, explanation:"10000*(1.08)²=11664" },
  // Goldman Sachs
  { company:"goldman-sachs", section:"quantitative", year:2023, difficulty:"Hard", topic:"Probability", question:"Bag has 4 red, 3 blue, 2 green balls. Prob of drawing 2 red balls?", options:["2/7","1/6","3/14","2/9"], correct:1, explanation:"C(4,2)/C(9,2) = 6/36 = 1/6" },
  // Zoho
  { company:"zoho", section:"advanced-coding", year:2023, difficulty:"Hard", topic:"Recursion", question:"Tower of Hanoi with n disks. Minimum moves required?", options:["2^n - 1","n²","2^n","n!"], correct:0, explanation:"T(n)=2T(n-1)+1 = 2^n-1" },
  // Freshworks
  { company:"freshworks", section:"quantitative", year:2023, difficulty:"Medium", topic:"Percentages", question:"Product price increased 20% then decreased 20%. Net change?", options:["-4%","0%","+4%","-2%"], correct:0, explanation:"1.2*0.8=0.96, net -4%" },
]

async function main() {
  console.log("🔌 Connecting to MongoDB...")
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  const db = client.db("codetrack")
  const col = db.collection("pyq_embeddings")

  // Build ops with hash embeddings
  const ops = PYQS.map(q => {
    const text = `${q.company} ${q.section} ${q.topic} ${q.question} ${q.options.join(" ")}`
    const embedding = hashEmbed(text)
    return {
      updateOne: {
        filter: { company: q.company, section: q.section, question: q.question },
        update: {
          $set: { ...q, embedding, updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date() },
        },
        upsert: true,
      },
    }
  })

  console.log(`📦 Seeding ${ops.length} PYQs...`)
  const result = await col.bulkWrite(ops, { ordered: false })
  console.log(`✅ Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`)

  // Create pyq_vector_index
  try {
    const idx = await col.createSearchIndex({
      name: "pyq_vector_index",
      type: "vectorSearch",
      definition: {
        fields: [{ type: "vector", path: "embedding", numDimensions: 256, similarity: "cosine" }],
      },
    })
    console.log("🔍 pyq_vector_index created:", idx)
  } catch (e) {
    if (e.message.includes("already") || e.message.includes("Duplicate")) {
      console.log("🔍 pyq_vector_index already exists")
    } else {
      console.log("Index error:", e.message)
    }
  }

  // Poll for READY
  console.log("⏳ Waiting for index to become READY...")
  for (let i = 0; i < 12; i++) {
    const indexes = await col.listSearchIndexes().toArray()
    const idx = indexes.find(x => x.name === "pyq_vector_index")
    console.log(`  Status: ${idx?.status ?? "NOT FOUND"}`)
    if (idx?.status === "READY") { console.log("✅ pyq_vector_index is READY"); break }
    await new Promise(r => setTimeout(r, 8000))
  }

  await client.close()
  console.log("\nDone.")
}

main().catch(e => { console.error("❌", e.message); process.exit(1) })
