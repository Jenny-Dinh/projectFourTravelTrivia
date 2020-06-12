const travelTrivia = {};
travelTrivia.url = 'https://opentdb.com/api.php';
travelTrivia.buttonChoices = $('.answerButtons');
travelTrivia.counter = 0;
// let rightAnswer;


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
        arrayOfObj = arrayOfData.results[0];
        travelTrivia.displayQuestion(arrayOfObj);
        travelTrivia.displayChoices(arrayOfObj);
        $('.mainGame').fadeIn(2000);
        travelTrivia.freePass();
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
    //debugging purposes only
    console.log('right answer:', rightAnswer);
}

//Display incorrect/correct answer 
travelTrivia.rightOrWrong = function (correctAnswer) {
    $('.answerButtons').on('click', function() {
        const buttonVal = $(this).val();
        console.log('button value:', buttonVal);
        if (buttonVal != correctAnswer){
            Swal.fire({
                icon: 'error',
                title: 'Too Bad!',
                text: 'Sorry! You didn\'t win. Please Play again',
              })
        } else {
            //will use this to implement maxQuestions of 10
            travelTrivia.counter++;
            travelTrivia.getData(); 
            $('.mainGame').fadeOut('slow');
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
    // travelTrivia.rightOrWrong(); 
    
}

$(document).ready(function(){
    travelTrivia.init();    
})