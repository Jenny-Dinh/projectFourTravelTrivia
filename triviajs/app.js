const travelTrivia = {};

travelTrivia.url = 'https://opentdb.com/api.php';
travelTrivia.startButton = $('#startBtn');
travelTrivia.difficultyContainer = $('.difficulty');
travelTrivia.main = $('main');
travelTrivia.mainGame = $('.mainGame');
travelTrivia.buttonChoices = $('.answerButtons');
travelTrivia.fiftyFiftyBtn = $('#fiftyFifty');
travelTrivia.freePassBtn = $('#freePass');
travelTrivia.countTimer = $('#countTimer');
travelTrivia.correctTxt = $('.correct');
travelTrivia.counter = 0;
travelTrivia.maxQuestions = 10;
travelTrivia.timer;

travelTrivia.startGame = function() {
    travelTrivia.startButton.on('click', function() {
        $('h1, .textContainer, #startBtn')
            .css('visibility', 'hidden')
            .fadeTo('slow', 0);
        travelTrivia.difficultyContainer
            .fadeTo('slow', 1)
            .css('z-index', 10); 
        travelTrivia.getToken();
        travelTrivia.counter = 0; 
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
    travelTrivia.main.css('display', 'block');
    $('header').slideUp('slow');
    travelTrivia.difficultyContainer
        .fadeTo('slow', 0)
        .css('z-index', -1);
}

travelTrivia.getToken = function() {
    $.ajax({
        url: 'https://opentdb.com/api_token.php',
        type: 'GET',
        dataType: 'json',
        data: {
            command: 'request'
        },
        success: function (response) {
            travelTrivia.token = response.token;
        }
    })
}

travelTrivia.getData = function(chosenDifficulty) {
    $.ajax({
        url: travelTrivia.url,
        method: 'GET',
        dataType: 'json',
        data: {
            amount: 1,
            token: travelTrivia.token,
            category: 22,
            difficulty: chosenDifficulty,
            type: 'multiple'
        }
     }).then( function (arrayOfData) {
        arrayOfObj = arrayOfData.results[0];
        travelTrivia.counter++;
        if (travelTrivia.counter !== travelTrivia.maxQuestions + 1) {
        travelTrivia.mainGame.fadeTo(2200, 1);
        travelTrivia.correctTxt.css('opacity', '0');
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
    console.log(rightAnswer);
    answers.sort(function() { return Math.floor(4*Math.random()) });
    for (let i = 0; i <  answers.length; i++ ) {
        travelTrivia.buttonChoices[i].value = answers[i];
        travelTrivia.buttonChoices[i].removeAttribute('disabled'); 
        travelTrivia.buttonChoices[i].style.opacity = "1.0";
    }
    travelTrivia.rightOrWrong(rightAnswer);
    travelTrivia.fiftyFiftyButton(rightAnswer, wrongAnswers);
}

//timer countdown or question to be answered
travelTrivia.clockTimer = function () {
    let count = 60;
     travelTrivia.timer = setInterval(function() {
        count--;
        travelTrivia.countTimer.html(count);
        if (count == 0) {
            clearInterval(travelTrivia.timer);
            $('.restart')
            .css('z-index', 10)
            .fadeTo(500, 1);
            travelTrivia.mainGame.fadeTo('fast', 0.1);
        } 
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
            travelTrivia.correctTxt.css('opacity', '1');
            travelTrivia.mainGame.fadeTo('slow', 0);
            setTimeout(function() {
                travelTrivia.getData(travelTrivia.difficulty); 
            }, 1500);   

          
        }
        travelTrivia.percentageBar((travelTrivia.counter));
        clearInterval(travelTrivia.timer);
        travelTrivia.countTimer.html('60');
    });
}

travelTrivia.percentageBar = function (percentage) {
    $('.barPercentage[data-percentage]').each(function () {
        let increase = $(this);
        console.log(percentage);
        $({countNum: 0}).animate({countNum: percentage}, {
          duration: 2000,
          easing:'linear',
          step: function() {
            let pct = Math.floor((this.countNum) * 10) + '%';
            increase.text(`${percentage}/10`) && increase.siblings().children().css('width',pct);
          }
        });
      });
}

//50/50 button to disappear two incorrect answers
travelTrivia.fiftyFiftyButton = function (rightAnswer, wrongAnswers) {
    travelTrivia.fiftyFiftyBtn.off().on('click', function(){
        travelTrivia.fiftyFiftyBtn
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
    travelTrivia.freePassBtn.off().on('click', function() {
        clearInterval(travelTrivia.timer);
        travelTrivia.countTimer.html('60');
        travelTrivia.freePassBtn
            .fadeTo(500, 0.2)
            .attr('disabled', 'true')
            .css('pointer-events', 'none');
        travelTrivia.mainGame.fadeTo('slow', 0);
        setTimeout(function() {
            travelTrivia.getData(travelTrivia.difficulty); 
        }, 900);
    })
}

travelTrivia.endGame = function() {
    clearInterval(travelTrivia.timer);
    travelTrivia.countTimer.html('60');
    travelTrivia.main.css('margin-bottom', 50);
    travelTrivia.mainGame.fadeTo('fast', 0);
    $('.modalBox')
    .css('z-index', 10)
    .fadeTo('slow', 1);
}

//initalizating 
travelTrivia.init = function() {
    travelTrivia.startGame();   
    travelTrivia.chooseDifficulty();       
}

$(document).ready(function(){
    travelTrivia.init();    
})