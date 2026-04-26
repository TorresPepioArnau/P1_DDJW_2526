const container = document.getElementById('llistat-partides');
const btnBack = document.getElementById('back-to-menu');

if (btnBack) {
    btnBack.onclick = function() {
        window.location.assign('../index.html');
    };
}

const rawSaves = localStorage.getItem('saves_list');
const savesList = rawSaves ? JSON.parse(rawSaves) : [];

if (container) {
    if (savesList.length === 0) {
        container.innerHTML = "<p>No hi ha partides guardades localment.</p>";
    } else {
        container.innerHTML = ""; 
        
        savesList.forEach(partida => {
    const btn = document.createElement('button');
    btn.innerText = partida.etiqueta;
    btn.classList.add('center');
    btn.onclick = function() {
        sessionStorage.setItem('load', JSON.stringify(partida.dades));
        sessionStorage.setItem('currentSaveId', partida.id);
        window.location.assign("./game.html");
    };

    container.appendChild(btn);
});
    }
}

