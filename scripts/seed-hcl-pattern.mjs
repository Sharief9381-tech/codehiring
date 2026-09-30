/**
 * Seed HCL Technologies assessment pattern into MongoDB.
 * Updates company_patterns + pattern_embeddings.
 * Run: node scripts/seed-hcl-pattern.mjs
 */
import { MongoClient } from "mongodb"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
function loadEnv(p) {
  try {
    for (const line of readFileSync(p,"utf8").split("\n")) {
      const eq=line.indexOf("="); if(eq<0||line.trim().startsWith("#")) continue;
      const k=line.slice(0,eq).trim(),v=line.slice(eq+1).trim();
      if(k&&!process.env[k]) process.env[k]=v;
    }
  } catch {}
}
loadEnv(join(__dirname,"../.env"))

const VOCAB=256
function hashEmbed(text){
  const words=text.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(w=>w.length>2)
  const vec=new Array(VOCAB).fill(0)
  for(const w of words){let h=5381;for(let i=0;i<w.length;i++)h=((h<<5)+h)+w.charCodeAt(i);vec[Math.abs(h)%VOCAB]+=1}
  const norm=Math.sqrt(vec.reduce((s,v)=>s+v*v,0))||1
  return vec.map(v=>v/norm)
}

function buildText(companyName,sectionId,sectionName,topics,questions,timeMinutes,difficulty,notes){
  return [`${companyName} campus placement exam 2025`,`Section: ${sectionName} (${sectionId})`,
    `Questions: ${questions}, Time: ${timeMinutes} minutes`,`Difficulty: ${difficulty}`,
    topics.length>0?`Topics: ${topics.join(", ")}`:"",notes?`Notes: ${notes}`:"",
    `Exam pattern for ${companyName} online assessment GET recruitment test`].filter(Boolean).join("\n")
}

const HCL_PATTERN = {
  company:"hcl", companyName:"HCL Technologies",
  fetchedAt:new Date(), source:"fallback",
  totalQuestions:55, totalTime:75,
  notes:"HCL TechBee / GET. No negative marking. Sectional time limits apply.",
  sections:[
    {id:"quantitative",    name:"Quantitative Ability",  questions:15,timeMinutes:20,difficulty:"Easy-Medium",topics:["Percentages","Time & Work","Speed & Distance","Averages","Number Series","Simple Interest","Profit & Loss","Ratio & Proportion"],isCoding:false},
    {id:"advanced-aptitude",name:"Logical Reasoning",   questions:15,timeMinutes:20,difficulty:"Easy-Medium",topics:["Blood Relations","Directions","Coding-Decoding","Series Completion","Analogies","Statement & Conclusion","Syllogisms","Puzzles"],  isCoding:false},
    {id:"verbal",          name:"Verbal Ability",        questions:15,timeMinutes:15,difficulty:"Easy",       topics:["Synonyms/Antonyms","Fill in the Blanks","Reading Comprehension","Error Detection","Sentence Completion","Idioms & Phrases"],    isCoding:false},
    {id:"basic-coding",    name:"Basic Programming MCQ", questions:5, timeMinutes:10,difficulty:"Easy",       topics:["Loops","Arrays","String Operations","Basic Math","Pattern Printing","Conditional Logic"],                                         isCoding:false},
    {id:"advanced-coding", name:"Coding",                questions:1, timeMinutes:30,difficulty:"Easy-Medium",topics:["Arrays","Strings","Sorting","Basic Recursion","Math Problems","Hash Map"],                                                       isCoding:true},
  ],
}

async function main(){
  const client=new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  const db=client.db("codetrack")

  // 1. Update company_patterns
  await db.collection("company_patterns").updateOne(
    {company:"hcl"},
    {$set:{...HCL_PATTERN,updatedAt:new Date()}},
    {upsert:true}
  )
  console.log("✅ company_patterns updated for HCL")

  // 2. Upsert pattern_embeddings
  const ops=HCL_PATTERN.sections.map(s=>{
    const text=buildText(HCL_PATTERN.companyName,s.id,s.name,s.topics,s.questions,s.timeMinutes,s.difficulty,HCL_PATTERN.notes)
    const embedding=hashEmbed(text)
    return {
      updateOne:{
        filter:{company:"hcl",sectionId:s.id},
        update:{$set:{company:"hcl",companyName:"HCL Technologies",sectionId:s.id,sectionName:s.name,
          questions:s.questions,timeMinutes:s.timeMinutes,difficulty:s.difficulty,topics:s.topics,
          isCoding:s.isCoding,year:2025,notes:HCL_PATTERN.notes,source:"fallback",
          textContent:text,embedding,updatedAt:new Date()},
          $setOnInsert:{createdAt:new Date()}},
        upsert:true
      }
    }
  })
  const result=await db.collection("pattern_embeddings").bulkWrite(ops,{ordered:false})
  console.log(`✅ pattern_embeddings: upserted ${result.upsertedCount}, modified ${result.modifiedCount}`)

  await client.close()
  console.log("Done — HCL assessment pattern seeded.")
}

main().catch(e=>{console.error("❌",e.message);process.exit(1)})
