const setup_wrapper = document.querySelector('.setup-wrapper');
const quiz_category = document.querySelector('.quiz-category');
const quiz_limit = document.querySelector('.quiz-limit');
const quiz_difficulty = document.getElementsByName('difficulty');
const start_quiz_btn = document.querySelector('.start-btn');

const _question_category = document.getElementById('question-category');
const _question = document.getElementById('question-title');
const _options = document.getElementById('question-options');

let category = '';
let limit = '';
let difficulty = '';

const questions = [];

//API URL
const API_URL = 'https://opentdb.com/api.php?';


//load qustions from api
async function loadQuestions() {
    const settings = loadSettings();
    // https://opentdb.com/api.php?amount=10&category=11&difficulty=easy
    const result = await fetch(`${API_URL}amount=${settings.limit}&category=${settings.category}&difficulty=${settings.difficulty}`);
    const data = await result.json();
    // console.log(data.results[0]);
    showQuestions(data.results[0]);
}
//function to show questions
function showQuestions(data) {
    const question = data.question;
    const answers = data.incorrect_answers;
    const correct_answer = data.correct_answer;
    const question_category = data.category;

    const options_list = [correct_answer, ...answers];
    _question_category.innerHTML = question_category;
    _question.innerHTML = question;
    options_list.forEach(function (option) {
        _options.innerHTML += `
                <div class="option flex justify-start items-center my-2">
                    <span class="ml-2">
                        ${option}
                    </span>
                </div>`;
    });
}

loadQuestions();

//start timer
setTimer(30);

if(start_quiz_btn !== null) {
    start_quiz_btn.addEventListener('click', (e) => {
        setUpSettings();
        if (category === 'Select Category' || limit === 'Select number of questions' || difficulty === '') {
            alert('Please select all the fields');
        } else {
            saveSettings();
            setTimeout(() => {
                window.location.href = 'quiz.html';
            }, 300);
        }
    });
}


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
    category = quiz_category.value;
    limit = quiz_limit.value;
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

//save settings to local storage
function saveSettings() {
    if (localStorage.getItem('category') === null) {
        localStorage.setItem('category', category);
    }
    if (localStorage.getItem('limit') === null) {
        localStorage.setItem('limit', limit);
    }
    if (localStorage.getItem('difficulty') === null) {
        localStorage.setItem('difficulty', difficulty);
    }
}

//load settings from local storage
function loadSettings() {
    let settings = {};
    if (localStorage.getItem('category') !== null) {
        settings.category = localStorage.getItem('category');
    }
    if (localStorage.getItem('limit') !== null) {
        settings.limit = localStorage.getItem('limit');
    }
    if (localStorage.getItem('difficulty') !== null) {
        settings.difficulty = localStorage.getItem('difficulty');
    }
    return settings;
}