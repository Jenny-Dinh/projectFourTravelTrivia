const travelTrivia = {};
travelTrivia.url = 'https://opentdb.com/api.php';
travelTrivia.buttonChoices = $('.answerButtons');
travelTrivia.counter = 0;
let rightAnswer;
let wrongAnswers;


travelTrivia.startGame = function() {
    $("#startBtn").on('click', function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("main").offset().top
        }, 500);
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
         $('.mainGame').fadeIn(2000, function(){
            arrayOfObj = arrayOfData.results[0];
            travelTrivia.displayQuestion(arrayOfObj);
            travelTrivia.displayChoices(arrayOfObj);
            travelTrivia.freePass();
            travelTrivia.fiftyFiftyButton();
         });    
    })
}

// display question on the page  
travelTrivia.displayQuestion = function(array) {
    const question = array['question'];
    $('.question').html(`
    <p>${question}</p>`);
}

// display answers randomly
travelTrivia.displayChoices  = function(array) {
    rightAnswer = array['correct_answer'];
    wrongAnswers = array['incorrect_answers'];
    const answers = [rightAnswer, ...wrongAnswers];
    answers.sort(function() { return Math.floor(4*Math.random()) });
    for (let i = 0; i <  answers.length; i++ ) {
        travelTrivia.buttonChoices[i].value = answers[i];
    }
    //debugging purposes only
    console.log(rightAnswer);
}

//Display incorrect/correct answer 
travelTrivia.rightOrWrong = function () {
    $('.answerButtons').on('click', function() {
        if ($(this).val() != rightAnswer){
            Swal.fire({
                icon: 'error',
                title: 'Too Bad!',
                text: 'Sorry! You didn\'t win. Please Play again',
              })
        } else {
            //will use this to implement maxQuestions of 10
            travelTrivia.counter++;
            $('.mainGame').fadeOut('slow', function(){
                travelTrivia.getData(); 
            });
        }
    });
}
//50/50 button to disappear two incorrect answers
travelTrivia.fiftyFiftyButton = function () {
    $('#fiftyFifty').on('click', function(){
    wrongAnswers.sort(function() { 
        return Math.floor(3 * Math.random()) 
    });
    let halfChoices = [rightAnswer, wrongAnswers[0]];
    console.log(halfChoices);
    for (let i = 0; i < travelTrivia.buttonChoices.length; i++){

        if (travelTrivia.buttonChoices[i].value != halfChoices[0] && travelTrivia.buttonChoices[i].value != halfChoices[1]) {
            travelTrivia.buttonChoices[i].style.display = 'none';
            console.log('BREAK');
          
        }  
    }
    })
}

travelTrivia.freePass = function() {
    $('#freePass').on('click', function() {
        $('#freePass').attr('disabled', 'true');
        travelTrivia.getData();
        travelTrivia.displayQuestion(arrayOfObj);
    })
}

//initalizating 
travelTrivia.init = function() {
    travelTrivia.getData();
    travelTrivia.startGame();
    travelTrivia.rightOrWrong(); 
    
}

$(document).ready(function(){
    travelTrivia.init();    
})
