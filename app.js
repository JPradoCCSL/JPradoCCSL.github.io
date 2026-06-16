import { db } from './firebase-config.js';
import {
  ref,
  onValue,
  set,
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

const leaderboard = document.getElementById("leaderboard");
const teamsRef = ref(db, "teams");

function quitarArticulo(nombre) {
  const articulos = ["Los ", "Las ", "El ", "La "];
  for (let art of articulos) {
    if (nombre.startsWith(art)) {
      return nombre.slice(art.length);
    }
  }
  return nombre;
}

// Función para sincronizar equipos: añade los nuevos, elimina los antiguos
async function syncTeams() {
  const snapshot = await get(ref(db, "teams"));
  const existingData = snapshot.val() || {};
  
  const newData = {};
  
  teams.forEach(team => {
    const puntosIniciales = (team === "Los Koalas" || team === "Los Haramball") ? 3 : 0;
    
    if (existingData[team]) {
      // Equipo ya existe, mantener datos pero asegurar que tiene participation
      newData[team] = {
        points: existingData[team].points || puntosIniciales,
        victories: existingData[team].victories || 0,
        cooperative: existingData[team].cooperative || 0,
        participation: existingData[team].participation || 0
      };
    } else {
      // Nuevo equipo, crear desde cero
      newData[team] = {
        points: puntosIniciales,
        victories: 0,
        cooperative: 0,
        participation: 0
      };
    }
  });
  
  await set(teamsRef, newData);
}

function renderLeaderboard(data) {
  const sorted = Object.entries(data).sort((a, b) => {
    return b[1].points - a[1].points;
  });

  leaderboard.innerHTML = "";

  sorted.forEach((team, index) => {
    const [name, stats] = team;

    const row = document.createElement("tr");
    row.classList.add("updated");

    if (index === 0) row.classList.add("first");
    if (index === 1) row.classList.add("second");
    if (index === 2) row.classList.add("third");

    row.innerHTML = `
      <td class="position">${index + 1}</td>
      <td>${quitarArticulo(name)}</td>
      <td class="points">${stats.points}</td>
      <td class="victories">${stats.victories}</td>
      <td class="coop">${stats.cooperative}</td>
      <td class="participation">${stats.participation || 0}</td>
    `;

    leaderboard.appendChild(row);
  });
}

// Primero sincronizar equipos, luego escuchar cambios
syncTeams().then(() => {
  onValue(teamsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      renderLeaderboard(data);
    }
  });
});
