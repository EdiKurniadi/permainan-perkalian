const elements = {
  questionContainer: document.getElementById('question'),
  answerInput: document.getElementById('answer'),
  timerContainer: document.getElementById('timer'),
  notificationContainer: document.getElementById('notification'),
  answerButton: document.getElementById('answer-button'),
  correctCounter: document.getElementById('correct'),
  incorrectCounter: document.getElementById('incorrect'),
  avgTimeDisplay: document.getElementById('avgTime'),
  toggleBtn: document.getElementById('toggle-btn'),
  body: document.querySelector('body')
};

const TIME_COUNTDOWN = 30;
const TOTAL_QUESTION = 10;
const NOTIFICATION_TIME = 1500;

let currentQuestion = 0;
let questions = generateQuestions();
let timeLeft = TIME_COUNTDOWN;
let timer;
let correctAnswers = 0;
let incorrectAnswers = 0;
let totalTime = 0;
let isDefaultTheme = true;

function generateQuestions() {
  const questions = [];
  for (let i = 0; i < TOTAL_QUESTION; i++) {
    const num1 = Math.floor(Math.random() * 90) + 10;
    const num2 = Math.floor(Math.random() * 90) + 10;
    questions.push({ num1, num2, answer: num1 * num2 });
  }
  return questions;
}

function displayQuestion() {
  const { num1, num2 } = questions[currentQuestion];
  elements.questionContainer.textContent = `${num1} x ${num2}`;
  elements.answerInput.value = '';
  elements.notificationContainer.textContent = '';
  startTimer();
}

function startTimer() {
  timeLeft = TIME_COUNTDOWN;
  elements.timerContainer.textContent = `Waktu tersisa: ${timeLeft} detik`;
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  elements.timerContainer.textContent = `Waktu tersisa: ${timeLeft} detik`;
  if (timeLeft === 0) {
    clearInterval(timer);
    timeIsOver();
    next();
  }
}

function timeIsOver() {
  totalTime += TIME_COUNTDOWN;
  incorrectAnswers++;
  const { answer } = questions[currentQuestion];
  showNotification('failure', `Waktu habis, jawabannya adalah ${answer}.`);
  updateStats();
  elements.answerInput.focus();
}

function next() {
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      elements.questionContainer.textContent = 'Permainan Selesai!';
      elements.answerInput.disabled = true;
      elements.answerButton.disabled = true;
    }
  }, NOTIFICATION_TIME)
}

function checkAnswer() {
  const userAnswer = parseInt(elements.answerInput.value);
  const { answer } = questions[currentQuestion];
  totalTime += TIME_COUNTDOWN - timeLeft;
  if (userAnswer === answer) {
    showNotification('success', 'Jawaban Benar!');
    correctAnswers++;
  } else {
    showNotification('failure', `Salah, yang benar adalah ${answer}.`);
    incorrectAnswers++;
  }
  updateStats();
  clearInterval(timer);
  elements.answerInput.focus();
}

function showNotification(type, message) {
  elements.notificationContainer.textContent = message;
  elements.notificationContainer.classList.add(type);
  elements.answerInput.disabled = true;
  elements.answerButton.disabled = true;
  setTimeout(() => {
    elements.notificationContainer.classList.remove(type);
    elements.answerInput.disabled = false;
    elements.answerButton.disabled = false;
    elements.answerInput.focus();
  }, NOTIFICATION_TIME);
}

function updateStats() {
  elements.correctCounter.textContent = correctAnswers;
  elements.incorrectCounter.textContent = incorrectAnswers;
  const totalQuestions = correctAnswers + incorrectAnswers;
  const avgTime = totalQuestions > 0 ? (totalTime / totalQuestions).toFixed(2) : 0;
  elements.avgTimeDisplay.textContent = avgTime;
}


function handleEnterKey(event) {
  // answerInput.focus();
  if (event.key === 'Enter' || event.keyCode === 13) {
    answer();
  }
}

function answer() {
  checkAnswer();
  next();
}

function toggleTheme() {
  if (isDefaultTheme) {
    elements.body.classList.add('cool-theme');
  } else {
    elements.body.classList.remove('cool-theme');
  }
  isDefaultTheme = !isDefaultTheme;
  elements.toggleBtn.innerHTML = isDefaultTheme ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  elements.answerInput.focus();
}

elements.answerInput.addEventListener('keyup', handleEnterKey);
elements.answerButton.addEventListener('click', answer);
elements.toggleBtn.addEventListener('click', toggleTheme);
elements.answerInput.focus();
displayQuestion();