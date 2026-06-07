// Colleges of Andhra Pradesh and Telangana with code, email, location

export interface CollegeEntry {
  name: string
  code: string
  email: string
  location: string
  state: "AP" | "TG"
  type: "Engineering" | "Medical" | "Arts" | "Science" | "Management" | "Deemed" | "Central"
}

export const AP_TG_COLLEGES: CollegeEntry[] = [
  // ── TELANGANA ──────────────────────────────────────────────────────────────
  { name: "Indian Institute of Technology Hyderabad", code: "IITH", email: "academics@iith.ac.in", location: "Kandi, Sangareddy, Telangana", state: "TG", type: "Central" },
  { name: "Osmania University", code: "OU", email: "registrar@osmania.ac.in", location: "Hyderabad, Telangana", state: "TG", type: "Arts" },
  { name: "University of Hyderabad", code: "UOH", email: "registrar@uohyd.ac.in", location: "Hyderabad, Telangana", state: "TG", type: "Central" },
  { name: "Jawaharlal Nehru Technological University Hyderabad", code: "JNTUH", email: "registrar@jntuh.ac.in", location: "Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "JNTUH College of Engineering Hyderabad", code: "JNTUHJCEH", email: "principal@jntuhceh.ac.in", location: "Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Chaitanya Bharathi Institute of Technology", code: "CBIT", email: "principal@cbit.ac.in", location: "Gandipet, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Vasavi College of Engineering", code: "VCE", email: "principal@vasavi.ac.in", location: "Ibrahimbagh, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Mahatma Gandhi Institute of Technology", code: "MGIT", email: "principal@mgit.ac.in", location: "Gandipet, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Gokaraju Rangaraju Institute of Engineering and Technology", code: "GRIET", email: "principal@griet.ac.in", location: "Bachupally, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "SR Engineering College", code: "SREC", email: "principal@srec.ac.in", location: "Warangal, Telangana", state: "TG", type: "Engineering" },
  { name: "Kakatiya Institute of Technology and Science", code: "KITS", email: "principal@kitsw.ac.in", location: "Warangal, Telangana", state: "TG", type: "Engineering" },
  { name: "Kakatiya University", code: "KU", email: "registrar@kakatiya.ac.in", location: "Warangal, Telangana", state: "TG", type: "Arts" },
  { name: "National Institute of Technology Warangal", code: "NITW", email: "registrar@nitw.ac.in", location: "Warangal, Telangana", state: "TG", type: "Central" },
  { name: "Sreenidhi Institute of Science and Technology", code: "SNIST", email: "principal@sreenidhi.edu.in", location: "Ghatkesar, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "CVR College of Engineering", code: "CVRCE", email: "principal@cvr.ac.in", location: "Vastunagar, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "CMR College of Engineering and Technology", code: "CMRCET", email: "principal@cmrcet.ac.in", location: "Kandlakoya, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Muffakham Jah College of Engineering and Technology", code: "MJCET", email: "principal@mjcollege.ac.in", location: "Banjara Hills, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Vardhaman College of Engineering", code: "VCE-H", email: "principal@vardhaman.org", location: "Kacharam, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Anurag College of Engineering", code: "ACE", email: "principal@anurag.edu.in", location: "Aushapur, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Vignana Bharathi Institute of Technology", code: "VBIT", email: "principal@vbit.ac.in", location: "Aushapur, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "MLR Institute of Technology", code: "MLRIT", email: "principal@mlrinstitutions.ac.in", location: "Dundigal, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Guru Nanak Institutions Technical Campus", code: "GNITC", email: "principal@gnithyd.ac.in", location: "Ibrahimpatnam, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Vidya Jyothi Institute of Technology", code: "VJIT", email: "principal@vjit.ac.in", location: "Aziz Nagar, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Institute of Aeronautical Engineering", code: "IARE", email: "principal@iare.ac.in", location: "Dundigal, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Hyderabad Institute of Technology and Management", code: "HITAM", email: "principal@hitam.org", location: "Gowdavelly, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Stanley College of Engineering and Technology for Women", code: "SCETW", email: "principal@stanley.edu.in", location: "Abids, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Nizam Institute of Engineering and Technology", code: "NIET", email: "principal@niet.ac.in", location: "Deshmukhi, Nalgonda, Telangana", state: "TG", type: "Engineering" },
  { name: "BITS Pilani Hyderabad Campus", code: "BITSHYD", email: "admissions@hyderabad.bits-pilani.ac.in", location: "Jawahar Nagar, Hyderabad, Telangana", state: "TG", type: "Deemed" },
  { name: "ICFAI Foundation for Higher Education", code: "IFHE", email: "admissions@ifheindia.org", location: "Donthanapally, Hyderabad, Telangana", state: "TG", type: "Deemed" },
  { name: "Woxsen University", code: "WOXSEN", email: "admissions@woxsen.edu.in", location: "Kamkole, Hyderabad, Telangana", state: "TG", type: "Management" },
  { name: "Mahindra University", code: "MU-HYD", email: "admissions@mahindrauniversity.edu.in", location: "Bahadurpally, Hyderabad, Telangana", state: "TG", type: "Deemed" },
  { name: "TKR College of Engineering and Technology", code: "TKRCET", email: "principal@tkrcet.com", location: "Medbowli, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Marri Laxman Reddy Institute of Technology", code: "MLRIT-H", email: "principal@mlrit.ac.in", location: "Dundigal, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Jyothishmathi Institute of Technology and Science", code: "JITS", email: "principal@jits.ac.in", location: "Karimnagar, Telangana", state: "TG", type: "Engineering" },
  { name: "Rajiv Gandhi University of Knowledge Technologies Hyderabad", code: "RGUKT-HYD", email: "registrar@rgukt.in", location: "Basar, Nirmal, Telangana", state: "TG", type: "Engineering" },
  { name: "Kommuri Pratap Reddy Institute of Technology", code: "KPRIT", email: "principal@kprit.ac.in", location: "Ghatkesar, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Matrusri Engineering College", code: "MEC", email: "principal@matrusri.edu.in", location: "Saidabad, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Geethanjali College of Engineering and Technology", code: "GCET", email: "principal@gcet.edu.in", location: "Cheeryal, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Holy Mary Institute of Technology and Science", code: "HMIT", email: "principal@hmit.ac.in", location: "Bogaram, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Deccan College of Engineering and Technology", code: "DCET", email: "principal@deccancollege.ac.in", location: "Darussalam, Hyderabad, Telangana", state: "TG", type: "Engineering" },

  // ── ANDHRA PRADESH ─────────────────────────────────────────────────────────
  { name: "Indian Institute of Technology Tirupati", code: "IITTP", email: "registrar@iittp.ac.in", location: "Tirupati, Andhra Pradesh", state: "AP", type: "Central" },
  { name: "National Institute of Technology Andhra Pradesh", code: "NITAP", email: "registrar@nitandhra.ac.in", location: "Tadepalligudem, Andhra Pradesh", state: "AP", type: "Central" },
  { name: "Andhra University", code: "AU", email: "registrar@andhrauniversity.edu.in", location: "Visakhapatnam, Andhra Pradesh", state: "AP", type: "Arts" },
  { name: "Jawaharlal Nehru Technological University Kakinada", code: "JNTUK", email: "registrar@jntuk.edu.in", location: "Kakinada, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Jawaharlal Nehru Technological University Anantapur", code: "JNTUA", email: "registrar@jntua.ac.in", location: "Anantapur, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Sri Venkateswara University", code: "SVU", email: "registrar@svuniversity.edu.in", location: "Tirupati, Andhra Pradesh", state: "AP", type: "Arts" },
  { name: "Acharya Nagarjuna University", code: "ANU", email: "registrar@nagarjunauniversity.ac.in", location: "Guntur, Andhra Pradesh", state: "AP", type: "Arts" },
  { name: "Krishna University", code: "KRU", email: "registrar@krishnauniversity.ac.in", location: "Machilipatnam, Andhra Pradesh", state: "AP", type: "Arts" },
  { name: "Vikrama Simhapuri University", code: "VSU", email: "registrar@simhapuriuniv.ac.in", location: "Nellore, Andhra Pradesh", state: "AP", type: "Arts" },
  { name: "Rayalaseema University", code: "RU", email: "registrar@ruk.ac.in", location: "Kurnool, Andhra Pradesh", state: "AP", type: "Arts" },
  { name: "GITAM Deemed to be University", code: "GITAM", email: "admissions@gitam.edu", location: "Visakhapatnam, Andhra Pradesh", state: "AP", type: "Deemed" },
  { name: "Koneru Lakshmaiah Education Foundation University", code: "KLEF", email: "admissions@kluniversity.in", location: "Vaddeswaram, Guntur, Andhra Pradesh", state: "AP", type: "Deemed" },
  { name: "Sri Venkateswara College of Engineering", code: "SVCE", email: "principal@svce.ap.in", location: "Tirupati, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Raghu Engineering College", code: "REC", email: "principal@raghuenggcollege.in", location: "Visakhapatnam, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Andhra University College of Engineering", code: "AUCE", email: "principal@auce.ac.in", location: "Visakhapatnam, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "VFSTR University", code: "VFSTR", email: "admissions@vfstr.ac.in", location: "Vadlamudi, Guntur, Andhra Pradesh", state: "AP", type: "Deemed" },
  { name: "Vignan's Foundation for Science Technology and Research", code: "VFSIT", email: "principal@vignan.ac.in", location: "Vadlamudi, Guntur, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "RVR and JC College of Engineering", code: "RVRJC", email: "principal@rvrjc.ac.in", location: "Chowdavaram, Guntur, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Bapatla Engineering College", code: "BEC", email: "principal@bapatlaengg.ac.in", location: "Bapatla, Guntur, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "SRKR Engineering College", code: "SRKREC", email: "principal@srkrec.ac.in", location: "Bhimavaram, West Godavari, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Vignan's Institute of Information Technology", code: "VIIT", email: "principal@viit.ac.in", location: "Duvvada, Visakhapatnam, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "MVGR College of Engineering", code: "MVGR", email: "principal@mvgrce.ac.in", location: "Vizianagaram, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "GMRIT College of Engineering", code: "GMRIT", email: "principal@gmrit.edu.in", location: "Rajam, Srikakulam, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Narasaraopeta Engineering College", code: "NEC", email: "principal@nec.edu.in", location: "Narasaraopet, Guntur, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Rajiv Gandhi University of Knowledge Technologies Srikakulam", code: "RGUKT-SKLM", email: "registrar@rgukt.ac.in", location: "Idupulapaya, Srikakulam, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Rajiv Gandhi University of Knowledge Technologies Nuzvid", code: "RGUKT-NZD", email: "registrar@rkv.rgukt.in", location: "Nuzvid, Krishna, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Rajiv Gandhi University of Knowledge Technologies Ongole", code: "RGUKT-ONG", email: "registrar@ong.rgukt.in", location: "Ongole, Prakasam, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Sri Vasavi Engineering College", code: "SVEC", email: "principal@srivasaviengg.ac.in", location: "Tadepalligudem, West Godavari, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Chalapathi Institute of Engineering and Technology", code: "CIET", email: "principal@chalapathiengg.ac.in", location: "Guntur, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Sri Bharathi Engineering College for Women", code: "SBECW", email: "principal@sribharathiengcollege.com", location: "Etcherla, Srikakulam, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "G. Pullaiah College of Engineering and Technology", code: "GPCET", email: "principal@gpcet.ac.in", location: "Kurnool, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "PBR Visvodaya Institute of Technology and Science", code: "PVITS", email: "principal@pvitspu.in", location: "Kavali, Nellore, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Sri Indu College of Engineering and Technology", code: "SICET", email: "principal@sriindu.ac.in", location: "Ibrahimpatnam, Hyderabad, Telangana", state: "TG", type: "Engineering" },
  { name: "Lendi Institute of Engineering and Technology", code: "LIET", email: "principal@lendi.edu.in", location: "Jonnada, Vizianagaram, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Avanthi Institute of Engineering and Technology", code: "AIET", email: "principal@avanthi.edu.in", location: "Visakhapatnam, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Anil Neerukonda Institute of Technology and Sciences", code: "ANITS", email: "principal@anits.edu.in", location: "Bheemunipatnam, Visakhapatnam, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Pragati Engineering College", code: "PRAGATI", email: "principal@pragati.ac.in", location: "Surampalem, East Godavari, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Seshadri Rao Gudlavalleru Engineering College", code: "SRGEC", email: "principal@srec.ac.in", location: "Gudlavalleru, Krishna, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "Velagapudi Ramakrishna Siddhartha Engineering College", code: "VRSEC", email: "principal@vrsiddhartha.ac.in", location: "Vijayawada, Andhra Pradesh", state: "AP", type: "Engineering" },
  { name: "KL University", code: "KLU", email: "admissions@klu.ac.in", location: "Vaddeswaram, Guntur, Andhra Pradesh", state: "AP", type: "Deemed" },
  { name: "Amrita Vishwa Vidyapeetham Amaravati", code: "AMRITA-AP", email: "admissions@amrita.edu", location: "Amaravati, Andhra Pradesh", state: "AP", type: "Deemed" },
  { name: "VIT-AP University", code: "VITAP", email: "admissions@vitap.ac.in", location: "Amaravati, Andhra Pradesh", state: "AP", type: "Deemed" },
  { name: "SRM University AP", code: "SRMAP", email: "admissions@srmap.edu.in", location: "Neerukonda, Mangalagiri, Andhra Pradesh", state: "AP", type: "Deemed" },
  { name: "Bennett University Amaravati", code: "BENUAP", email: "admissions@bennett.edu.in", location: "Amaravati, Andhra Pradesh", state: "AP", type: "Deemed" },
]

export function searchColleges(query: string): CollegeEntry[] {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return AP_TG_COLLEGES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q)
  ).slice(0, 8)
}
