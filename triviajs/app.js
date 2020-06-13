const travelTrivia = {};

travelTrivia.url = 'https://opentdb.com/api.php';
travelTrivia.buttonChoices = $('.answerButtons');
travelTrivia.counter = 0;

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
        $('.mainGame').fadeTo(2000, 1);
        travelTrivia.freePass();
        travelTrivia.displayQuestion(arrayOfObj);
        travelTrivia.displayChoices(arrayOfObj);
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
    let rightAnswer = array['correct_answer'];
    let wrongAnswers = array['incorrect_answers'];
    let answers = [rightAnswer, ...wrongAnswers];
    answers.sort(function() { return Math.floor(4*Math.random()) });
    for (let i = 0; i <  answers.length; i++ ) {
        travelTrivia.buttonChoices[i].value = answers[i];
    }
    travelTrivia.rightOrWrong(rightAnswer);
    console.log(rightAnswer);
}

// check if asnwer is correct or incorrect on button click
travelTrivia.rightOrWrong = function (correctAnswer) {
    travelTrivia.buttonChoices.off().on('click', function() {
        const buttonVal = $(this).val();
        if (buttonVal !== correctAnswer){
            Swal.fire({
                icon: 'error',
                title: 'Too Bad!',
                text: 'Sorry! You didn\'t win. Please Play again',
              })
        } else {
            //will use this to implement maxQuestions of 10
            travelTrivia.counter++;
            $('.mainGame').fadeTo('slow', 0);
            setTimeout(function() {
                travelTrivia.getData(); 
            }, 900);
        }
    });
}
// let player move on to the next question without answering current question
travelTrivia.freePass = function() {
    $('#freePass').off().on('click', function() {
        $('#freePass')
        .fadeTo(500, 0.2)
        .attr('disabled', 'true');
        $('.mainGame').fadeTo('slow', 0);
        setTimeout(function() {
            travelTrivia.getData(); 
        }, 900);
    })
}

//initalizating 
travelTrivia.init = function() {
    travelTrivia.startGame();    
}

$(document).ready(function(){
    travelTrivia.init();    
})