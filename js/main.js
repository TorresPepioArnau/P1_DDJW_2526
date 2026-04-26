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
		window.location.assign("./html/saves.html");
	});


	document.getElementById('exit').addEventListener('click', function(){
		alert("Gràcies per jugar, ja pots tancar la finestra");
	});

});