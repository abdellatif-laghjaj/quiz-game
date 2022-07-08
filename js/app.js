const setup_wrapper = document.querySelector('.setup-wrapper');
const quiz_category = document.querySelector('.quiz-category');
const quiz_limit = document.querySelector('.quiz-limit');
const quiz_difficulty = document.getElementsByName('difficulty');
const start_quiz_btn = document.querySelector('.start-btn');
const answers_wrapper = document.querySelector('.answers-wrapper');
const answers = document.querySelectorAll('label');
const next_btn = document.querySelector('.next-btn');

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
        $('.setup-wrapper').hide();
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
        if(duration < 0){
            $('.quiz-wrapper').hide();
            // $('.result-wrapper').show();
        }
    }, 1000);
}


//function to start the quiz
function startQuiz() {
    setTimer(60);
    $('.setup-wrapper').hide();
    $('.quiz-wrapper').show();
    getQuestions();
}

//generate the questions array
function generateQuestions(api, category, limit, difficulty) {
    const questions = [];
    const correctAnswer = [];
    const wrongAnswers = [];

    const url = `${api}categories=${category}&limit=${limit}&difficulty=${difficulty}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                wrongAnswers.push(data[i].incorrectAnswers.forEach(answer => {
                    wrongAnswers.push(answer);
                }));

                correctAnswer.push(data[i].correctAnswer);
                questions.push({
                    category: data[i].category,
                    difficulty: data[i].difficulty,
                    question: data[i].question,
                    answers: wrongAnswers.concat(correctAnswer),
                    correctAnswer: correctAnswer
                });
            }
        }).catch(error => console.log(error));
    return questions;
}

console.log(generateQuestions(API_URL, 'Science', '5', 'easy'));