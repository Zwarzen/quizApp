 

class Lobby{
    lobbyMenu;
    startBtn;
    configBtn;

    constructor(){
        this.lobbyMenu = document.querySelector('#lobby-menu');
        this.startBtn = document.querySelector('#btn-start');
        this.configBtn = document.querySelector('#config-btn');
    }

    setVisibility(is){
        if(is){
            this.lobbyMenu.classList.remove('hidden');
            this.lobbyMenu.classList.add('slide-in');
            this.lobbyMenu.classList.add('opacity-0');
            setTimeout(()=>{
                this.lobbyMenu.classList.remove('slide-in')
                this.lobbyMenu.classList.remove('opacity-0')
            },10);
            return;
        }
        this.lobbyMenu.classList.add('slide-out');
        setTimeout(()=>{
            this.lobbyMenu.classList.add('hidden')
            this.lobbyMenu.classList.remove('slide-out');
            this.lobbyMenu.classList.add('slide-in');
        },150);
    }

    /**
     * 
     * @param {StartGame} startGame 
     * @param {Config} config 
     * @param {WebSocket} socket
     */
    addEvent(startGame, config, socket){
        console.log("menambahkan event untuk lobby")
        this.startBtn.addEventListener('click', (e)=> {
            console.log("game seharusnya telah dimualai")
            this.setVisibility(false);
            setTimeout(()=>{
                console.log("game telah dimulai")
                startGame.start();
            },150)

            socket.send(
                JSON.stringify({
                    type : "start_game",
                    expect : "start the game | make all player start the game"
                })
            )
        })
    }
    
}

class Config{
    configMenuContainer;
    saveBtn;
    cancelBtn;

    constructor(){
        this.configMenuContainer = document.querySelector('#config-menu');
        this.saveBtn = this.configMenuContainer.querySelector('#config-save');
        this.cancelBtn = this.configMenuContainer.querySelector('#config-cancel');
        console.log(this.saveBtn);
        console.log(this.cancelBtn);
    }

    setVisibility(is){
        if(is){
            this.configMenuContainer.classList.remove('hidden');
            this.configMenuContainer.classList.add('slide-in');
            this.configMenuContainer.classList.add('opacity-0');
            setTimeout(()=>{
                this.configMenuContainer.classList.remove('slide-in')
                this.configMenuContainer.classList.remove('opacity-0')
            },10);
            return;
        }
        this.configMenuContainer.classList.add('slide-out');
        setTimeout(()=>{
            this.configMenuContainer.classList.add('hidden')
            this.configMenuContainer.classList.remove('slide-out');
        },150);
    }

    /**
     * 
     * @param {Lobby} lobby objek loby
     */
    addEvent(lobby){
        this.saveBtn.addEventListener('click', (e)=> {
            this.setVisibility(false);
            setTimeout(()=>{
                lobby.setVisibility(true);
            },150)
        })
        this.cancelBtn.addEventListener('click', (e)=> {
            this.setVisibility(false);
            setTimeout(()=>{
                lobby.setVisibility(true);
            },150)
        })
    }
}

class Question{
    // ** DOM container  **
    currentQuestionContainer;
    stringQuestionContainer;
    answerOptionsContainer; //html collection

    // ** value data **
    question;
    answerOptions = [];
    trueAnswer;


    constructor(){
        this.currentQuestionContainer = document.querySelector('#current-question-container');
        this.stringQuestionContainer = document.querySelector('#question');
        this.answerOptionsContainer = document.querySelectorAll('.answer-option'); // ini htmlcollection

    }

    setVisibility(is){
        if(is){
            this.currentQuestionContainer.classList.remove('hidden');
            this.currentQuestionContainer.classList.add('basis-1/12');
            this.currentQuestionContainer.classList.add('opacity-0');
            setTimeout(()=>{
                this.currentQuestionContainer.classList.remove('basis-1/12');
                this.currentQuestionContainer.classList.remove('opacity-0');
            },10);
            return;
        }
        this.currentQuestionContainer.classList.add('slide-out');
        setTimeout(()=>{
            this.currentQuestionContainer.classList.add('hidden')
        },150);
    }

    insertQuestionAndAnswer(){
        this.stringQuestionContainer.innerHTML = this.question;
        this.answerOptionsContainer.forEach((answerContainer, i) => {
            answerContainer.classList.remove("bg-green-200","bg-red-200");
            if( i == this.trueAnswer){
                answerContainer.classList.add("bg-green-200");
            }else{
                answerContainer.classList.add("bg-red-200");
            }
            answerContainer.innerHTML = this.answerOptions[i]
        })
    }

    refreshQuestion({question  = "pertanyaan dummy", answerOptions = [], trueAnswer = 0}){
        this.question = question;
        this.answerOptions = answerOptions;
        this.trueAnswer = trueAnswer;

        this.insertQuestionAndAnswer();
    }

}

class StartGame{
    // ** DOM container **
    gameMenuContainer
    numQuestionContainer
    numPlayerContainer
    sumQuestionContainer;

    // ** value container **
    question // object question
    mainGame // object seluruh game
    questionList // array question dari fetch
    questionCounter // nomor pertanyaan saat ini (index)

    constructor(){
        this.gameMenuContainer = document.querySelector('#game-menu');
        this.gameMenuContainer = document.querySelector('#game-menu');
        this.gameMenuContainer = document.querySelector('#game-menu');
        this.gameMenuContainer = document.querySelector('#game-menu');

        // this.question = new Question();
    }

    start(){
        this.setVisibility(true);
        // this.fetchQuestion();
    }

    setVisibility(is){
        if(is){
            // ** untuk header **
            this.gameMenuContainer.classList.remove('hidden');
            this.gameMenuContainer.classList.add('slide-in');
            this.gameMenuContainer.classList.add('opacity-0');
            setTimeout(()=>{
                this.gameMenuContainer.classList.remove('slide-in')
                this.gameMenuContainer.classList.remove('opacity-0')
            },10);
            
            // ** untuk content **
            // this.question.setVisibility(true);
            this.startGameEffect(true);
            return;
        }
        // ** untuk header **
        this.gameMenuContainer.classList.add('slide-out');
        setTimeout(()=>{
            this.gameMenuContainer.classList.add('hidden')
            this.gameMenuContainer.classList.remove('slide-out');
            this.gameMenuContainer.classList.add('slide-in');
        },150);
        
        // ** untuk content **
        // this.question.setVisibility(false);
        this.startGameEffect(false);
    }

    /**
     * @param {boolean} is
     * membuat efek tambahan bila berubah ke start game
     */
    startGameEffect(is){
        console.log(this.mainGame.content)
        if(is){
            this.mainGame.content.classList.add('border')
            this.mainGame.content.classList.add('border-sky-400')
            return
        }
        this.mainGame.content.classList.remove('border')
        this.mainGame.content.classList.remove('border-sky-400')
    }

    /**
     * 
     * @param {Main} mainGame 
     * @brief untuk menyangkutkan seluruh game dengan object ini
     * . supaya event dalam object dapat digunakan disini.
     */
    attach(mainGame){
        this.mainGame = mainGame;
    }

    async fetchQuestion(){
        // this.questionList = await fetch(this.mainGame.questionURL);
        // this.questionCounter = 0;

        // this.setQuestion(0)

        fetch(this.mainGame.questionURL)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            this.questionList = res
            this.questionCounter = 0;
            this.setQuestion(0);
        })
    }

    setQuestion(set){
        let questionL = this.questionList[set];
        console.log(questionL)
        this.question.refreshQuestion({
            question  : questionL.question, 
            answerOptions : [
                questionL.choice1,
                questionL.choice2,
                questionL.choice3,
                questionL.choice4,
            ], 
            trueAnswer : questionL.answer -1
        })
    }

}

class Player{
    // ** DOM container **
    playerDOM

    // ** data value **
    username
    id
    timeStamp
    barPercent
    nodeElement
    score

    constructor({username = "unknow", id=0, timeStamp = "00.00.00", barPercent = 0, score = 0}){
        this.username = username;
        this.id = id;
        this.timeStamp = timeStamp;
        this.barPercent = barPercent;
        this.score = score;
    }

    //untuk mendaapat elemnt dari halaman
    setElement(){
        this.playerDOM = document.querySelector("#player-"+this.id)
    }

    //untuk membuat node
    getNode(){
        let percent = 100 - Math.ceil(this.barPercent)
        let el = document.createElement("DIV");
        el.innerHTML = `
        <div id="player-${this.id}" class="player hidden relative w-full flex border rounded py-2 px-2 justify-between transition-all"
            style="background-image: linear-gradient(130deg, white ${percent}%,#0ea5e9,#0284c7,#0057a3)"
        >
            <div class="inline-flex gap-2 content-center items-center"> 
                <div class="p-2 h-full rounded-full bg-slate-500"><!--icon-->
                <svg class="h-full w-5 stroke-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                </div>
                <div class=""> 
                <p class="font-bold text-sm">${this.username}</p>
                <div class="inline-flex gap-8">
                    <p class="font-light text-sm">#${this.id}</p> <!--id pemain-->
                    <p class="font-light text-sm">
                    <svg class="inline w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ${this.timeStamp}
                    </p>
                </div>
                </div>
            </div>
            <div class="score self-center">
                <h3 class="text-white text-4xl">${this.score}</h3>
            </div>
        </div>
        `
        return el;
    }

    setVisibility(is, diff = 0){
        if(is){
            this.playerDOM.classList.remove('hidden');
            this.playerDOM.classList.add('slide-in');
            this.playerDOM.classList.add('opacity-0');
            setTimeout(()=>{
                this.playerDOM.classList.remove('slide-in')
                this.playerDOM.classList.remove('opacity-0')
            },10 * diff);
            return;
        }
        this.playerDOM.classList.add('slide-out');
        setTimeout(()=>{
            this.playerDOM.classList.add('hidden')
            this.playerDOM.classList.remove('slide-out');
        }, 150);
    }
}



class Main{
    // ** components **
    lobby
    config
    startGame

    // ** DOM Element **
    header
    content
    playerContainer //container player
    errorSocket //element untuk error

    // ** value **
    sockect;
    playerList = []; //object player
    playerListDOM = []; //player dalam bentuk html
    questionURL; //question





    constructor(){
        this.lobby = new Lobby();
        this.config = new Config();
        this.startGame = new StartGame();
        this.questionURL = "https://raw.githubusercontent.com/Zwarzen/questions/main/questions.json"

        // ** read DOM **
        this.header = document.querySelector('#header');
        this.content = document.querySelector('#content');
        this.playerContainer = document.querySelector('#player-container');
        this.errorSocket = document.querySelector('#error-socket');
    }

    // ** disini tempat logika utama dibuat **
    start(){
        // ** listener masing2 components **
        this.lobby.addEvent(this.startGame, this.config, this.sockect);
        console.log("seharusnya event looby sudah ditambahkan")
        this.config.addEvent(this.lobby)
        
        // attach main object
        this.startGame.attach(this);

        // secara default semua components dibuat hidden
        // this.lobby.setVisibility(true);
        this.lobby.setVisibility(true);

    }

    async connect(url){
        this.sockect = await new WebSocket(url);
        this.sockect.addEventListener('open', function(){
            this.send(
                JSON.stringify({
                    'type' : 'admin',
                    'expect' : 'connect_admin',
                })
            )
        })

        this.sockect.addEventListener('error',(e) => {
            this.handleErrorSocket();
        })
    }

    receiveMessage(){
        this.sockect.onmessage = (e)=>{
            
            let sendData = JSON.parse(e.data);
            console.log(sendData);

            switch(sendData.type){
                case "update":
                    this.handleUpdatePlayer(sendData.refresh_data);
                    break;
                case "admin_refresh":
                    this.handleUpdatePlayer(sendData.refresh_data);
                    break;
            }
        }
    }

    handleUpdatePlayer(refreshData){
        console.log("refresh data :")
        console.log(refreshData)
        if(this.playerList){
            this.playerList.forEach((player,i)=>{
                player.setVisibility(false, i * 10);
            })
        }
        this.playerContainer.innerHTML = "";
        this.playerList = [];
        let param;
        setTimeout(()=>{
            refreshData.forEach((player,i) => {
                param = {
                    username:  player.username, 
                    id : player.id,
                    timeStamp : player.timeStamp,
                    barPercent : player.barPercent,
                    score : player.score
                }
                this.playerList[i] = new Player(param);
                console.log(this.playerList[i])
                this.playerContainer.append(this.playerList[i].getNode());
                this.playerList[i].setElement();
                this.playerList[i].setVisibility(true, i * 10);
        
            });
        },100)
    }
    handleErrorSocket(){
        this.errorSocket.classList.remove('hidden')
    }

    fetchQuestion(url){}
    handleUpdateQuestion(){}
    setStartGame(){}

}

// *** rule untuk game ***




async function main(){
    let game = new Main();
    await game.connect("ws://localhost:3000/");
    game.receiveMessage();
    game.start(); //mulai game
}

main();





// khusus untuk beberapa object, lebih baik dilakukan attach dengan object main
//supaya dapat beberapa akses tertentu.
//sebenanrya ini kurang disarankan, tapi pada oop js saya masih belum tahu
//bagaiamnama cara melakukan pengoperan state.