// =====================================
// QUIZ MASTER
// =====================================

// ---------- Screens ----------

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quizlive");
const resultScreen = document.getElementById("result");

// ---------- Form ----------

const form = document.querySelector(".form");

const nameInput = document.getElementById("name");

const categorySelect = document.getElementById("category");

const difficultySelect = document.getElementById("Difficulty");

const questionSelect = document.getElementById("Questions");

// ---------- Buttons ----------

const startBtn = document.getElementById("start-btn");

const nextBtn = document.getElementById("next-btn");

const restartBtn = document.getElementById("restart-btn");

const themeBtn = document.getElementById("theme-btn");

// ---------- Quiz Elements ----------

const questionNumber = document.getElementById("question-number");

const scoreDisplay = document.getElementById("score");

const timerDisplay = document.getElementById("timer");

const questionText = document.getElementById("question-text");

const optionsContainer = document.getElementById("options");

const progressBar = document.querySelector(".progress-bar");

// ---------- Result Elements ----------

const finalScore = document.getElementById("final-score");

const correctCount = document.getElementById("correct-count");

const incorrectCount = document.getElementById("incorrect-count");

const percentage = document.getElementById("percentage");

const performanceMessage = document.getElementById("performance-message");


// =====================================
// VARIABLES
// =====================================

let questions = [];

let currentQuestion = 0;

let score = 0;

let correct = 0;

let incorrect = 0;

let playerName = "";

let timer;

let timeLeft = 20;


// =====================================
// THEME TOGGLE
// =====================================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

});


// =====================================
// START QUIZ
// =====================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    playerName = nameInput.value.trim();

    if(playerName === ""){

        alert("Please enter your name.");

        return;

    }

    await fetchQuestions();

});


// =====================================
// FETCH QUESTIONS
// =====================================

async function fetchQuestions(){

    let amount = questionSelect.value;

    let difficulty = difficultySelect.value;

    let category = categorySelect.value;

    let url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;

    if(category !== ""){

        url += `&category=${category}`;

    }

    try{

        const response = await fetch(url);

        const data = await response.json();

        questions = data.results;

        currentQuestion = 0;

        score = 0;

        correct = 0;

        incorrect = 0;

        scoreDisplay.textContent = "Score : 0";

        startScreen.classList.add("hidden");

        quizScreen.classList.remove("hidden");

        showQuestion();

    }

    catch(error){

        alert("Unable to fetch questions.");

        console.log(error);

    }

}
// =====================================
// SHOW QUESTION
// =====================================

function showQuestion() {

    clearInterval(timer);

    timeLeft = 20;

    startTimer();

    nextBtn.disabled = true;

    const question = questions[currentQuestion];

    // Update Header

    questionNumber.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    scoreDisplay.textContent =
        `Score : ${score}`;

    progressBar.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    // Decode HTML Entities

    questionText.innerHTML = decodeHTML(question.question);

    // Clear previous options

    optionsContainer.innerHTML = "";

    // Create Answers Array

    let answers = [...question.incorrect_answers];

    answers.push(question.correct_answer);

    shuffleArray(answers);

    // Generate Buttons

    answers.forEach(answer => {

        const button = document.createElement("button");

        button.classList.add("option");

        button.innerHTML = decodeHTML(answer);

        button.addEventListener("click", () => {

            selectAnswer(button, answer);

        });

        optionsContainer.appendChild(button);

    });

}


// =====================================
// SELECT ANSWER
// =====================================

function selectAnswer(button, answer){

    const question = questions[currentQuestion];

    // Disable every option

    const allButtons = document.querySelectorAll(".option");

    allButtons.forEach(btn=>{

        btn.disabled = true;

    });

    if(answer === question.correct_answer){

        button.style.background = "#4CAF50";

        score += 3;

        correct++;

    }

    else{

        button.style.background = "#E53935";

        incorrect++;

        allButtons.forEach(btn=>{

            if(btn.innerHTML === decodeHTML(question.correct_answer)){

                btn.style.background = "#4CAF50";

            }

        });

    }

    scoreDisplay.textContent = `Score : ${score}`;

    nextBtn.disabled = false;

    clearInterval(timer);

}


// =====================================
// NEXT BUTTON
// =====================================

nextBtn.addEventListener("click",()=>{

    currentQuestion++;

    if(currentQuestion >= questions.length){

        showResults();

        return;

    }

    showQuestion();

});


// =====================================
// TIMER
// =====================================

function startTimer(){

    timerDisplay.textContent = `${timeLeft}s`;

    timer = setInterval(()=>{

        timeLeft--;

        timerDisplay.textContent = `${timeLeft}s`;

        if(timeLeft <= 0){

            clearInterval(timer);

            incorrect++;

            nextBtn.disabled = false;

            const buttons =
            document.querySelectorAll(".option");

            buttons.forEach(btn=>{

                btn.disabled = true;

                if(btn.innerHTML ===
                decodeHTML(
                    questions[currentQuestion]
                    .correct_answer)){

                    btn.style.background="#4CAF50";

                }

            });

        }

    },1000);

}


// =====================================
// SHUFFLE
// =====================================

function shuffleArray(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=
        [array[j],array[i]];

    }

}


// =====================================
// HTML DECODER
// =====================================

function decodeHTML(html){

    const txt=document.createElement("textarea");

    txt.innerHTML=html;

    return txt.value;

}

// =====================================
// SHOW RESULTS
// =====================================

function showResults() {

    clearInterval(timer);

    quizScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

    finalScore.textContent = score;

    correctCount.textContent = correct;

    incorrectCount.textContent = incorrect;

    const percent = Math.round((correct / questions.length) * 100);

    percentage.textContent = `${percent}%`;

    // Performance Message

    if (percent >= 90) {

        performanceMessage.textContent = "🏆 Excellent!";

    }

    else if (percent >= 75) {

        performanceMessage.textContent = "🎉 Great Work!";

    }

    else if (percent >= 50) {

        performanceMessage.textContent = "👍 Good Job!";

    }

    else {

        performanceMessage.textContent = "📚 Keep Practicing!";

    }

}


// =====================================
// PLAY AGAIN
// =====================================

restartBtn.addEventListener("click", () => {

    // Reset Variables

    currentQuestion = 0;

    score = 0;

    correct = 0;

    incorrect = 0;

    questions = [];

    clearInterval(timer);

    // Hide Result

    resultScreen.classList.add("hidden");

    // Show Start

    startScreen.classList.remove("hidden");

    // Reset Form (Optional)

    form.reset();

});


// =====================================
// OPTIONAL ENTER KEY SUPPORT
// =====================================

document.addEventListener("keydown", (e) => {

    if (e.key === "Enter" &&
        !quizScreen.classList.contains("hidden") &&
        !nextBtn.disabled) {

        nextBtn.click();

    }

});


// =====================================
// SAFETY CHECK
// =====================================

window.addEventListener("load", () => {

    quizScreen.classList.add("hidden");

    resultScreen.classList.add("hidden");

});


// =====================================
// END OF PROJECT
// =====================================