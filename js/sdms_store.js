// Centralized MITS STP (Student Development Tracking Platform) Multi-User Store
const STP_STORAGE_KEY = "mits_stp_platform_v2";
const COLLEGE_EMAIL_DOMAIN = "@mitsgwl.ac.in";

// Whitelisted Faculty Accounts
const AUTHORIZED_TEACHERS = [
  { id: "FAC-MITS-104", email: "nkulkarni@mitsgwl.ac.in", name: "Prof. N. Kulkarni", dept: "CSE & CST" },
  { id: "FAC-MITS-208", email: "averma@mitsgwl.ac.in", name: "Dr. Anjali Verma", dept: "CSE & CST" },
  { id: "FAC-MITS-312", email: "rsingh@mitsgwl.ac.in", name: "Prof. Rajeev Singh", dept: "IT & AI" }
];

// Restricted Technician Whitelist (Only specific authorized technician/faculty IDs allowed)
const AUTHORIZED_TECHNICIANS = [
  { id: "TECH-MITS-01", email: "rksharma.tech@mitsgwl.ac.in", name: "Er. R. K. Sharma (Lab Tech Admin)", dept: "CSE & CST" },
  { id: "TECH-MITS-02", email: "skillcell.tech@mitsgwl.ac.in", name: "Dr. Anjali Verma (Skill Cell Coordinator)", dept: "CSE & CST" }
];

function createStudentTemplate({ id, gamerHandle, name, email, branch, year, semester, skillLevel, primaryStack, attendance, marks, blueBadges, certificates, achievements, projects }) {
  return {
    id,
    gamerHandle,
    name,
    email: email.toLowerCase(),
    branch,
    year,
    semester,
    curriculumCredits: 22,
    skillPoints: 1200 + skillLevel * 120,
    skillLevel,
    skillTierTitle: getSkillTierName(skillLevel),
    primaryStack,
    blueBadges: blueBadges || [
      { id: "cp", label: "CP Coder", icon: "⚡" },
      { id: "py", label: "Python Pro", icon: "🐍" },
      { id: "js", label: "JS Explorer", icon: "🟨" }
    ],
    academicPath: [
      { sem: "Sem 1 (Current)", branchSec: `${branch} — Active`, sgpa: "8.90 (Est.)", status: "Active" },
      { sem: "Sem 2 (Upcoming)", branchSec: `${branch} — Track A`, sgpa: "Target 9.20", status: "Unlocked Next" },
      { sem: "Sem 3", branchSec: `${branch} — Core`, sgpa: "Locked", status: "Upcoming" }
    ],
    attendance: attendance || [
      { code: "34261107", subject: "Web Technology Lab", attended: 28, total: 30 },
      { code: "34261101", subject: "Programming for Problem Solving", attended: 37, total: 40 },
      { code: "34261102", subject: "Engineering Mathematics-I", attended: 35, total: 38 }
    ],
    marks: marks || [
      { subject: "Web Technology Lab", quiz: 19, quizMax: 20, midSem: 27, midMax: 30 },
      { subject: "Programming for Problem Solving", quiz: 18, quizMax: 20, midSem: 26, midMax: 30 },
      { subject: "Engineering Mathematics-I", quiz: 17, quizMax: 20, midSem: 25, midMax: 30 }
    ],
    certificates: certificates || [
      { id: "CERT-101", title: "Python Basics & Logic", issuer: "MITS Coding Club", year, status: "Approved", verifiedBy: "Prof. N. Kulkarni" },
      { id: "CERT-102", title: "Smart India Hackathon Internal", issuer: "Innovation Cell", year, status: "Pending", verifiedBy: "Awaiting Faculty" }
    ],
    achievements: achievements || [
      "MITS Freshers Coding Challenge Participant",
      "Active Lab Contributor"
    ],
    projects: projects || [
      { title: "STP Portfolio & Skill Tracker", stack: "HTML5, CSS3, JS", progress: 85, status: "In Progress" }
    ],
    wishlist: [
      { skill: "Java Object-Oriented Programming", category: "Language", priority: "High" },
      { skill: "C++ STL & Competitive Programming", category: "Core CS", priority: "High" }
    ],
    owlNotifications: [
      `🦉 Hoot! Welcome to STP, ${name}! Your @mitsgwl.ac.in account is synced.`,
      "⚡ Keep overall attendance ≥ 90% to keep your Golden Honor Badge active!"
    ]
  };
}

const DEFAULT_STP_STATE = {
  activeStudentId: "BTTC2601121",
  students: {
    "BTTC2601121": createStudentTemplate({
      id: "BTTC2601121",
      gamerHandle: "CODE_SAURAV_121",
      name: "Saurav Kumar",
      email: "bttc2601121@mitsgwl.ac.in",
      branch: "CST",
      year: "1st Year",
      semester: "1st Sem (Sec B)",
      skillLevel: 4,
      primaryStack: "Python & JavaScript",
      blueBadges: [
        { id: "cp", label: "CP Coder", icon: "⚡" },
        { id: "js", label: "JS Specialist", icon: "🟨" },
        { id: "py", label: "Python Pro", icon: "🐍" },
        { id: "topper", label: "Quiz Topper", icon: "👑" },
        { id: "mining", label: "Code Mining", icon: "⛏️" },
        { id: "freelance", label: "Freelancer", icon: "🚀" }
      ],
      certificates: [
        { id: "CERT-101", title: "Python Basics & Logic", issuer: "MITS Coding Club", year: "1st Year", status: "Approved", verifiedBy: "Prof. N. Kulkarni" },
        { id: "CERT-102", title: "Web Dev Bootcamp", issuer: "Tech Fest MITS", year: "1st Year", status: "Approved", verifiedBy: "Prof. N. Kulkarni" },
        { id: "CERT-103", title: "AI/ML Foundations Workshop", issuer: "Department Seminar", year: "1st Year", status: "Approved", verifiedBy: "Dr. Anjali Verma" },
        { id: "CERT-104", title: "Smart India Hackathon Internal", issuer: "Innovation Cell", year: "1st Year", status: "Pending", verifiedBy: "Awaiting Faculty" }
      ],
      achievements: [
        "Hackathon Winner (MITS Freshers Hack)",
        "Topper — Web Tech Lab Quiz 1",
        "5-Day Coding Streak Master"
      ],
      projects: [
        { title: "STP — Student Development Tracking Platform", stack: "HTML5, CSS3, JS, XML", progress: 95, status: "In Progress" },
        { title: "MathPulse Arithmetic Arena", stack: "JavaScript, DOM, LocalStorage", progress: 100, status: "Completed" }
      ]
    }),
    "BTCS2601045": createStudentTemplate({
      id: "BTCS2601045",
      gamerHandle: "ANANYA_DEV_045",
      name: "Ananya Sharma",
      email: "btcs2601045@mitsgwl.ac.in",
      branch: "CSE",
      year: "1st Year",
      semester: "1st Sem (Sec A)",
      skillLevel: 5,
      primaryStack: "C++ & React",
      attendance: [
        { code: "34261107", subject: "Web Technology Lab", attended: 29, total: 30 },
        { code: "34261101", subject: "Programming for Problem Solving", attended: 38, total: 40 },
        { code: "34261102", subject: "Engineering Mathematics-I", attended: 36, total: 38 }
      ]
    }),
    "BTAI2601088": createStudentTemplate({
      id: "BTAI2601088",
      gamerHandle: "ROHAN_ML_088",
      name: "Rohan Verma",
      email: "btai2601088@mitsgwl.ac.in",
      branch: "AI & DS",
      year: "1st Year",
      semester: "1st Sem (Sec A)",
      skillLevel: 3,
      primaryStack: "Python & Data Science",
      attendance: [
        { code: "34261107", subject: "Web Technology Lab", attended: 24, total: 30 },
        { code: "34261101", subject: "Programming for Problem Solving", attended: 32, total: 40 },
        { code: "34261102", subject: "Engineering Mathematics-I", attended: 31, total: 38 }
      ]
    })
  }
};

function getSTPState() {
  const saved = localStorage.getItem(STP_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STP_STORAGE_KEY, JSON.stringify(DEFAULT_STP_STATE));
    return JSON.parse(JSON.stringify(DEFAULT_STP_STATE));
  }
  return JSON.parse(saved);
}

function saveSTPState(state) {
  localStorage.setItem(STP_STORAGE_KEY, JSON.stringify(state));
}

function getOrProvisionStudentByEmail(emailInput, customName) {
  const state = getSTPState();
  const cleanEmail = emailInput.trim().toLowerCase();

  // Check if student already exists by email or enrolment ID
  const existingKey = Object.keys(state.students).find((key) => {
    const st = state.students[key];
    return st.email.toLowerCase() === cleanEmail || st.id.toLowerCase() === cleanEmail;
  });

  if (existingKey) {
    state.activeStudentId = existingKey;
    saveSTPState(state);
    return state.students[existingKey];
  }

  // Provision a brand-new student profile automatically for any valid @mitsgwl.ac.in email
  const prefix = cleanEmail.split("@")[0].toUpperCase();
  const derivedName = customName
    ? customName.trim()
    : prefix
        .replace(/[0-9]/g, "")
        .replace(/[._-]/g, " ")
        .trim() || `Student ${prefix}`;

  const formattedName = derivedName
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  const newStudent = createStudentTemplate({
    id: prefix,
    gamerHandle: `${prefix}_STP`,
    name: formattedName,
    email: cleanEmail,
    branch: prefix.startsWith("BTTC") ? "CST" : prefix.startsWith("BTAI") ? "AI & DS" : "CSE",
    year: "1st Year",
    semester: "1st Sem",
    skillLevel: 2,
    primaryStack: "C & Python"
  });

  state.students[prefix] = newStudent;
  state.activeStudentId = prefix;
  saveSTPState(state);
  return newStudent;
}

function getActiveStudent() {
  const state = getSTPState();
  const sessionStudentId = sessionStorage.getItem("stpActiveStudentId");
  const targetId = sessionStudentId && state.students[sessionStudentId]
    ? sessionStudentId
    : state.activeStudentId || "BTTC2601121";
  return state.students[targetId];
}

function updateActiveStudent(updatedStudent) {
  const state = getSTPState();
  state.students[updatedStudent.id] = updatedStudent;
  state.activeStudentId = updatedStudent.id;
  saveSTPState(state);
}

function calculateOverallAttendance(attendanceList) {
  let totalAttended = 0;
  let totalClasses = 0;
  attendanceList.forEach((item) => {
    totalAttended += Number(item.attended);
    totalClasses += Number(item.total);
  });
  if (totalClasses === 0) return 0;
  return Number(((totalAttended / totalClasses) * 100).toFixed(1));
}

function getSkillTierName(level) {
  const tiers = {
    1: "L1 — BASICS EXPLORER",
    2: "L2 — DEVELOPED CODER",
    3: "L3 — GOOD PRACTITIONER",
    4: "L4 — INTERMEDIATE DEVELOPER",
    5: "L5 — PROFICIENT BUILDER",
    6: "L6 — ADVANCED ARCHITECT",
    7: "L7 — TOP TIER GRANDMASTER"
  };
  return tiers[level] || "L4 — INTERMEDIATE DEVELOPER";
}

function resetDemoSTP() {
  localStorage.setItem(STP_STORAGE_KEY, JSON.stringify(DEFAULT_STP_STATE));
}
