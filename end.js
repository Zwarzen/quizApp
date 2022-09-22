const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

//Memberi Nama agar tidak kosong
username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

//Push Score
saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5); // <<- dapatkan 5 score tertinggi

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('./highscores.html');

    console.log(highScores);
};
