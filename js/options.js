var options_manager = (function(){
    
    const default_options = {
        numCards: 4,
        groupSize: 2, 
        difficulty: 'normal',
        startLevelMode2: 1 
    } 


    var inputNumCards = document.getElementById('numCards');
    var inputGroupSize = document.getElementById('groupSize');
    var inputDifficulty = document.getElementById('dif');
    var inputStartLevel = document.getElementById('startLevel');
    
    var savedOptions = localStorage.options ? JSON.parse(localStorage.options) : {};
    var currentOptions = Object.assign({}, default_options, savedOptions);

    if (inputNumCards) inputNumCards.value = currentOptions.numCards;
    if (inputGroupSize) inputGroupSize.value = currentOptions.groupSize;
    if (inputDifficulty) inputDifficulty.value = currentOptions.difficulty;
    if (inputStartLevel) inputStartLevel.value = currentOptions.startLevelMode2;

    return {
        applyChanges: function(){
            currentOptions.numCards = parseInt(inputNumCards.value);
            currentOptions.groupSize = parseInt(inputGroupSize.value);
            currentOptions.difficulty = inputDifficulty.value;
            currentOptions.startLevelMode2 = parseInt(inputStartLevel.value);

            localStorage.options = JSON.stringify(currentOptions);
            
            sessionStorage.setItem('groupSize', currentOptions.groupSize);
            sessionStorage.setItem('numCards', currentOptions.numCards);
        },
        defaultValues: function(){
            currentOptions = Object.assign({}, default_options);
            if (inputNumCards) inputNumCards.value = currentOptions.numCards;
            if (inputGroupSize) inputGroupSize.value = currentOptions.groupSize;
            if (inputDifficulty) inputDifficulty.value = currentOptions.difficulty;
            if (inputStartLevel) inputStartLevel.value = currentOptions.startLevelMode2;
        }
    }
})();

document.getElementById('default').addEventListener('click', function(){
    options_manager.defaultValues();
});

document.getElementById('apply').addEventListener('click', function(){
    options_manager.applyChanges();
    location.assign("../");
});