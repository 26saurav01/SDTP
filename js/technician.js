const activeTechId = sessionStorage.getItem("sdmsActiveTechId");
const techUserObj = AUTHORIZED_TECHNICIANS.find((t) => t.id === activeTechId);

const techActiveUser = document.getElementById("techActiveUser");
const techAccessDenied = document.getElementById("techAccessDenied");
const techAuthorizedArea = document.getElementById("techAuthorizedArea");

if (!techUserObj) {
  techActiveUser.textContent = "Unauthorized ID";
  techAccessDenied.style.display = "block";
} else {
  techActiveUser.textContent = `${techUserObj.name} (${techUserObj.id})`;
  techAuthorizedArea.style.display = "flex";

  const tbody = document.getElementById("whitelistTableBody");
  AUTHORIZED_TECHNICIANS.forEach((tech) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${tech.id}</strong></td>
      <td>${tech.email}</td>
      <td>${tech.name}</td>
      <td>${tech.dept}</td>
    `;
    tbody.appendChild(tr);
  });

  const techStudentSelect = document.getElementById("techStudentSelect");
  const state = getSTPState();
  Object.values(state.students).forEach((st) => {
    const opt = document.createElement("option");
    opt.value = st.id;
    opt.textContent = `${st.name} (${st.email})`;
    techStudentSelect.appendChild(opt);
  });

  document.getElementById("applySemBtn").addEventListener("click", () => {
    const latestState = getSTPState();
    const st = latestState.students[techStudentSelect.value];
    const chosenSem = document.getElementById("techSemUpdate").value;
    st.semester = chosenSem;
    st.owlNotifications.unshift(
      `🔐 STP Technician (${techUserObj.id}) updated your active semester to ${chosenSem}.`
    );
    saveSTPState(latestState);
    document.getElementById("techActionMsg").textContent =
      `Updated ${st.name}'s semester to ${chosenSem}.`;
  });

  document.getElementById("resetAllDemoBtn").addEventListener("click", () => {
    resetDemoSTP();
    document.getElementById("techActionMsg").textContent =
      "All STP multi-student demo records have been reset to default.";
  });
}
