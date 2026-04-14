const feed = document.getElementById("feed");
const boardSelect = document.getElementById("boardSelect");

let user = null;
let userPhoto = "";

let boards = {
  "Aprender a programar": []
};

let currentBoard = "Aprender a programar";

// ---------------- LOGIN ----------------
function login() {
  user = document.getElementById("usernameInput").value;
  userPhoto = document.getElementById("userPhotoInput").value;

  if (!user) return;

  document.getElementById("login").style.display = "none";

  document.getElementById("welcome").innerText =
    `Bienvenido, ${user}, es hora de dar un paso más en tu meta 🚀`;

  initBoards();
  render();
}

// ---------------- FORM ----------------
function toggleComposer() {
  document.getElementById("composer").classList.toggle("hidden");
}

// ---------------- BOARDS ----------------
function initBoards() {
  boardSelect.innerHTML = "";

  Object.keys(boards).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.innerText = name;
    boardSelect.appendChild(option);
  });

  boardSelect.value = currentBoard;
}

function changeBoard() {
  currentBoard = boardSelect.value;
  render();
}

function openBoardModal() {
  document.getElementById("boardModal").classList.remove("hidden");
}

function closeBoardModal() {
  document.getElementById("boardModal").classList.add("hidden");
}

function createBoard() {
  const name = document.getElementById("boardNameInput").value;
  if (!name) return;

  boards[name] = [];
  currentBoard = name;

  document.getElementById("boardNameInput").value = "";

  closeBoardModal();
  initBoards();
  render();
}

// ---------------- FECHA ----------------
function getDaysLeft(targetDate) {
  const today = new Date();
  const diff = new Date(targetDate) - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ---------------- TASK ----------------
function addTask() {
  const days = parseInt(document.getElementById("daysInput").value) || 0;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);

  const task = {
    title: document.getElementById("text").value,
    subtitle: document.getElementById("subtitle").value,
    schedule: document.getElementById("schedule").value,
    bg: document.getElementById("bgInput").value,
    resources: document.getElementById("resourcesInput").value.split(","),
    targetDate,
    completed: false
  };

  boards[currentBoard].unshift(task);

  render();

  document.querySelectorAll(".composer input").forEach(i => i.value = "");
  document.getElementById("composer").classList.add("hidden");
}

// ---------------- COMPLETAR ----------------
function toggleComplete(index) {
  const task = boards[currentBoard][index];
  task.completed = !task.completed;
  render();
}

// ---------------- RENDER ----------------
function render() {
  feed.innerHTML = "";

  const tasks = boards[currentBoard];

  tasks.forEach((task, index) => {
    const daysLeft = getDaysLeft(task.targetDate);

    const div = document.createElement("div");
    div.className = "task";

    if (task.completed) div.classList.add("completed");

    div.innerHTML = `
      <img src="${userPhoto}" class="avatar">

      <div class="task-card">
        <div class="task-left" style="background-image:url('${task.bg}')">
          <div class="task-overlay">
            <div class="task-title">${task.title}</div>
            <div class="task-subtitle">${task.subtitle}</div>
            <div class="task-time">${task.schedule}</div>

            <button class="complete-btn"
              onclick="toggleComplete(${index}); event.stopPropagation();">
              ${task.completed ? "✔ Completada" : "Completar"}
            </button>
          </div>
        </div>

        <div class="task-right">
          Quedan ${daysLeft} días
        </div>
      </div>
    `;

    div.onclick = () => openDetail(task);

    feed.appendChild(div);
  });
}

// ---------------- MODAL ----------------
function openDetail(task) {
  document.getElementById("detailModal").classList.remove("hidden");

  document.getElementById("d-title").innerText = task.title;
  document.getElementById("d-subtitle").innerText = task.subtitle;
  document.getElementById("d-schedule").innerText = task.schedule;
  document.getElementById("d-days").innerText =
    "Días restantes: " + getDaysLeft(task.targetDate);

  const list = document.getElementById("d-resources");
  list.innerHTML = "";

  task.resources.forEach(r => {
    const li = document.createElement("li");
    li.innerText = r;
    list.appendChild(li);
  });
}

function closeDetail() {
  document.getElementById("detailModal").classList.add("hidden");
}

// CERRAR MODAL CLICK FUERA
document.getElementById("detailModal").addEventListener("click", (e) => {
  if (e.target.id === "detailModal") closeDetail();
});