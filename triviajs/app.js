const travelTrivia = {};

travelTrivia.url = 'https://opentdb.com/api.php';
travelTrivia.buttonChoices = $('.answerButtons');
travelTrivia.counter = 0;

travelTrivia.startGame = function() {
    $("#startBtn").on('click', function() {
        travelTrivia.getData();
        $('main').fadeTo(500, 1);
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
        $('.mainGame').fadeIn(2000);
        travelTrivia.freePass();
        travelTrivia.displayQuestion(arrayOfObj);
        travelTrivia.displayChoices(arrayOfObj);
    })
}

// display question on the page  
travelTrivia.displayQuestion = function(array) {
    $('.question p').fadeTo('2000', 1);
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

//Display incorrect/correct answer 
travelTrivia.rightOrWrong = function (correctAnswer) {
    travelTrivia.buttonChoices.off().on('click', function() {
        const buttonVal = $(this).val();
        console.log('button value:', buttonVal);
        if (buttonVal !== correctAnswer){
            Swal.fire({
                icon: 'error',
                title: 'Too Bad!',
                text: 'Sorry! You didn\'t win. Please Play again',
              })
        } else {
            //will use this to implement maxQuestions of 10
            travelTrivia.counter++;
            $('.question p').css('opacity', 0);
            $('.mainGame').fadeOut('slow');
            travelTrivia.getData(); 
        }
    });
}

travelTrivia.freePass = function() {
    $('#freePass').on('click', function() {
        $('#freePass')
        .fadeTo(500, 0.2)
        .attr('disabled', 'true');
        $('.question p').fadeTo('slow', 0);
        $('.mainGame').fadeOut('slow');
        travelTrivia.getData();
    })
}

//initalizating 
travelTrivia.init = function() {
    travelTrivia.startGame();    
}

$(document).ready(function(){
    travelTrivia.init();    
})