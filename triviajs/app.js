const travelTrivia = {};

travelTrivia.url = 'https://opentdb.com/api.php';
travelTrivia.buttonChoices = $('.answerButtons');
travelTrivia.counter = 0;
travelTrivia.maxQuestions = 10;
travelTrivia.timer;

travelTrivia.startGame = function() {
    $("#startBtn").on('click', function() {
        $('h1, .textContainer, #startBtn')
        .css('visibility', 'hidden')
        .fadeTo('slow', 0);
        $('.difficulty')
        .fadeTo('slow', 1)
        .css('z-index', 10);  
    }) 
}

travelTrivia.chooseDifficulty = function() {
    $('.difficultyBtn').on('click', function() {
        let difficulty = $(this).text().toLowerCase();
        travelTrivia.difficulty = difficulty;
        travelTrivia.displayMainGame();
        travelTrivia.getData(difficulty);
    })
}

travelTrivia.displayMainGame = function() {
    $('main').css('display', 'block');
    $([document.documentElement, document.body]).animate({
        scrollTop: $("main").offset().top
    }, 800);
    $('h1, .textContainer, #startBtn')
    .css('visibility', 'initial')
    .fadeTo('slow', 1);
    $('.difficulty')
    .fadeTo('slow', 0)
    .css('z-index', -1);
}

travelTrivia.getData = function(chosenDifficulty) {
    $.ajax({
        url: travelTrivia.url,
        method: 'GET',
        dataType: 'json',
        data: {
            amount: 1,
            category: 22,
            difficulty: chosenDifficulty,
            type: 'multiple'
        }
     }).then( function (arrayOfData) {
        arrayOfObj = arrayOfData.results[0];
        travelTrivia.counter++;
        if (travelTrivia.counter !== travelTrivia.maxQuestions + 1) {
        $('.mainGame').fadeTo(2000, 1);
        travelTrivia.clockTimer();
        travelTrivia.fiftyFiftyButton();
        travelTrivia.freePass();
        travelTrivia.displayQuestion(arrayOfObj);
        travelTrivia.displayChoices(arrayOfObj);
        travelTrivia.buttonChoices.css('pointer-events', 'initial');
        } else {
            travelTrivia.endGame(); 
        }
    })
}

// display question on the page  
travelTrivia.displayQuestion = function(array) {
    const question = array['question'];
    $('.question p').text(`${question}`);
}

// display answers randomly
travelTrivia.displayChoices  = function(array) {
    let rightAnswer = array['correct_answer'];
    let wrongAnswers = array['incorrect_answers'];
    let answers = [rightAnswer, ...wrongAnswers];
    answers.sort(function() { return Math.floor(4*Math.random()) });
    for (let i = 0; i <  answers.length; i++ ) {
        travelTrivia.buttonChoices[i].value = answers[i];
        travelTrivia.buttonChoices[i].removeAttribute('disabled'); 
        travelTrivia.buttonChoices[i].style.opacity = "1.0";
    }
    travelTrivia.rightOrWrong(rightAnswer);
    travelTrivia.fiftyFiftyButton(rightAnswer, wrongAnswers);
    console.log(rightAnswer);
}

//timer countdown or question to be answered
travelTrivia.clockTimer = function () {
    let count = 60;
     travelTrivia.timer = setInterval(function() {
        count--;
        $("#countTimer").html(count);
        if (count == 0) {
            clearInterval(travelTrivia.timer);
            $('.restart')
            .css('z-index', 10)
            .fadeTo(500, 1);
            $('.mainGame').fadeTo('fast', 0.1);
        } 
        travelTrivia.playAgain();
    }, 1000);
}

// check if answer is correct or incorrect on button click
travelTrivia.rightOrWrong = function (correctAnswer) {
    travelTrivia.buttonChoices.off().on('click', function() {
        const buttonVal = $(this).val();
        if (buttonVal !== correctAnswer){
            swal({
                title: "Sorry Friend",
                text: "You didn't win.",
                button: "Play Again",
              }).then(function(){ 
                  location.reload();
                }
             );
        } else {
            $('.mainGame').fadeTo('slow', 0);
            setTimeout(function() {
                travelTrivia.getData(travelTrivia.difficulty); 
            }, 900);   
        }
        clearInterval(travelTrivia.timer);
        $("#countTimer").html('60');
    });
}
//50/50 button to disappear two incorrect answers
travelTrivia.fiftyFiftyButton = function (rightAnswer, wrongAnswers) {
    $('#fiftyFifty').off().on('click', function(){
        $('#fiftyFifty')
        .fadeTo(500, 0.2)
        .attr('disabled', 'true')
        .css('pointer-events', 'none');
    wrongAnswers.sort(function() { 
        return Math.floor(3 * Math.random()) 
    });
    let halfChoices = [rightAnswer, wrongAnswers[0]];
    for (let i = 0; i < travelTrivia.buttonChoices.length; i++){
        if (travelTrivia.buttonChoices[i].value != halfChoices[0] && travelTrivia.buttonChoices[i].value != halfChoices[1]) {
            travelTrivia.buttonChoices[i].setAttribute('disabled', 'true'); 
            travelTrivia.buttonChoices[i].style.opacity = "0.1";
            travelTrivia.buttonChoices[i].style.pointerEvents = 'none';
            }  
        }
    })
}

// let player move on to the next question without answering current question
travelTrivia.freePass = function() {
    $('#freePass').off().on('click', function() {
        clearInterval(travelTrivia.timer);
        $("#countTimer").html('60');
        $('#freePass')
        .fadeTo(500, 0.2)
        .attr('disabled', 'true')
        .css('pointer-events', 'none');
        $('.mainGame').fadeTo('slow', 0);
        setTimeout(function() {
            travelTrivia.getData(travelTrivia.difficulty); 
        }, 900);
    })
}

// scroll to top of the page, n is vertical position of scrollbar in px
travelTrivia.scrollToTop = function(n) { 
    $(window).scrollTop(n); 
} 

travelTrivia.endGame = function() {
    clearInterval(travelTrivia.timer);
    $("#countTimer").html('60');
    $('main').css('margin-bottom', 50);
    travelTrivia.scrollToTop(1);
    $('.mainGame').fadeTo('fast', 0);
    $('.modalBox')
    .css('z-index', 10)
    .fadeTo('slow', 1);
}

travelTrivia.playAgain = function() {
    $('.playAgain').on('click', function() {
        travelTrivia.scrollToTop(0);
        $('main').css('display', 'none');
        $('.restart')
        .css('z-index', -1)
        .fadeTo('fast', 0);
        $('#fiftyFifty, #freePass')
        .css({'opacity': 1, 'pointer-events': 'initial'})
        .removeAttr('disabled');
        travelTrivia.counter = 0;
    })
}

//initalizating 
travelTrivia.init = function() {
    travelTrivia.startGame();   
    travelTrivia.chooseDifficulty();       
}

$(document).ready(function(){
    travelTrivia.init();    
})