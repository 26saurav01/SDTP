let selectedRole = "student";

const roleTabs = document.querySelectorAll(".role-tab");
const emailLabel = document.getElementById("emailLabel");
const loginEmail = document.getElementById("loginEmail");
const displayNameField = document.getElementById("displayNameField");
const studentDisplayName = document.getElementById("studentDisplayName");
const roleHintBox = document.getElementById("roleHintBox");
const loginError = document.getElementById("loginError");
const sdmsLoginForm = document.getElementById("sdmsLoginForm");
const googleSignInBtn = document.getElementById("googleSignInBtn");

function fillPreset(email, name) {
  loginEmail.value = email;
  if (studentDisplayName) studentDisplayName.value = name;
  loginError.style.display = "none";
}
window.fillPreset = fillPreset;

const ROLE_UI = {
  student: {
    label: "Official MITS Student Email ID",
    placeholder: "e.g., bttc2601121@mitsgwl.ac.in",
    defaultVal: "bttc2601121@mitsgwl.ac.in",
    showName: true,
    hint: `<strong>Instant Student Access:</strong> Enter <em>any</em> <code>@mitsgwl.ac.in</code> email (e.g., your own enrolment email) or click a sample below:
      <div class="quick-preset-row">
        <button type="button" class="preset-pill" onclick="fillPreset('bttc2601121@mitsgwl.ac.in', 'Saurav Kumar')">Saurav (CST)</button>
        <button type="button" class="preset-pill" onclick="fillPreset('btcs2601045@mitsgwl.ac.in', 'Ananya Sharma')">Ananya (CSE)</button>
        <button type="button" class="preset-pill" onclick="fillPreset('btai2601088@mitsgwl.ac.in', 'Rohan Verma')">Rohan (AI &amp; DS)</button>
      </div>`,
    redirect: "student.html"
  },
  teacher: {
    label: "Official MITS Faculty Email ID (or Faculty ID)",
    placeholder: "e.g., nkulkarni@mitsgwl.ac.in",
    defaultVal: "nkulkarni@mitsgwl.ac.in",
    showName: false,
    hint: `<strong>Teacher Access:</strong> Any verified faculty <code>@mitsgwl.ac.in</code> email can sign in. Sample: <code>nkulkarni@mitsgwl.ac.in</code> or <code>averma@mitsgwl.ac.in</code>.`,
    redirect: "teacher.html"
  },
  technician: {
    label: "Authorized Technician Email or ID (Restricted)",
    placeholder: "e.g., rksharma.tech@mitsgwl.ac.in or TECH-MITS-01",
    defaultVal: "rksharma.tech@mitsgwl.ac.in",
    showName: false,
    hint: `<strong>Restricted Technician Access:</strong> Only whitelisted IDs/emails allowed: <code>TECH-MITS-01</code> (<code>rksharma.tech@mitsgwl.ac.in</code>) or <code>TECH-MITS-02</code>.`,
    redirect: "technician.html"
  }
};

roleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    roleTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    selectedRole = tab.dataset.role;

    const cfg = ROLE_UI[selectedRole];
    emailLabel.textContent = cfg.label;
    loginEmail.placeholder = cfg.placeholder;
    loginEmail.value = cfg.defaultVal;
    displayNameField.style.display = cfg.showName ? "flex" : "none";
    roleHintBox.innerHTML = cfg.hint;
    loginError.style.display = "none";
  });
});

function completeSignIn() {
  loginError.style.display = "none";
  const rawInput = loginEmail.value.trim();

  if (!rawInput) {
    loginError.style.display = "block";
    loginError.textContent = "Please enter your official @mitsgwl.ac.in email ID.";
    return;
  }

  if (selectedRole === "student") {
    if (!rawInput.toLowerCase().endsWith(COLLEGE_EMAIL_DOMAIN)) {
      loginError.style.display = "block";
      loginError.textContent =
        "Invalid domain: Please sign in using your official @mitsgwl.ac.in college email ID.";
      return;
    }
    const student = getOrProvisionStudentByEmail(rawInput, studentDisplayName.value);
    sessionStorage.setItem("stpActiveStudentId", student.id);
    sessionStorage.setItem("sdmsActiveRole", "student");
    window.location.href = "student.html";
    return;
  }

  if (selectedRole === "teacher") {
    const cleanLower = rawInput.toLowerCase();
    const matchedTeacher = AUTHORIZED_TEACHERS.find(
      (t) => t.email.toLowerCase() === cleanLower || t.id.toLowerCase() === cleanLower
    );
    if (!matchedTeacher && !cleanLower.endsWith(COLLEGE_EMAIL_DOMAIN)) {
      loginError.style.display = "block";
      loginError.textContent =
        "Please enter an official faculty @mitsgwl.ac.in email ID or Faculty ID (e.g., nkulkarni@mitsgwl.ac.in).";
      return;
    }
    const teacherName = matchedTeacher
      ? `${matchedTeacher.name} (${matchedTeacher.dept})`
      : `Faculty (${cleanLower})`;
    sessionStorage.setItem("stpActiveTeacherName", teacherName);
    sessionStorage.setItem("sdmsActiveRole", "teacher");
    window.location.href = "teacher.html";
    return;
  }

  if (selectedRole === "technician") {
    const cleanLower = rawInput.toLowerCase();
    const allowedTech = AUTHORIZED_TECHNICIANS.find(
      (t) => t.id.toLowerCase() === cleanLower || t.email.toLowerCase() === cleanLower
    );
    if (!allowedTech) {
      loginError.style.display = "block";
      loginError.textContent =
        "Access Denied: Only whitelisted STP Technicians (TECH-MITS-01 / rksharma.tech@mitsgwl.ac.in) are permitted.";
      return;
    }
    sessionStorage.setItem("sdmsActiveTechId", allowedTech.id);
    sessionStorage.setItem("sdmsActiveRole", "technician");
    window.location.href = "technician.html";
  }
}

sdmsLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  completeSignIn();
});

googleSignInBtn.addEventListener("click", () => {
  completeSignIn();
});
