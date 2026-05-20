// Demo users — used when auth is bypassed (no login required)
import type { StudentProfile, CollegeProfile, RecruiterProfile } from "./types"

export const DEMO_STUDENT: StudentProfile = {
  _id: "demo-student-1",
  email: "student@demo.com",
  name: "Demo Student",
  role: "student",
  collegeCode: "DEMO",
  rollNumber: "21CS001",
  graduationYear: 2025,
  branch: "CSE",
  skills: ["JavaScript", "Python", "C++"],
  linkedPlatforms: {},
  stats: {
    totalProblems: 0,
    easyProblems: 0,
    mediumProblems: 0,
    hardProblems: 0,
    githubContributions: 0,
    contestsParticipated: 0,
    rating: 0,
  },
  isOpenToWork: true,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
}

export const DEMO_COLLEGE: CollegeProfile = {
  _id: "demo-college-1",
  email: "college@demo.com",
  name: "Demo College",
  role: "college",
  collegeName: "Demo Institute of Technology",
  collegeCode: "DEMO",
  location: "Demo City, India",
  totalStudents: 0,
  departments: ["CSE", "ECE", "ME"],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
}

export const DEMO_RECRUITER: RecruiterProfile = {
  _id: "demo-recruiter-1",
  email: "recruiter@demo.com",
  name: "Demo Recruiter",
  role: "recruiter",
  companyName: "Demo Corp",
  designation: "HR Manager",
  hiringFor: ["Software Engineer", "Frontend Developer"],
  preferredSkills: ["JavaScript", "Python", "React"],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
}
