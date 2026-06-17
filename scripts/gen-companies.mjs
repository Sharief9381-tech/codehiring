import { writeFileSync } from "fs"

const S  = JSON.stringify(["quantitative","logical","verbal","coding"])
const SA = JSON.stringify(["quantitative","logical","verbal"])
const SC = JSON.stringify(["coding","logical"])
const C  = JSON.stringify(["coding"])
const CQ = JSON.stringify(["coding","quantitative"])

const companies = [
  // IT Services
  ["tcs","TCS","TC","#7c3aed",75,60,"Medium",S,"TCS NQT","IT Services","Systems Engineer,Developer,Analyst"],
  ["infosys","Infosys","IN","#059669",95,65,"Medium",S,"InfyTQ Test","IT Services","Systems Engineer,Technology Analyst"],
  ["wipro","Wipro","WI","#0284c7",60,55,"Easy",S,"Wipro NLTH","IT Services","Project Engineer,Software Developer"],
  ["cognizant","Cognizant","CG","#0891b2",70,55,"Easy",S,"Cognizant GenC","IT Services","Programmer Analyst,GenC Developer"],
  ["capgemini","Capgemini","CA","#0369a1",75,60,"Medium",S,"Capgemini Assessment","IT Services","Software Engineer,Associate Consultant"],
  ["accenture","Accenture","AC","#a21caf",90,90,"Medium",S,"Accenture Cognitive","IT Services","Associate Software Engineer,Analyst"],
  ["hcl","HCL Technologies","HC","#16a34a",60,50,"Easy",S,"HCL GET","IT Services","Graduate Engineer Trainee,Developer"],
  ["tech-mahindra","Tech Mahindra","TM","#dc2626",60,50,"Easy",S,"Tech Mahindra SmartHire","IT Services","Software Engineer,Associate Engineer"],
  ["mphasis","Mphasis","MP","#7c3aed",60,50,"Easy",S,"Mphasis Hiring","IT Services","Software Engineer,Analyst"],
  ["hexaware","Hexaware","HX","#2563eb",60,50,"Easy",S,"Hexaware TechBee","IT Services","Graduate Engineer,Software Developer"],
  ["ltimindtree","LTIMindtree","LT","#059669",70,55,"Medium",S,"LTIMindtree Campus","IT Services","Software Engineer,Technology Analyst"],
  ["zensar","Zensar Technologies","ZN","#7c3aed",60,50,"Easy",S,"Zensar Placement","IT Services","Software Engineer,Graduate Engineer"],
  ["persistent","Persistent Systems","PS","#dc2626",70,55,"Medium",S,"Persistent Systems","IT Services","Software Engineer,Graduate Engineer"],
  ["cyient","Cyient","CY","#2563eb",65,52,"Medium",S,"Cyient Engineering","IT Services","Graduate Engineer,Software Analyst"],
  ["birlasoft","Birlasoft","BS","#7c3aed",60,50,"Easy",S,"Birlasoft Campus","IT Services","Software Developer,Analyst"],
  ["sonata","Sonata Software","SS","#0891b2",60,48,"Easy",S,"Sonata Software","IT Services","Software Developer,Analyst"],
  ["tata-elxsi","Tata Elxsi","TE","#1d4ed8",75,55,"Medium",S,"Tata Elxsi Technical","IT Services","Graduate Engineer Trainee,Design Engineer"],
  ["nisum","Nisum","NI","#7c3aed",60,50,"Medium",SC,"Nisum Coding Assessment","IT Services","Software Engineer,QA Engineer"],
  ["xoriant","Xoriant","XO","#059669",60,50,"Medium",S,"Xoriant Campus Test","IT Services","Software Engineer,Graduate Trainee"],
  ["mastech","Mastech Digital","MD","#059669",60,48,"Easy",SA,"Mastech Digital","IT Services","Software Trainee,Analyst"],
  ["3i-infotech","3i Infotech","3I","#0891b2",60,48,"Easy",SA,"3i Infotech Graduate","IT Services","Analyst,Software Engineer"],
  ["infoedge","Info Edge","IE","#dc2626",60,50,"Medium",S,"Info Edge (Naukri)","IT Services","Software Engineer,Product Analyst"],
  ["niit-tech","NIIT Technologies","NT","#059669",60,48,"Easy",S,"NIIT Technologies","IT Services","Software Trainee,Analyst"],
  // Product / FAANG
  ["amazon","Amazon","AZ","#f59e0b",90,2,"Hard",SC,"Amazon OA","Product","SDE-1,Software Engineer,SDE Intern"],
  ["microsoft","Microsoft","MS","#3b82f6",90,3,"Hard",SC,"Microsoft OA","Product","SDE,Software Engineer,PM"],
  ["google","Google","GO","#ef4444",60,2,"Very Hard",C,"Google Coding Screen","Product","SWE,L3 Engineer"],
  ["meta","Meta","ME","#1877f2",60,2,"Very Hard",C,"Meta Coding Interview","Product","Software Engineer,Research Engineer"],
  ["apple","Apple","AP","#555555",60,2,"Very Hard",C,"Apple Coding Assessment","Product","Software Engineer,SWE"],
  ["adobe","Adobe","AD","#ef4444",75,3,"Hard",SC,"Adobe OA","Product","MTS,Software Engineer"],
  ["oracle","Oracle","OR","#dc2626",90,3,"Hard",CQ,"Oracle OA","Product","Applications Engineer,Software Engineer"],
  ["atlassian","Atlassian","AT","#0052cc",75,3,"Hard",SC,"Atlassian OA","Product","Software Engineer,Developer"],
  ["salesforce","Salesforce","SF","#00a1e0",70,3,"Hard",SC,"Salesforce OA","Product","Associate MTS,Software Engineer"],
  ["qualcomm","Qualcomm","QC","#3253dc",90,3,"Hard",CQ,"Qualcomm Coding","Product","Engineer,Software Engineer"],
  ["nvidia","NVIDIA","NV","#76b900",90,3,"Very Hard",CQ,"NVIDIA Assessment","Product","Embedded Systems Engineer,SWE"],
  ["intel","Intel","IN","#0071c5",90,3,"Hard",CQ,"Intel Campus","Product","Software Engineer,Systems Engineer"],
  ["intuit","Intuit","IQ","#236cff",75,3,"Hard",SC,"Intuit Campus OA","Product","Software Engineer,SWE-1"],
  ["cisco","Cisco","CS","#1ba0d7",80,3,"Hard",SC,"Cisco Campus OA","Product","Software Engineer,Network Engineer"],
  ["samsung","Samsung RnD","SR","#1428a0",90,3,"Hard",SC,"Samsung R&D Hiring","Product","Software Engineer,Research Engineer"],
  ["palo-alto","Palo Alto Networks","PA","#fa5d00",75,3,"Hard",SC,"Palo Alto Networks OA","Product","Software Engineer,Security Engineer"],
  ["servicenow","ServiceNow","SN","#62d84e",70,3,"Hard",SC,"ServiceNow OA","Product","Software Engineer,Associate Developer"],
  ["linkedin","LinkedIn","LI","#0077b5",75,3,"Hard",SC,"LinkedIn SWE Assessment","Product","Software Engineer,SWE"],
  ["uber","Uber","UB","#000000",75,3,"Hard",SC,"Uber Campus OA","Product","Software Engineer,SWE"],
  ["stripe","Stripe","ST","#635bff",60,2,"Hard",C,"Stripe OA","Product","Software Engineer,SWE"],
  ["snowflake","Snowflake","SW","#29b5e8",70,3,"Hard",SC,"Snowflake OA","Product","Software Engineer,Data Engineer"],
  ["databricks","Databricks","DT","#ff3621",70,3,"Very Hard",C,"Databricks Campus OA","Product","Software Engineer,Data Engineer"],
  ["thoughtworks","ThoughtWorks","TW","#f05a28",90,3,"Hard",SC,"ThoughtWorks Challenge","Product","Graduate Developer,Analyst"],
  // Indian Startups
  ["flipkart","Flipkart","FK","#2874f0",90,3,"Hard",SC,"Flipkart SDE OA","Startups","SDE-1,Software Engineer"],
  ["swiggy","Swiggy","SW","#fc8019",75,3,"Hard",SC,"Swiggy SDE OA","Startups","Software Engineer,SDE"],
  ["zomato","Zomato","ZO","#e23744",75,3,"Hard",SC,"Zomato SDE OA","Startups","Software Engineer,SDE"],
  ["paytm","Paytm","PT","#00baf2",75,3,"Hard",SC,"Paytm Campus","Startups","Software Engineer,SDE"],
  ["phonepe","PhonePe","PP","#5f259f",75,3,"Hard",SC,"PhonePe SDE OA","Startups","Software Engineer,SDE"],
  ["razorpay","Razorpay","RP","#2d9cdb",75,3,"Hard",SC,"Razorpay SDE","Startups","SDE,Software Engineer"],
  ["groww","Groww","GR","#00d09c",75,3,"Hard",SC,"Groww SDE OA","Startups","Software Engineer,SDE"],
  ["meesho","Meesho","ME","#9b59b6",75,3,"Hard",SC,"Meesho SDE OA","Startups","Software Engineer,SDE"],
  ["myntra","Myntra","MY","#ff3f6c",75,3,"Hard",SC,"Myntra SDE","Startups","SDE,Software Engineer"],
  ["ola","Ola","OL","#3c9a37",75,3,"Hard",SC,"Ola Campus OA","Startups","Software Engineer,SDE"],
  ["freshworks","Freshworks","FW","#ff5a54",75,3,"Hard",SC,"Freshworks SDE OA","Startups","Software Engineer,SDE"],
  ["zoho","Zoho","ZH","#e42527",180,3,"Hard",SC,"Zoho Programming Contest","Startups","Software Engineer,Developer"],
  ["browserstack","BrowserStack","BK","#f4811f",75,3,"Hard",SC,"BrowserStack SDE OA","Startups","Software Engineer,QA Engineer"],
  ["dream11","Dream11","D1","#0074f8",75,3,"Hard",SC,"Dream11 SDE","Startups","Software Engineer,SDE"],
  ["cred","CRED","CR","#2c2c2c",60,2,"Hard",C,"CRED SDE","Startups","SDE,Software Engineer"],
  ["zepto","Zepto","ZP","#6c2dc7",60,2,"Hard",C,"Zepto SDE OA","Startups","Software Engineer,SDE"],
  ["byjus","BYJU S","BJ","#1a9af1",70,50,"Medium",S,"BYJU S Campus","Startups","Software Engineer,Content Developer"],
  ["unacademy","Unacademy","UN","#08bd80",60,45,"Medium",SC,"Unacademy Tech","Startups","Software Engineer,SDE"],
  ["makemytrip","MakeMyTrip","MM","#e74c3c",75,3,"Hard",SC,"MakeMyTrip OA","Startups","Software Engineer,SDE"],
  ["sharechat","ShareChat","SH","#4e4b93",75,3,"Hard",SC,"ShareChat SDE","Startups","Software Engineer,SDE"],
  ["zerodha","Zerodha","ZR","#387ed1",75,3,"Hard",SC,"Zerodha Tech","Startups","Software Engineer,Developer"],
  ["postman","Postman","PM","#ff6c37",75,3,"Hard",SC,"Postman SDE OA","Startups","Software Engineer,Developer"],
  ["urban-company","Urban Company","UC","#f3a712",60,45,"Medium",SC,"Urban Company SDE","Startups","Software Engineer,SDE"],
  ["cleartax","ClearTax","CT","#4caf50",60,45,"Medium",SC,"ClearTax SDE","Startups","Software Engineer,SDE"],
  // Consulting
  ["deloitte","Deloitte","DE","#15803d",80,50,"Medium",SA,"Deloitte Campus","Consulting","Analyst,Consultant,Technology Analyst"],
  ["pwc","PwC","PW","#d97706",70,45,"Medium",SA,"PwC Campus","Consulting","Associate,Technology Analyst"],
  ["kpmg","KPMG","KP","#1d4ed8",75,50,"Medium",SA,"KPMG Graduate","Consulting","Associate,Analyst"],
  ["ey","EY","EY","#f59e0b",70,45,"Medium",SA,"EY Campus","Consulting","Associate,Consultant"],
  ["mckinsey","McKinsey","MC","#1a56db",90,50,"Hard",SA,"McKinsey PST","Consulting","Business Analyst,Associate"],
  ["bcg","BCG","BC","#059669",90,50,"Hard",SA,"BCG Potential Test","Consulting","Associate,Business Analyst"],
  ["bain","Bain and Company","BA","#dc2626",90,50,"Hard",SA,"Bain Assessment","Consulting","Associate Consultant,Business Analyst"],
  ["oliver-wyman","Oliver Wyman","OW","#e11d48",80,48,"Hard",SA,"Oliver Wyman Test","Consulting","Associate,Business Analyst"],
  ["genpact","Genpact","GP","#ff6600",75,55,"Medium",S,"Genpact Campus","Consulting","Management Trainee,Process Associate"],
  ["fractal","Fractal Analytics","FA","#5c2d91",80,3,"Hard",CQ,"Fractal Data Science OA","Consulting","Data Scientist,Data Analyst"],
  ["mu-sigma","Mu Sigma","MU","#ff6600",75,50,"Medium",SA,"Mu Sigma Assessment","Consulting","Analyst,Trainee Decision Scientist"],
  ["tiger-analytics","Tiger Analytics","TA","#ff6600",90,3,"Hard",CQ,"Tiger Analytics OA","Consulting","Data Scientist,Data Analyst"],
  ["latentview","LatentView Analytics","LV","#7c3aed",80,55,"Medium",CQ,"LatentView Campus","Consulting","Data Analyst,Business Analyst"],
  ["wns","WNS Analytics","WN","#1a56db",75,55,"Medium",SA,"WNS Campus","Consulting","Analyst,Process Associate"],
  ["exl","EXL Service","EX","#dc2626",75,55,"Medium",SA,"EXL Campus","Consulting","Analyst,Process Associate"],
  // BFSI
  ["jpmorgan","JP Morgan","JP","#1a56db",90,3,"Hard",SC,"JP Morgan Code for Good","BFSI","Software Engineer,Technology Analyst"],
  ["goldman-sachs","Goldman Sachs","GS","#1a56db",90,3,"Hard",SC,"Goldman Sachs OA","BFSI","Software Engineer,Analyst"],
  ["morgan-stanley","Morgan Stanley","MO","#1d4ed8",90,3,"Hard",CQ,"Morgan Stanley Campus","BFSI","Software Engineer,Technology Associate"],
  ["deutsche-bank","Deutsche Bank","DB","#1a56db",80,55,"Medium",S,"Deutsche Bank Campus","BFSI","Analyst,Technology Analyst"],
  ["barclays","Barclays","BR","#00aeef",75,50,"Medium",SA,"Barclays Campus","BFSI","Analyst,Graduate Associate"],
  ["hsbc","HSBC","HS","#db0011",75,50,"Medium",SA,"HSBC Campus","BFSI","Analyst,Graduate Trainee"],
  ["citi","Citi","CI","#003f87",80,55,"Medium",S,"Citi ICG Technology","BFSI","Software Engineer,Technology Analyst"],
  ["nomura","Nomura","NO","#5c068c",80,3,"Hard",SC,"Nomura Technology","BFSI","Software Engineer,Technology Analyst"],
  ["amex","American Express","AE","#007ec1",80,3,"Hard",CQ,"Amex Technology OA","BFSI","Software Engineer,SDE"],
  ["mastercard","Mastercard","MC","#eb001b",80,3,"Hard",SC,"Mastercard Technology OA","BFSI","Software Engineer,Technology Analyst"],
  ["visa","Visa","VI","#1a1f71",80,3,"Hard",CQ,"Visa Campus Technology OA","BFSI","Software Engineer,Associate SWE"],
  ["icici","ICICI Bank","IC","#f47920",60,50,"Easy",SA,"ICICI Bank PO Tech","BFSI","Probationary Officer,Technology Analyst"],
  ["hdfc","HDFC Bank","HD","#00008b",60,50,"Easy",SA,"HDFC Bank Campus","BFSI","Credit Officer,Technology Analyst"],
  ["axis","Axis Bank","AX","#97144d",60,50,"Easy",SA,"Axis Bank Campus","BFSI","Relationship Manager,Technology Analyst"],
  ["sbi","SBI","SB","#1e3d8f",120,200,"Medium",SA,"SBI PO SCO Exam","BFSI","Probationary Officer,Circle Based Officer"],
  // Core Engineering
  ["tata-motors","Tata Motors","TM","#00457c",90,80,"Medium",S,"Tata Motors GET","Core Engg","Graduate Engineer Trainee,Design Engineer"],
  ["l-and-t","L and T","LT","#cc0000",90,80,"Medium",S,"L&T GET Campus","Core Engg","Graduate Engineer Trainee,Project Engineer"],
  ["bhel","BHEL","BH","#003087",120,120,"Medium",SA,"BHEL ET Assessment","Core Engg","Engineer Trainee,Supervisor Trainee"],
  ["ongc","ONGC","ON","#e41c1c",120,100,"Medium",SA,"ONGC Graduate Trainee","Core Engg","Graduate Trainee,Junior Engineer"],
  ["ntpc","NTPC","NT","#003087",120,120,"Medium",SA,"NTPC ET Assessment","Core Engg","Engineer Trainee,Executive Trainee"],
  ["iocl","IOCL","IO","#e41c1c",120,100,"Medium",SA,"IOCL Officer Assessment","Core Engg","Engineering Officer,Junior Engineer"],
  ["gail","GAIL","GA","#003087",120,100,"Medium",SA,"GAIL Executive Assessment","Core Engg","Executive Trainee,Junior Engineer"],
  ["bpcl","BPCL","BP","#e41c1c",120,100,"Medium",SA,"BPCL Engineer Assessment","Core Engg","Junior Officer,Graduate Apprentice"],
  ["maruti-suzuki","Maruti Suzuki","MS","#e41c1c",90,75,"Medium",S,"Maruti Suzuki GET","Core Engg","Graduate Engineer Trainee,Officer Trainee"],
  ["mahindra","Mahindra","MA","#e41c1c",90,75,"Medium",S,"Mahindra GET Assessment","Core Engg","GET,Management Trainee"],
  ["bosch","Bosch","BO","#e41c1c",90,75,"Medium",S,"Bosch GET Campus","Core Engg","Graduate Engineer,Software Engineer"],
  ["siemens","Siemens","SI","#009999",90,75,"Medium",S,"Siemens GET Assessment","Core Engg","Graduate Engineer,R&D Engineer"],
  ["honeywell","Honeywell","HO","#e41c1c",90,75,"Hard",S,"Honeywell Campus","Core Engg","Software Engineer,Controls Engineer"],
  ["ge","GE Digital","GE","#1a56db",90,75,"Hard",S,"GE Digital Campus OA","Core Engg","Software Engineer,Technology Analyst"],
  ["caterpillar","Caterpillar","CA","#f8a009",90,70,"Medium",S,"Caterpillar GET","Core Engg","Graduate Engineer,Software Engineer"],
  ["cummins","Cummins India","CU","#e41c1c",90,70,"Medium",S,"Cummins GET Campus","Core Engg","Graduate Engineer Trainee,Engineer"],
  ["hero-motocorp","Hero MotoCorp","HM","#003087",75,60,"Medium",S,"Hero MotoCorp GET","Core Engg","Graduate Engineer Trainee,Management Trainee"],
  ["bajaj-auto","Bajaj Auto","BA","#003087",75,60,"Medium",S,"Bajaj Auto GET","Core Engg","Graduate Engineer Trainee,Officer"],
  // Telecom
  ["ericsson","Ericsson","ER","#1a56db",90,3,"Hard",SC,"Ericsson Software OA","Telecom","Software Engineer,Systems Engineer"],
  ["nokia","Nokia","NO","#1a56db",90,3,"Hard",SC,"Nokia Campus Assessment","Telecom","Software Engineer,Network Engineer"],
  ["airtel","Bharti Airtel","AI","#e41c1c",75,55,"Medium",S,"Airtel Campus Hiring","Telecom","Graduate Engineer,Technology Analyst"],
  ["jio","Reliance Jio","JI","#003087",75,55,"Medium",S,"Jio Campus Assessment","Telecom","Graduate Engineer,Software Developer"],
  ["bsnl","BSNL","BS","#e41c1c",120,100,"Medium",SA,"BSNL JTO Exam","Telecom","Junior Telecom Officer,JE Telecom"],
  // FMCG
  ["hul","HUL","HU","#003087",90,70,"Hard",SA,"HUL Leadership Trainee","FMCG","Management Trainee,Leadership Trainee"],
  ["nestle","Nestle India","NE","#e41c1c",90,70,"Hard",SA,"Nestle Campus Assessment","FMCG","Management Trainee,Sales Trainee"],
  ["itc","ITC","IT","#003087",90,70,"Hard",SA,"ITC AET Test","FMCG","AET,Management Trainee"],
  ["pngindia","Procter and Gamble","PG","#003087",90,60,"Hard",SA,"P&G Campus Assessment","FMCG","Brand Manager Trainee,Management Trainee"],
  ["marico","Marico","MR","#e41c1c",75,55,"Hard",SA,"Marico Nxt Trainee","FMCG","Management Trainee,Sales Trainee"],
  ["reliance-retail","Reliance Retail","RR","#003087",75,60,"Medium",SA,"Reliance Retail MT","FMCG","Management Trainee,Store Manager"],
  ["dmart","D-Mart","DM","#e41c1c",75,60,"Medium",SA,"D-Mart MT Assessment","FMCG","Management Trainee,Operations Trainee"],
  // Pharma
  ["dr-reddys","Dr. Reddys","DR","#e41c1c",90,75,"Medium",SA,"Dr. Reddys Campus","Pharma","Management Trainee,Process Associate"],
  ["sun-pharma","Sun Pharmaceutical","SP","#ff6600",90,75,"Medium",SA,"Sun Pharma Campus","Pharma","Management Trainee,Research Associate"],
  ["cipla","Cipla","CI","#e41c1c",90,75,"Medium",SA,"Cipla Campus Assessment","Pharma","Management Trainee,QA Associate"],
  ["lupin","Lupin","LU","#1a56db",90,75,"Medium",SA,"Lupin Campus Assessment","Pharma","Management Trainee,Research Associate"],
  ["apollo-hospitals","Apollo Hospitals","AH","#003087",75,60,"Medium",SA,"Apollo Hospitals Campus","Pharma","Management Trainee,Administrative"],
  // EV / Auto
  ["ather","Ather Energy","AE","#00c170",75,3,"Hard",SC,"Ather Energy SWE OA","EV/Auto","Software Engineer,Firmware Engineer"],
  ["ola-electric","Ola Electric","OE","#e41c1c",75,3,"Hard",SC,"Ola Electric SWE OA","EV/Auto","Software Engineer,Embedded Engineer"],
  ["tesla","Tesla","TS","#e41c1c",90,3,"Very Hard",SC,"Tesla Engineering OA","EV/Auto","Software Engineer,Embedded Engineer"],
  ["rivian","Rivian","RI","#00c170",90,3,"Very Hard",C,"Rivian SWE OA","EV/Auto","Software Engineer,SWE"],
  // Defence
  ["drdo","DRDO","DR","#003087",120,100,"Hard",SA,"DRDO CEPTAM SET","Defence","Scientist B,Technical Assistant"],
  ["isro","ISRO","IS","#e41c1c",120,80,"Hard",SA,"ISRO Scientist Assessment","Defence","Scientist Engineer SC,Technical Assistant"],
  ["hal","HAL","HA","#003087",120,100,"Hard",SA,"HAL Management Trainee","Defence","Management Trainee,Apprentice"],
  ["bel","BEL","BE","#003087",90,80,"Medium",SA,"BEL Engineer Assessment","Defence","Engineer Trainee,Probationary Engineer"],
  ["spacex","SpaceX","SX","#333333",90,3,"Very Hard",C,"SpaceX SWE OA","Defence","Software Engineer,Flight Software Engineer"],
]

const lines = companies.map(([id,name,abbr,color,duration,questions,difficulty,sections,desc,category,rolesStr]) => {
  const roles = rolesStr.split(",").map(r => `"${r.trim()}"`).join(",")
  return `  { id:"${id}",name:"${name}",abbr:"${abbr}",color:"${color}",duration:${duration},questions:${questions},difficulty:"${difficulty}",sections:${sections},desc:"${desc}",category:"${category}",roles:[${roles}] }`
}).join(",\n")

const output = `export interface CompanyEntry {
  id: string; name: string; abbr: string; color: string
  duration: number; questions: number; difficulty: string
  sections: string[]; desc: string; category: string; roles: string[]
}

export const ALL_COMPANIES: CompanyEntry[] = [
${lines}
]
`

writeFileSync("C:/Users/shari/Music/Hiring/codehiring/lib/companies-data.ts", output, "utf8")
console.log("Written", companies.length, "companies")
