const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

// fetch(
//     'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
// )
//     .then(function (res) {
//         resClone = res.clone();
//         return res.json();
//     })
//     .then((loadedQuestions) => {
//         questions = loadedQuestions.results.map((loadedQuestion) => {
//             const formattedQuestion = {
//                 question: loadedQuestion.question,
//             };

//             const answerChoices = [...loadedQuestion.incorrect_answers];
//             formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
//             answerChoices.splice(
//                 formattedQuestion.answer - 1,
//                 0,
//                 loadedQuestion.correct_answer
//             );

//             answerChoices.forEach((choice, index) => {
//                 formattedQuestion['choice' + (index + 1)] = choice;
//             });

//             return formattedQuestion;
//         });

//         startGame();
//     })
//     .catch((err) => {
//         console.error(err)
//     });


// fetch untuk strucktur API dari github
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
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score); //set score saat ini ke local storage, untuk dioper kehalaman berikutnya
        //go to the end page
        return window.location.assign('./end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
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

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};


