const btnBack = document.getElementById('back-to-menu');
if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.location.assign('../index.html');
    });
}

const rawData = localStorage.getItem('ranking_mode2');
const ranking = rawData ? JSON.parse(rawData) : [];

function displayRanking(rankingData) {
    const tableBody = document.getElementById('ranking-body');
    if (!tableBody) return;

    tableBody.innerHTML = "";

    rankingData.sort((a, b) => b.level - a.level);

    const top10 = rankingData.slice(0, 10);

    top10.forEach((jugador, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${jugador.name}</td>
            <td>Nivell ${jugador.level}</td> 
        `;
        tableBody.appendChild(row);
    });

    if (top10.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='3'>No hi ha puntuacions encara</td></tr>";
    }
}

displayRanking(ranking);