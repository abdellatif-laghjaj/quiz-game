const setup_wrapper = document.querySelector('.setup-wrapper');
const quiz_category = document.querySelector('.quiz-category');
const quiz_limit = document.querySelector('.quiz-limit');
const quiz_difficulty = document.getElementsByName('difficulty');
const start_quiz_btn = document.querySelector('.start-btn');

let category = '';
let limit = '';
let difficulty = '';

const questions = [];

//API URL
const API_URL = 'https://the-trivia-api.com/api/questions?';

//start timer
setTimer(30);

start_quiz_btn.addEventListener('click', (e) => {
    setUpSettings();
    if (category === 'Select Category' || limit === 'Select number of questions' || difficulty === '') {
        alert('Please select all the fields');
    } else {
        window.location.href = 'quiz.html';
    }
});


//function to get the difficulty
function getDifficulty() {
    for (let i = 0; i < quiz_difficulty.length; i++) {
        if (quiz_difficulty[i].checked) {
            return quiz_difficulty[i].value;
        }
    }
}

//function to set the settings
function setUpSettings() {
    if (quiz_category.value === 'Select Category') category = 'Science';
    if (quiz_limit.value === 'Select number of questions') limit = '5';
    difficulty = getDifficulty();
}

//timer countdown
function setTimer(duration){
    setInterval(function(){
        $('.countdown span').css('--value', duration);
        duration--;
        // if(duration < 0){
        //     $('.quiz-wrapper').hide();
        //     // $('.result-wrapper').show();
        // }
    }, 1000);
}