const setup_wrapper = document.querySelector('.setup-wrapper');
const quiz_category = document.querySelector('.quiz-category');
const quiz_limit = document.querySelector('.quiz-limit');
const quiz_difficulty = document.getElementsByName('difficulty');
const start_quiz_btn = document.querySelector('.start-btn');
const next_btn = document.querySelector('.next-btn');

const _question_index = document.querySelector('.question-index');
const _question_total = document.querySelector('.total-questions');

const _question_category = document.getElementById('question-category');
const _question = document.getElementById('question-title');
const _options = document.getElementById('question-options');

let category = '';
let limit = '';
let difficulty = '';

var duration = 15;
var current_time = duration;
var is_stop = false;

let correct_answer = '';
let correct_score = 0;
let asked_count = 0;
let total_questions = loadSettings().limit;

document.addEventListener('DOMContentLoaded', () => {
    is_stop = false;
    loadQuestions();
    setTimer(duration);
    _question_index.innerHTML = `${asked_count + 1}`;
    _question_total.innerHTML = `${total_questions}`;
});

//API URL
const API_URL = 'https://opentdb.com/api.php?';


//load qustions from api
async function loadQuestions() {
    const settings = loadSettings();
    const result = await fetch(`${API_URL}amount=${settings.limit}&category=${settings.category}&difficulty=${settings.difficulty}`);
    const data = await result.json();
    // console.log(data.results[0]);
    showQuestions(data.results[correct_score]);
}

//function to show questions
function showQuestions(data) {
    const question = data.question;
    const answers = data.incorrect_answers;
    correct_answer = data.correct_answer;
    const question_category = data.category;

    const options_list = [correct_answer, ...answers];
    _question_category.innerHTML = question_category;
    _question.innerHTML = question;
    _options.innerHTML += `
        ${options_list.map((option, index) => {
            return `
                <div class="option flex justify-start items-center my-2">
                    ${index + 1}- 
                    <span class="ml-2">
                        ${option}
                    </span>
                </div>
                `;
        }).join('')}
    `;

    selectOption();
    next_btn.style.display = 'none';
}


//function to select option
function selectOption() {
    _options.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            const selected_option = option.querySelector('span').textContent.trim();
            next_btn.style.display = 'block';
            is_stop = true;
            
            //disable all options
            _options.querySelectorAll('.option').forEach(option => {
                option.style.pointerEvents = 'none';
            });

            if (selected_option === correct_answer) {
                option.classList.add('bg-green-500');
                option.classList.add('text-white');
                next_btn.addEventListener('click', () => {
                    answerCorrect();
                });
            } else {
                option.classList.add('bg-red-500');
                option.classList.add('text-white');
                next_btn.addEventListener('click', () => {
                    is_stop = true;
                    answerWrong();
                });
            }
        });
    });
}

//fucntion to check if answer is correct
function answerCorrect(){
    is_stop = false;
    resetTimer();
    setTimer(duration);
    correct_score++;
    asked_count++;
    _question_index.innerHTML = `${asked_count + 1}`;
    if (asked_count < total_questions) {
        _options.innerHTML = '';
        loadQuestions();
        resetTimer();
    } else {
        showResult();
    }
}

//function to check if answer is wrong
function answerWrong(){
    is_stop = false;
    resetTimer();
    setTimer(duration);
    asked_count++;
    _question_index.innerHTML = `${asked_count + 1}`;
    if (asked_count < total_questions) {
        _options.innerHTML = '';
        loadQuestions();
        resetTimer();
    } else {
        showResult();
    }
}

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
function setTimer(current_time){
    setInterval(function(){
        $('.countdown span').css('--value', current_time);
        if(current_time > 0 && !is_stop) current_time--;
        if(current_time < -1){
            // showResult();
            setTimeout(() => {
                window.location.href = 'quiz.html';
            }, 300);
            resetTimer();
        }
    }, 1000);
}

//reset timer
function resetTimer() {
    duration = 15;
    current_time = duration;
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