let currentStudent = getActiveStudent();
let owlIndex = 0;

function switchTab(panelName) {
  document.querySelectorAll(".game-tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.panel === panelName);
  });
  document.querySelectorAll(".module-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${panelName}`);
  });
}

document.querySelectorAll(".game-tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.panel));
});

function renderStudentLobby() {
  currentStudent = getActiveStudent();
  const s = currentStudent;
  const overallAtt = calculateOverallAttendance(s.attendance);

  document.getElementById("hudStudentId").textContent = s.id;
  document.getElementById("hudEmailTag").textContent = s.email;
  document.getElementById("hudCredits").textContent = s.curriculumCredits;
  document.getElementById("hudSkillPoints").textContent = s.skillPoints;

  const blueRack = document.getElementById("blueBadgeRack");
  blueRack.innerHTML = "";
  s.blueBadges.forEach((b) => {
    const span = document.createElement("span");
    span.className = "blue-mastery-badge";
    span.innerHTML = `<span>${b.icon}</span> ${b.label}`;
    blueRack.appendChild(span);
  });

  const yellowBadge = document.getElementById("yellowAttendanceBadge");
  const yellowTitle = document.getElementById("yellowBadgeTitle");
  const yellowSub = document.getElementById("yellowBadgeSub");
  if (overallAtt >= 90) {
    yellowBadge.className = "yellow-attendance-badge unlocked";
    yellowTitle.textContent = "GOLD ATTENDANCE BADGE (≥90%)";
    yellowSub.textContent = `Attendance: ${overallAtt}% • Unlocked!`;
  } else {
    yellowBadge.className = "yellow-attendance-badge locked";
    yellowTitle.textContent = "GOLD ATTENDANCE LOCKED (<90%)";
    yellowSub.textContent = `Current: ${overallAtt}% • Need 90% to unlock`;
  }

  const alerts = s.owlNotifications;
  document.getElementById("owlMessageBox").textContent = alerts[owlIndex % alerts.length];
  document.getElementById("owlCounter").textContent = `Alert ${(owlIndex % alerts.length) + 1} of ${alerts.length}`;

  document.getElementById("sumHandle").textContent = s.gamerHandle;
  document.getElementById("sumName").textContent = s.name;
  document.getElementById("sumUid").textContent = `UID: ${s.id} • ${s.email}`;
  document.getElementById("sumSkillLevel").textContent = s.skillLevel;
  document.getElementById("sumTierTitle").textContent = getSkillTierName(s.skillLevel);
  document.getElementById("sumStack").textContent = s.primaryStack;

  document.getElementById("tblName").textContent = s.name;
  document.getElementById("tblBranch").textContent = s.branch;
  document.getElementById("tblYearSem").textContent = `${s.year} • ${s.semester}`;
  document.getElementById("tblAttendance").textContent = `${overallAtt}%`;
  document.getElementById("tblAttendance").style.color = overallAtt >= 90 ? "#facc15" : "#fca5a5";

  const sumCertList = document.getElementById("sumCertList");
  sumCertList.innerHTML = "";
  const approvedCerts = s.certificates.filter((c) => c.status === "Approved");
  approvedCerts.forEach((c) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${c.title}</span> <span class="tag-verified">✓ Verified</span>`;
    sumCertList.appendChild(li);
  });

  const sumAchList = document.getElementById("sumAchievementList");
  sumAchList.innerHTML = "";
  s.achievements.forEach((ach) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>🏆 ${ach}</span>`;
    sumAchList.appendChild(li);
  });

  const sumProjList = document.getElementById("sumProjectList");
  sumProjList.innerHTML = "";
  s.projects.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${p.title}</span> <small style="color:#38bdf8;">${p.status}</small>`;
    sumProjList.appendChild(li);
  });

  const pathGrid = document.getElementById("academicPathGrid");
  pathGrid.innerHTML = "";
  s.academicPath.forEach((node) => {
    const div = document.createElement("div");
    div.className = `sem-node ${node.status === "Active" ? "current" : ""}`;
    div.innerHTML = `
      <strong style="color:#facc15;">${node.sem}</strong>
      <div style="font-size:0.86rem; margin:0.25rem 0;">${node.branchSec}</div>
      <small style="color:#94a3b8;">SGPA: ${node.sgpa} • ${node.status}</small>
    `;
    pathGrid.appendChild(div);
  });

  const vaultBody = document.getElementById("vaultTableBody");
  vaultBody.innerHTML = "";
  s.certificates.forEach((c) => {
    const tr = document.createElement("tr");
    const badgeClass = c.status === "Approved" ? "tag-verified" : "tag-pending";
    tr.innerHTML = `
      <td>${c.title}</td>
      <td>${c.issuer}</td>
      <td>${c.verifiedBy}</td>
      <td><span class="${badgeClass}">${c.status}</span></td>
    `;
    vaultBody.appendChild(tr);
  });

  const projBody = document.getElementById("projectsTableBody");
  projBody.innerHTML = "";
  s.projects.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.title}</td>
      <td>${p.stack}</td>
      <td>${p.status} (${p.progress}%)</td>
    `;
    projBody.appendChild(tr);
  });

  const attBody = document.getElementById("attendanceTableBody");
  attBody.innerHTML = "";
  s.attendance.forEach((a) => {
    const pct = ((a.attended / a.total) * 100).toFixed(1);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.code}</td>
      <td>${a.subject}</td>
      <td>${a.attended} / ${a.total}</td>
      <td style="font-weight:700; color:${pct >= 90 ? "#facc15" : "#38bdf8"};">${pct}%</td>
    `;
    attBody.appendChild(tr);
  });

  const marksBody = document.getElementById("marksTableBody");
  marksBody.innerHTML = "";
  s.marks.forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.subject}</td>
      <td>${m.quiz} / ${m.quizMax}</td>
      <td>${m.midSem} / ${m.midMax}</td>
    `;
    marksBody.appendChild(tr);
  });

  const wishList = document.getElementById("wishlistItems");
  wishList.innerHTML = "";
  s.wishlist.forEach((w) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>⭐ ${w.skill}</span> <span class="tag-pending">${w.priority}</span>`;
    wishList.appendChild(li);
  });
}

document.getElementById("nextOwlTipBtn").addEventListener("click", () => {
  owlIndex += 1;
  renderStudentLobby();
});

document.getElementById("certUploadForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("certTitleInput").value.trim();
  const issuer = document.getElementById("certIssuerInput").value.trim();
  if (!title || !issuer) return;

  currentStudent.certificates.push({
    id: `CERT-${Math.floor(105 + Math.random() * 890)}`,
    title,
    issuer,
    year: currentStudent.year,
    status: "Pending",
    verifiedBy: "Awaiting Faculty"
  });
  currentStudent.owlNotifications.unshift(
    `🦉 New certificate '${title}' uploaded! Waiting for Teacher verification.`
  );
  updateActiveStudent(currentStudent);
  e.target.reset();
  renderStudentLobby();
});

document.getElementById("projectAddForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("projTitleInput").value.trim();
  const stack = document.getElementById("projStackInput").value.trim();
  if (!title || !stack) return;

  currentStudent.projects.unshift({
    title,
    stack,
    progress: 25,
    status: "In Progress"
  });
  currentStudent.skillPoints += 50;
  updateActiveStudent(currentStudent);
  e.target.reset();
  renderStudentLobby();
});

document.getElementById("wishlistForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const skill = document.getElementById("wishSkillInput").value.trim();
  const priority = document.getElementById("wishPriorityInput").value;
  if (!skill) return;

  currentStudent.wishlist.unshift({ skill, category: "Custom", priority });
  updateActiveStudent(currentStudent);
  e.target.reset();
  renderStudentLobby();
});

renderStudentLobby();
