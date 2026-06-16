import { db } from './firebase-config.js';
import {
  ref,
  get,
  update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const teams = [
  "Los Payicos",
  "Los Roars",
  "Los Xocas",
  "Los Inigualables",
  "Nosotr@s Juramos",
  "Los Veteranos",
  "Los Melocotoneros",
  "Los Haramball",
  "Sin Filtros",
  "Los Koalas",
  "Los Conguitos",
  "Codigo 7"
];

const MATCH_TIME = 15 * 60;

let timeLeft = MATCH_TIME;
let timerInterval = null;
let isRunning = false;

const timer = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");

function renderTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    renderTimer();
  } else {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    startBtn.textContent = "Iniciar partido";
    alert("¡Tiempo finalizado!");
  }
}

startBtn.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    startBtn.textContent = "Reanudar partido";
  } else {
    if (timeLeft === 0) timeLeft = MATCH_TIME;
    timerInterval = setInterval(tick, 1000);
    isRunning = true;
    startBtn.textContent = "Pausar partido";
  }
});

resetTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  timeLeft = MATCH_TIME;
  renderTimer();
  startBtn.textContent = "Iniciar partido";
});

const team1Select = document.getElementById("team1");
const team2Select = document.getElementById("team2");
const team1Name = document.getElementById("team1Name");
const team2Name = document.getElementById("team2Name");

const score1El = document.getElementById("score1");
const score2El = document.getElementById("score2");
const coop1El = document.getElementById("coop1");
const coop2El = document.getElementById("coop2");

let score1 = 0;
let score2 = 0;

teams.forEach(team => {
  const option1 = document.createElement("option");
  option1.value = team;
  option1.textContent = team;
  
  const option2 = document.createElement("option");
  option2.value = team;
  option2.textContent = team;
  
  team1Select.appendChild(option1);
  team2Select.appendChild(option2);
});

team2Select.selectedIndex = 1;

function updateNames() {
  team1Name.textContent = team1Select.value;
  team2Name.textContent = team2Select.value;
}

updateNames();
team1Select.addEventListener("change", updateNames);
team2Select.addEventListener("change", updateNames);

document.getElementById("plus1").onclick = () => {
  score1++;
  score1El.textContent = score1;
};

document.getElementById("minus1").onclick = () => {
  if (score1 > 0) {
    score1--;
    score1El.textContent = score1;
  }
};

document.getElementById("plus2").onclick = () => {
  score2++;
  score2El.textContent = score2;
};

document.getElementById("minus2").onclick = () => {
  if (score2 > 0) {
    score2--;
    score2El.textContent = score2;
  }
};

document.getElementById("saveBtn").onclick = async () => {
  const team1 = team1Select.value;
  const team2 = team2Select.value;

  if (team1 === team2) {
    alert("Selecciona equips diferents");
    return;
  }

  const snapshot = await get(ref(db, "teams"));
  const data = snapshot.val();

  let points1 = 0;
  let points2 = 0;
  let victories1 = 0;
  let victories2 = 0;

  if (score1 > score2) {
    points1 = 2;
    victories1 = 1;
  } else if (score2 > score1) {
    points2 = 2;
    victories2 = 1;
  } else {
    points1 = 1;
    points2 = 1;
  }

  const coop1 = Number(coop1El.value) || 0;
  const coop2 = Number(coop2El.value) || 0;

  data[team1].points += points1 + coop1 + 1;
  data[team2].points += points2 + coop2 + 1;

  data[team1].victories += victories1;
  data[team2].victories += victories2;

  data[team1].cooperative += coop1;
  data[team2].cooperative += coop2;

  data[team1].participation = (data[team1].participation || 0) + 1;
  data[team2].participation = (data[team2].participation || 0) + 1;

  await update(ref(db, "teams"), data);

  alert("Resultat desat");

  score1 = 0;
  score2 = 0;
  score1El.textContent = 0;
  score2El.textContent = 0;
  coop1El.value = 0;
  coop2El.value = 0;
};

document.getElementById("resetBtn").onclick = async () => {
  const confirmReset = confirm("¿Seguro que quieres reiniciar TODO el torneo?");
  if (!confirmReset) return;

  const resetData = {};
  teams.forEach(team => {
    const puntosIniciales = (team === "Los Koalas" || team === "Los Haramball") ? 3 : 0;
    resetData[team] = {
      points: puntosIniciales,
      victories: 0,
      cooperative: 0,
      participation: 0
    };
  });

  await update(ref(db, "teams"), resetData);
  alert("Torneo reiniciado");
};

renderTimer();
