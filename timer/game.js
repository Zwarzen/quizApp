const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const btnStart = document.querySelector(".btn-start");
const timeSpan  = document.querySelector(".time");
const progressBar = document.querySelector(".progress-inner");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let timeInter; //untuk menyimpan interval timer

let questions = [];

/* di disable dulu */
// btnStart.addEventListener("click",()=>{
//     let interval = 10;

//     var countDown = setInterval (() => {
//         interval--;

//         let progressWidth = interval / 10 * 100

//         if(interval >0){
//             progressBar.style.width =  progressWidth + "%"
//             timeSpan.innerHTML = interval + "s"
//             checkColors(progressWidth)
//         }else{
//         clearInterval(countDown)
//         progressBar.style.width = "0%";
//         timeSpan.innerHTML = "Game Over"
//         }
//     },1000);
// })

const checkColors = (width) => {
    if(width > 60){
        progressBar.style.background = "green";
    }else if (width > 30){
        progressBar.style.background = "yellow";
    }else {
        progressBar.style.background = "red";
    }
};

//Ambil data pertanyaan di JSON
fetch('https://raw.githubusercontent.com/Zwarzen/questions/main/questions.json')
    .then(res=>res.json())
    .then((resp)=>{
        questions.push(...resp);
        startGame()

        //cek
        console.log(resp)
        console.log(questions)
        console.log(availableQuesions)
    })
    .catch(err=> console.log(err))


//menggunakan json external
// setTimeout(()=>{
//     console.log(externalQuestion);
//     questions.push(...externalQuestion);
//     startGame();

//     //cek
//     console.log(questions)
//     console.log(availableQuesions)
// },10)

//CONSTANTS banyak pertanyaan
const CORRECT_BONUS = 20;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

//Progress Bar dan Question Index
getNewQuestion = () => {

    clearInterval(timeInter);
    timerGame();


    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score); //set score saat ini ke local storage, untuk dioper kehalaman berikutnya
        //go to the end page
        return window.location.assign('./end.html');
    }
    questionCounter++;
    progressText.innerText = `Pertanyaan ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    if(currentQuestion.is_image){ //handle bila pertanyaan adalah gambar
        choices.forEach((choice) => {
            const number = choice.dataset['number'];
            choice.innerHTML = 
            `<div style="display : flex; justify-content: center"> 
                <img src="${currentQuestion['choice' + number]}" style="max-height: 100px;" /> 
            </div>`;
        });
    }else{ //hadle bila pertanyaan adalah text
        choices.forEach((choice) => {
            const number = choice.dataset['number'];
            choice.innerHTML = currentQuestion['choice' + number];
        });
    }


    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

//Choice Benar/Salah
choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        let selectedChoice; // <<-- element yang diklik
        //cek percabangan tergantungn element yg diklik
        if(e.target.tagName == "DIV"){
            selectedChoice = e.target.parentElement;
        }else if(e.target.tagName == "IMG"){
            selectedChoice = e.target.parentElement.parentElement;
        }else{
            selectedChoice = e.target;
        }
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

//Counter Score
incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};



function timerGame(){
    let interval = 5; //5 detik

    progressBar.style.width = "100%";
    timeSpan.innerHTML = "5s"

    timeInter = setInterval (() => {
        interval--;

        let progressWidth = interval / 5 * 100

        if(interval >0){
            progressBar.style.width =  progressWidth + "%"
            timeSpan.innerHTML = interval + "s"
            checkColors(progressWidth)
        }else{
        clearInterval(timeInter)
        progressBar.style.width = "0%";
        timeSpan.innerHTML = "Game Over";
        
        
        getNewQuestion();
        }
    },1000);
}

