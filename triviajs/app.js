const travelTrivia = {};

travelTrivia.url = 'https://opentdb.com/api.php';
travelTrivia.buttonChoices = $('.answerButtons');
travelTrivia.counter = 0;
travelTrivia.maxQuestions = 10;
travelTrivia.timer = 0;

travelTrivia.startGame = function() {
    $("#startBtn").on('click', function() {
        travelTrivia.getData();
        $('main').css('display', 'block');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("main").offset().top
        }, 800);
    });
}

travelTrivia.getData = function() {
    $.ajax({
        url: travelTrivia.url,
        method: 'GET',
        dataType: 'json',
        data: {
            amount: 1,
            category: 22,
            difficulty: 'hard',
            type: 'multiple'
        }
     }).then( function (arrayOfData) {
        arrayOfObj = arrayOfData.results[0];
        travelTrivia.counter++;
        if (travelTrivia.counter !== travelTrivia.maxQuestions + 1) {
        $('.mainGame').fadeTo(2000, 1);
        travelTrivia.fiftyFiftyButton();
        travelTrivia.freePass();
        travelTrivia.displayQuestion(arrayOfObj);
        travelTrivia.displayChoices(arrayOfObj);
        // travelTrivia.clockTimer();
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
    travelTrivia.clockTimer();
    travelTrivia.rightOrWrong(rightAnswer);
    travelTrivia.fiftyFiftyButton(rightAnswer, wrongAnswers);
    console.log(rightAnswer);
}

//timer countdown or question to be answered
travelTrivia.clockTimer = function () {
    let count = 10;
    travelTrivia.timer = setInterval(function() {
        $("#countTimer").html(count--);
        if(count == -1) clearInterval(travelTrivia.timer);
    }, 1000);
}

// check if asnwer is correct or incorrect on button click
travelTrivia.rightOrWrong = function (correctAnswer) {
    travelTrivia.buttonChoices.off().on('click', function() {
        const buttonVal = $(this).val();
        clearInterval(travelTrivia.timer);
        if (buttonVal !== correctAnswer){
            swal({
                title: "Sorry Buddy",
                text: "You didn't win.",
                button: "Play Again",
              }).then(function(){ 
                location.reload();
                }
             );
        } else {
            //will use this to implement maxQuestions of 10
            $('.mainGame').fadeTo('slow', 0);
            setTimeout(function() {
                travelTrivia.getData(); 
            }, 900);   
        }
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
        $('#freePass')
        .fadeTo(500, 0.2)
        .attr('disabled', 'true')
        .css('pointer-events', 'none');
        $('.mainGame').fadeTo('slow', 0);
        setTimeout(function() {
            travelTrivia.getData(); 
        }, 900);
    })
}

travelTrivia.scrollToTop = function(n) { 
    $(window).scrollTop(n); 
} 

travelTrivia.endGame = function() {
    travelTrivia.scrollToTop(80);
    $('.mainGame').fadeTo('fast', 0);
    $('.modalBox')
    .css('z-index', 10)
    .fadeTo('slow', 1);
    $('header').css('display', 'none');
}

//initalizating 
travelTrivia.init = function() {
    travelTrivia.startGame();          
}

$(document).ready(function(){
    travelTrivia.init();    
})