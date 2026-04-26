addEventListener('load', function() {
    
    document.getElementById('play').addEventListener('click', function(){
        let alies = prompt("Introdueix el teu àlies"); 
        if (alies) {
            sessionStorage.setItem('alies', alies);
            sessionStorage.removeItem('load'); 
            window.location.assign("./html/game.html");
        }
    });

    document.getElementById('options').addEventListener('click', function(){
        window.location.assign("./html/options.html");
    });

    document.getElementById('saves').addEventListener('click', function(){
        let to_load = localStorage.getItem('save');
        
        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        
        sessionStorage.setItem('load', to_load);
        window.location.assign("./html/game.html");
    });

    let clicar_sortir = document.getElementById('exit');
    if (clicar_sortir) {
        clicar_sortir.addEventListener('click', function(){
            console.warn("No es pot sortir!");
        });
    }
});
