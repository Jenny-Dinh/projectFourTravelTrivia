const travelTrivia = {};
travelTrivia.url = 'https://opentdb.com/api.php';
const buttonChoices = document.getElementsByClassName('answerButtons');

travelTrivia.getData = function() {
    return $.ajax({
        url: travelTrivia.url,
        method: 'GET',
        dataType: 'json',
        data: {
            amount: 1,
            category: 22,
            difficulty: 'hard',
            type: 'multiple'
        }
     })
};

// store promise in a variable
travelTrivia.Data = travelTrivia.getData()

travelTrivia.Data.then( function (arrayOfData) {
    
    arrayOfObj = arrayOfData.results[0];

    travelTrivia.displayQuestion(arrayOfObj);

    travelTrivia.displayChoices(arrayOfObj);

    // travelTrivia.freePass();

    
})
// store promise in a variable
travelTrivia.Data = travelTrivia.getData()

// display question on the page  
travelTrivia.displayQuestion = function(array) {
    const question = array.question;
    $('.question').html(`
    <p>${question}</p>`);
}

// display answers randomly
travelTrivia.displayChoices  = function(array) {
    const rightAnswer = array['correct_answer'];
    const wrongAnswers = array['incorrect_answers'];
    const answers = [rightAnswer, ...wrongAnswers];
   
    answers.sort(function() { return Math.floor(4*Math.random()) });

    for (let i = 0; i <  answers.length; i++ ) {
        buttonChoices[i].value = answers[i];
        
    }

}

travelTrivia.freePass = function() {
    $('.freePass').on('click', function() {

    })
}

//initalizating 
travelTrivia.init = function() {
    travelTrivia.getData();
}
$(document).ready(function(){
    travelTrivia.init();    
})
