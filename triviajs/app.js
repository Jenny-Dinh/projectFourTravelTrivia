console.log('Hello');

const travelTrivia = {};

travelTrivia.url = 'https://opentdb.com/api.php?amount=10&category=22&difficulty=hard&type=multiple';


travelTrivia.getQuestions = function (query) {
    $.ajax({
        url: travelTrivia.url,
        method: 'GET',
        dataType: 'json',
        data: {
            format: 'json',
            q: query
        }
    }).then(function(results){
        console.log(results)
    })
}

//initalizating 
travelTrivia.init = function () {
    travelTrivia.getQuestions();
}

$(document).ready(function(){
    
 })
