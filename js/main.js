addEventListener('load', function() {
    
    document.getElementById('play').addEventListener('click', function(){
        let alies = prompt("Introdueix el teu àlies"); 
        if (alies) {
            sessionStorage.setItem('alies', alies);
            sessionStorage.removeItem('load'); 
            window.location.assign("./html/game.html");
        }
    });

	document.getElementById('scores').addEventListener('click', function(){
        window.location.assign("./html/ranking.html");
    });

    document.getElementById('options').addEventListener('click', function(){
        window.location.assign("./html/options.html");
    });

	document.getElementById('saves').addEventListener('click', function(){
		if (localStorage.getItem('save')) {
			sessionStorage.setItem('load', localStorage.getItem('save'));
			window.location.assign("./html/game.html");
		} else {
			alert("No hi ha cap partida guardada!");
		}
	});

    let clicar_sortir = document.getElementById('exit');
    if (clicar_sortir) {
        clicar_sortir.addEventListener('click', function(){
            console.warn("No es pot sortir!");
        });
    }
});
