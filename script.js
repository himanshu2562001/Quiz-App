const questions = [];

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions.push(...data);
        startQuiz();
    });

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let questionAnswered = false;

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');
const scoreElement = document.getElementById('score');
const feedbackElement = document.getElementById('feedback');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restart-btn');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');

nextButton.addEventListener('click', () => {
    if (!questionAnswered) return;
    currentQuestionIndex++;
    setNextQuestion();
});

restartButton.addEventListener('click', startQuiz);

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    questionAnswered = false;
    resultContainer.classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    totalQuestionsElement.textContent = questions.length;
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    questionAnswered = false;
    showQuestion(questions[currentQuestionIndex]);
    startTimer(10); // 10 seconds for each question
    updateProgress();
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', () => selectAnswer(button, answer));
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearInterval(timerInterval);
    nextButton.classList.add('hidden');
    nextButton.disabled = true;
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(selectedButton, answer) {
    if (questionAnswered) return;
    questionAnswered = true;
    const correct = selectedButton.dataset.correct;
    if (correct) {
        score++;
        selectedButton.classList.add('correct');
        selectedButton.insertAdjacentHTML('beforeend', '<span class="tick">&#10003;</span>');
    } else {
        selectedButton.classList.add('wrong');
        selectedButton.insertAdjacentHTML('beforeend', '<span class="tick">&#10007;</span>');
        feedbackElement.innerHTML = `The correct answer was: ${getCorrectAnswer().text}`;
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        setStatusClass(button, button.dataset.correct);
    });
    if (questions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hidden');
        nextButton.disabled = false;
    } else {
        showResults();
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function showResults() {
    document.getElementById('quiz').classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.innerText = `${score} / ${questions.length}`;
}

function getCorrectAnswer() {
    return questions[currentQuestionIndex].answers.find(a => a.correct);
}

function startTimer(seconds) {
    timerElement.innerText = `Time left: ${seconds}s`;
    timerInterval = setInterval(() => {
        seconds--;
        timerElement.innerText = `Time left: ${seconds}s`;
        if (seconds <= 0) {
            clearInterval(timerInterval);
            if (!questionAnswered) {
                feedbackElement.innerHTML = `Time's up! The correct answer was: ${getCorrectAnswer().text}`;
                selectAnswer(answerButtonsElement.querySelector('.btn'), {});
            }
        }
    }, 1000);
}

function updateProgress() {
    currentQuestionElement.textContent = currentQuestionIndex + 1;
}

startQuiz();
