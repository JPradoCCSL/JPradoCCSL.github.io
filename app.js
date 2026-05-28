import { db } from './firebase-config.js';

import {
  ref,
  onValue,
  set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const teams = [
  "Los Payicos",
  "Las Ranas",
  "Los Conejos",
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

function initializeTeams() {

  onValue(teamsRef, (snapshot) => {

    if (!snapshot.exists()) {

      const initialData = {};

      teams.forEach(team => {

        initialData[team] = {
          points: 0,
          victories: 0,
          cooperative: 0
        };

      });

      set(teamsRef, initialData);

    }

  }, {
    onlyOnce: true
  });

}

function quitarArticulo(nombre) {
  const articulos = ["Los ", "Las ", "El ", "La "];
  for (let art of articulos) {
    if (nombre.startsWith(art)) {
      return nombre.slice(art.length);
    }
  }
  return nombre;
}

function renderLeaderboard(data) {

  const sorted = Object.entries(data).sort((a,b) => {
    return b[1].points - a[1].points;
  });

  leaderboard.innerHTML = "";

  sorted.forEach((team,index) => {

    const [name,stats] = team;

    const row = document.createElement("tr");

    row.classList.add("updated");

    if(index === 0) row.classList.add("first");
    if(index === 1) row.classList.add("second");
    if(index === 2) row.classList.add("third");

    row.innerHTML = `
      <td class="position">${index + 1}</td>
      <td>${quitarArticulo(name)}</td>
      <td class="points">${stats.points}</td>
      <td class="victories">${stats.victories}</td>
      <td class="coop">${stats.cooperative}</td>
    `;

    leaderboard.appendChild(row);

  });

  leaderboard.innerHTML = "";

  sorted.forEach((team,index) => {

    const [name,stats] = team;

    const row = document.createElement("tr");

    row.classList.add("updated");

    if(index === 0) row.classList.add("first");
    if(index === 1) row.classList.add("second");
    if(index === 2) row.classList.add("third");

    row.innerHTML = `
      <td class="position">${index + 1}</td>
      <td>${name}</td>
      <td class="points">${stats.points}</td>
      <td class="victories">${stats.victories}</td>
      <td class="coop">${stats.cooperative}</td>
    `;

    leaderboard.appendChild(row);

  });

}

onValue(teamsRef, (snapshot) => {

  const data = snapshot.val();

  if(data){
    renderLeaderboard(data);
  }

});

initializeTeams();
