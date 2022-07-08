const setup_wrapper = document.querySelector('.setup-wrapper');
const quiz_category = document.querySelector('.quiz-category');
const quiz_limit = document.querySelector('.quiz-limit');
const quiz_difficulty = document.getElementsByName('difficulty');
const start_quiz_btn = document.querySelector('.start-btn');

const _question_index = document.querySelector('.question-index');
const _question_total = document.querySelector('.total-questions');

const _question_category = document.getElementById('question-category');
const _question = document.getElementById('question-title');
const _options = document.getElementById('question-options');

let category = '';
let limit = '';
let difficulty = '';

var duration = 3;

let correct_answer = '';
let correct_score = 0;
let asked_count = 0;
let total_questions = loadSettings().limit;

document.addEventListener('DOMContentLoaded', () => {
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
    showQuestions(data.results[0]);
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
                    <span class="ml-2">
                        ${index + 1}- ${option}
                    </span>
                </div>
                `;
        }).join('')}
    `;

    selectOption();
}


//function to select option
function selectOption() {
    _options.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            //add class selected to selected option
            let current = option.textContent;
            option.classList.add('bg-yellow-300');
            option.classList.add('text-white');

            //remove class selected from other options
            _options.querySelectorAll('.option').forEach(option => {
                if (option.textContent !== current) {
                    option.classList.remove('bg-yellow-300');
                    option.classList.remove('text-white');
                }
            });
        });
    });
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
function setTimer(time){
    setInterval(function(){
        $('.countdown span').css('--value', time);
        time--;
        if(time < -1){
            // alert('Time up');
            time = duration;
        }
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