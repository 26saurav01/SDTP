const teacherHeaderName = document.getElementById("facultyHeaderName");
const savedTeacherName = sessionStorage.getItem("stpActiveTeacherName");
if (savedTeacherName) {
  teacherHeaderName.textContent = savedTeacherName;
}

const teacherStudentSelector = document.getElementById("teacherStudentSelector");
const facultySkillSelect = document.getElementById("facultySkillSelect");
const subjectSelect = document.getElementById("subjectSelect");
const attAttended = document.getElementById("attAttended");
const attTotal = document.getElementById("attTotal");
const quizScoreInput = document.getElementById("quizScoreInput");
const facultyCertTableBody = document.getElementById("facultyCertTableBody");

function populateStudentDropdown() {
  const state = getSTPState();
  teacherStudentSelector.innerHTML = "";
  Object.values(state.students).forEach((st) => {
    const opt = document.createElement("option");
    opt.value = st.id;
    opt.textContent = `${st.name} (${st.id} — ${st.email})`;
    teacherStudentSelector.appendChild(opt);
  });
  const active = getActiveStudent();
  teacherStudentSelector.value = active.id;
}

function getSelectedStudentForTeacher() {
  const state = getSTPState();
  const id = teacherStudentSelector.value || state.activeStudentId;
  sessionStorage.setItem("stpActiveStudentId", id);
  return state.students[id];
}

function populateTeacherForms() {
  const st = getSelectedStudentForTeacher();
  facultySkillSelect.value = String(st.skillLevel);

  subjectSelect.innerHTML = "";
  st.attendance.forEach((a, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = `${a.subject} (${a.code})`;
    subjectSelect.appendChild(opt);
  });

  loadSubjectFields();
  renderCertQueue();
}

function loadSubjectFields() {
  const st = getSelectedStudentForTeacher();
  const idx = Number(subjectSelect.value) || 0;
  const att = st.attendance[idx];
  const mk = st.marks[idx];
  attAttended.value = att.attended;
  attTotal.value = att.total;
  quizScoreInput.value = mk ? mk.quiz : 18;
}

teacherStudentSelector.addEventListener("change", () => {
  document.getElementById("facultySkillMsg").textContent = "";
  document.getElementById("amsSaveMsg").textContent = "";
  populateTeacherForms();
});

subjectSelect.addEventListener("change", loadSubjectFields);

document.getElementById("skillAssignForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const st = getSelectedStudentForTeacher();
  const newLvl = Number(facultySkillSelect.value);
  const newAch = document.getElementById("newAchievementInput").value.trim();

  st.skillLevel = newLvl;
  st.skillTierTitle = getSkillTierName(newLvl);
  if (newAch) {
    st.achievements.unshift(newAch);
    st.skillPoints += 100;
  }
  st.owlNotifications.unshift(
    `⚡ Faculty updated your STP Skill Rank to Level ${newLvl} (${getSkillTierName(newLvl)})!`
  );
  updateActiveStudent(st);
  document.getElementById("newAchievementInput").value = "";
  document.getElementById("facultySkillMsg").textContent =
    `Saved! ${st.name}'s Skill Level is now Level ${newLvl}.`;
});

document.getElementById("amsUpdateForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const st = getSelectedStudentForTeacher();
  const idx = Number(subjectSelect.value) || 0;
  const attended = Number(attAttended.value);
  const total = Number(attTotal.value);
  const quiz = Number(quizScoreInput.value);

  if (attended > total) {
    alert("Classes attended cannot exceed total classes.");
    return;
  }

  st.attendance[idx].attended = attended;
  st.attendance[idx].total = total;
  if (st.marks[idx]) {
    st.marks[idx].quiz = quiz;
  }

  const overall = calculateOverallAttendance(st.attendance);
  st.owlNotifications.unshift(
    `📊 AMS Update: ${st.attendance[idx].subject} attendance updated. Overall attendance: ${overall}%`
  );
  updateActiveStudent(st);
  document.getElementById("amsSaveMsg").textContent =
    `AMS saved for ${st.name}! Overall attendance: ${overall}% (${overall >= 90 ? "Gold Badge Active" : "Below 90% Gold Threshold"}).`;
});

function renderCertQueue() {
  const st = getSelectedStudentForTeacher();
  facultyCertTableBody.innerHTML = "";
  st.certificates.forEach((cert, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cert.id}</td>
      <td>${cert.title}</td>
      <td>${cert.issuer}</td>
      <td><span class="${cert.status === "Approved" ? "tag-verified" : "tag-pending"}">${cert.status}</span></td>
      <td style="display:flex; gap:0.4rem;">
        <button type="button" class="btn-sm btn-approve" onclick="verifyCert(${index}, 'Approved')">Approve</button>
        <button type="button" class="btn-sm btn-reject" onclick="verifyCert(${index}, 'Pending')">Hold / Pending</button>
      </td>
    `;
    facultyCertTableBody.appendChild(tr);
  });
}

window.verifyCert = function (index, status) {
  const st = getSelectedStudentForTeacher();
  st.certificates[index].status = status;
  st.certificates[index].verifiedBy =
    status === "Approved" ? (savedTeacherName || "Prof. N. Kulkarni") : "Awaiting Faculty";
  if (status === "Approved") {
    st.skillPoints += 120;
    st.owlNotifications.unshift(
      `🛡️ Certificate '${st.certificates[index].title}' approved & unlocked on your STP profile!`
    );
  }
  updateActiveStudent(st);
  renderCertQueue();
};

populateStudentDropdown();
populateTeacherForms();
