const travelTrivia = {};
travelTrivia.url = 'https://opentdb.com/api.php';
const buttonChoices = $('.answerButtons');
let rightAnswer;
let counter = 0;


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
    const wrongAnswers = array['incorrect_answers'];
    const answers = [rightAnswer, ...wrongAnswers];
    answers.sort(function() { return Math.floor(4*Math.random()) });
    for (let i = 0; i <  answers.length; i++ ) {
        buttonChoices[i].value = answers[i];
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
            counter++;
            $('.mainGame').fadeOut('slow', function(){
                travelTrivia.getData(); 
            });
        }
    });
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
