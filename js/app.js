const setup_wrapper = document.querySelector('.setup-wrapper');
const quiz_category = document.querySelector('.quiz-category');
const quiz_limit = document.querySelector('.quiz-limit');
const quiz_difficulty = document.getElementsByName('difficulty');
const start_quiz_btn = document.querySelector('.start-btn');

let category = '';
let limit = '';
let difficulty = '';

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
    category = quiz_category.value;
    limit = quiz_limit.value;
    difficulty = getDifficulty();
}