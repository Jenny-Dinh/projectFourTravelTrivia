const travelTrivia = {};

travelTrivia.url = 'https://opentdb.com/api.php';

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

    travelTrivia.freePass();

    
})
// display question on the page  
travelTrivia.displayQuestion = function(array) {
    const question = array.question;
    $('.question').html(`
    <p>${question}</p>`);
}
// scroll to main window when start button is clicked
travelTrivia.startTrivia = function() {
    $('#startBtn').on('click', function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $('main').offset().top
        }, 500);
    });
}

// free pass button on click displays a different question and set of answers and disables
travelTrivia.freePass = function() {
    $('#freePass').on('click', function() {
        console.log('Free pass');
        // $('#freePass').attr('disabled', 'true');
        travelTrivia.getData();
        travelTrivia.displayQuestion(arrayOfObj);
    })
}
        
//initalizating 
travelTrivia.init = function() {
    travelTrivia.getData();
    travelTrivia.startTrivia();
}

$(document).ready(function(){
    travelTrivia.init();    
})
