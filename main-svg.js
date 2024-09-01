const gameDiv = document.getElementById("game-div");
const ns = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(ns, "svg");
svg.setAttribute("width", "600");
svg.setAttribute("height", "400");
gameDiv.append(svg);

const gameField = document.createElementNS(ns, "rect");
const ball = document.createElementNS(ns, "circle");
const leftRocket = document.createElementNS(ns, "rect");
const rightRocket = document.createElementNS(ns, "rect");
let gameIntervalId = null;

let wallAudio = new Audio('./tennis-ball-hit-151257.mp3');
let hitAudio = new Audio('./swing-whoosh-4-198496.mp3');

function wallSoundInit() {
    wallAudio.play(); // запускаем звук
    wallAudio.pause(); // и сразу останавливаем
}

function hitSoundInit() {
    hitAudio.play();
    hitAudio.pause();
}

function wallSound() {
    wallAudio.currentTime = 0; // в секундах
    wallAudio.play();
}

function hitSound() {
    hitAudio.currentTime = 0; // в секундах
    hitAudio.play();
}


let gameFieldData = {
    fieldX: 0,
    fieldY: 0,
    fieldWidth: 600,
    fieldHeight: 400,

    create() {
        gameField.classList.add("game-field");
        gameField.setAttribute("x", this.fieldX);
        gameField.setAttribute("y", this.fieldY);
        gameField.setAttribute("width", this.fieldWidth);
        gameField.setAttribute("height", this.fieldHeight);
        svg.append(gameField);
    }
};

let ballData = {
    r: 15,
    initialBallCx: 300,
    initialBallCy: 200,
    initialSpeedX: 4,
    initialSpeedY: 5,
    ballCx: 300,
    ballCy: 200,
    speedX: 4,
    speedY: 5,

    create() {
        ball.classList.add("ball");
        ball.setAttribute("cx", this.ballCx);
        ball.setAttribute("cy", this.ballCy);
        ball.setAttribute("r", this.r);
        svg.append(ball);
    },

    start() {
        this.ballCx = this.initialBallCx;
        this.ballCy = this.initialBallCy;
        this.speedX = this.initialSpeedX;
        this.speedY = this.initialSpeedY;
    },

    update() {
        ball.setAttribute("cx", this.ballCx);
        ball.setAttribute("cy", this.ballCy);
    }
};

let leftRocketData = {
    rocketWidth: 18,
    rocketHeight: 80,
    leftRocketX: 1, //border width = 1
    leftRocketY: 1, //border width = 1
    speedY: 1,
    downIntervalId: 0,
    upIntervalId: 0,

    create() {
        leftRocket.classList.add("left-rocket");
        leftRocket.setAttribute("x", this.leftRocketX);
        leftRocket.setAttribute("y", this.leftRocketY);
        leftRocket.setAttribute("width", this.rocketWidth);
        leftRocket.setAttribute("height", this.rocketHeight);
        svg.append(leftRocket);
    },

    update() {
        leftRocket.setAttribute("y", this.leftRocketY);
    },

    downLeft() {
        if (this.downIntervalId > 0) {
            return;
        }
        this.downIntervalId = setInterval(() => {
            this.speedY = 1;
            this.leftRocketY += this.speedY;
            leftRocket.setAttribute("y", this.leftRocketY);
            if (this.leftRocketY + this.rocketHeight + 1 > gameFieldData.fieldHeight) {
                this.speedY = 0;
                this.leftRocketY = gameFieldData.fieldHeight - this.rocketHeight - 1;
            }
        }, 0)
    },

    stopDownLeft() {
        clearInterval(this.downIntervalId);
        this.downIntervalId = 0;
    },

    upLeft() {
        if (this.upIntervalId > 0) {
            return;
        }
        this.upIntervalId = setInterval(() => {
            this.speedY = 1;
            this.leftRocketY -= this.speedY;
            leftRocket.setAttribute("y", this.leftRocketY);
            if (this.leftRocketY < 0) {
                this.speedY = 0;
                this.leftRocketY = 1;
            }
        }, 0)
    },

    stopUpLeft() {
        clearInterval(this.upIntervalId);
        this.upIntervalId = 0;
    }
};

let rightRocketData = {
    rocketWidth: 18,
    rocketHeight: 80,
    rightRocketX: gameFieldData.fieldWidth - 18 - 1, //border width = 1
    rightRocketY: 1, //border width = 1
    speedY: 1,
    downIntervalId: 0,
    upIntervalId: 0,

    create() {
        rightRocket.classList.add("right-rocket");
        rightRocket.setAttribute("x", this.rightRocketX);
        rightRocket.setAttribute("y", this.rightRocketY);
        rightRocket.setAttribute("width", this.rocketWidth);
        rightRocket.setAttribute("height", this.rocketHeight);
        svg.append(rightRocket);
    },

    update() {
        rightRocket.setAttribute("y", this.rightRocketY);
    },

    downRight() {
        if (this.downIntervalId > 0) {
            return;
        }
        this.downIntervalId = setInterval(() => {
            this.speedY = 1;
            this.rightRocketY += this.speedY;
            rightRocket.setAttribute("y", this.rightRocketY);
            if (this.rightRocketY + this.rocketHeight + 1 > gameFieldData.fieldHeight) {
                this.speedY = 0;
                this.rightRocketY = gameFieldData.fieldHeight - this.rocketHeight - 1;
            }
        }, 0)
    },

    stopDownRight() {
        clearInterval(this.downIntervalId);
        this.downIntervalId = 0;
    },

    upRight() {
        if (this.upIntervalId > 0) {
            return;
        }
        this.upIntervalId = setInterval(() => {
            this.speedY = 1;
            this.rightRocketY -= this.speedY;
            rightRocket.setAttribute("y", this.rightRocketY);
            if (this.rightRocketY < 0) {
                this.speedY = 0;
                this.rightRocketY = 1;
            }
        }, 0)
    },

    stopUpRight() {
        clearInterval(this.upIntervalId);
        this.upIntervalId = 0;
    }
};

(function createGameField() {
    gameFieldData.create();
    ballData.create();
    leftRocketData.create();
    rightRocketData.create();
})();

startBtn.addEventListener('click', () => {
    //SET SCORES TO 0
    const leftScore = document.getElementById('left-score');
    leftScore.innerText = 0;
    const rightScore = document.getElementById('right-score');
    rightScore.innerText = 0;

    //HIDE PREVIOUS RESULT IF DISPLAYED
    const count = document.getElementById('countdown');
    count.style.visibility = 'hidden';

    //SET ROCKETS TO INITIAL STATE
    leftRocketData.leftRocketY = 1;
    leftRocketData.update();
    rightRocketData.rightRocketY = 1;
    rightRocketData.update();

    //START SOUNDS
    wallSoundInit();
    hitSoundInit();

    //MOVE ROCKETS
    document.addEventListener('keydown', moveRockets);

    //STOP ROCKETS
    document.addEventListener('keyup', stopRockets);

    startGame();
});

function startGame() {
    if (gameIntervalId) {
        clearInterval(gameIntervalId);
    }
    let [xVector, yVector] = firstMoveVector();
    gameIntervalId = setInterval(move, 40, xVector, yVector);
}

//BALL MOVES
function move(xChange = 1, yChange = 1) {
    ballData.ballCx += ballData.speedX * xChange;
    ballData.ballCy += ballData.speedY * yChange;

    //HIT LEFT ROCKET
    if (
        ballData.ballCx <= leftRocketData.leftRocketX + leftRocketData.rocketWidth + ballData.r && //BALL TOUCHES ROCKET X
        ballData.ballCx + ballData.r >= leftRocketData.leftRocketX &&  //BALL OVER ROCKET
        ballData.ballCy + ballData.r >= leftRocketData.leftRocketX && //BALL + ROCKET Y UP
        ballData.ballCy <= leftRocketData.leftRocketY + leftRocketData.rocketHeight + ballData.r //BALL + ROCKET Y DOWN
    ) {
        wallSound();
        ballData.speedX = -ballData.speedX;
        ballData.ballCx = leftRocketData.rocketWidth + ballData.r;
    }

    //HIT RIGHT ROCKET
    if (
        ballData.ballCx >= gameFieldData.fieldWidth - rightRocketData.rocketWidth - ballData.r && //BALL + ROCKET X
        ballData.ballCx + ballData.r >= rightRocketData.rightRocketX &&  //BALLOVER ROCKET
        ballData.ballCy + ballData.r >= rightRocketData.rightRocketY && //BALL + ROCKET Y UP
        ballData.ballCy <= rightRocketData.rightRocketY + rightRocketData.rocketHeight + ballData.r //BALL + ROCKET Y DOWN
    ) {
        wallSound();
        ballData.speedX = -ballData.speedX;
        ballData.ballCx = gameFieldData.fieldWidth - rightRocketData.rocketWidth - ballData.r - 1;
    }

    //BALL OVER RIGHT WALL
    if (ballData.ballCx + ballData.r > gameFieldData.fieldWidth) {
        hitSound();
        ballData.speedX = 0;
        ballData.speedY = 0;
        ballData.ballCx = gameFieldData.fieldWidth - ballData.r - 1;
        let score = scoreUpLeft();
        if (score < 5) {
            countdown();
            setTimeout(startGame, 4000);
        } else {
            finishGame('Left');
        }

    }

    //BALL OVER LEFT WALL
    if (ballData.ballCx < ballData.r) {
        hitSound();
        ballData.speedX = 0;
        ballData.speedY = 0;
        ballData.ballCx = ballData.r + 1;
        let score = scoreUpRight();
        if (score < 5) {
            countdown();
            setTimeout(startGame, 4000);
        } else {
            finishGame('Right');
        }
    }

    //BALL HITS BOTTOM
    if (ballData.ballCy + ballData.r > gameFieldData.fieldHeight) {
        wallSound();
        ballData.speedY = -ballData.speedY;
        ballData.ballCy = gameFieldData.fieldHeight - ballData.r - 1;
    }

    //BALL HITS TOP
    if (ballData.ballCy < ballData.r) {
        wallSound();
        ballData.speedY = -ballData.speedY;
        ballData.ballCy = ballData.r - 1;
    }

    ballData.update();
}

//SET SCORE FOR LEFT PLAYER
function scoreUpLeft() {
    const leftScore = document.getElementById('left-score');
    let currScore = parseInt(leftScore.innerText);

    let newScore = currScore + 1;
    leftScore.innerText = newScore;
    return newScore;
}

//SET SCORE FOR RIGHT PLAYER
function scoreUpRight() {
    const rightScore = document.getElementById('right-score');
    let currScore = parseInt(rightScore.innerText);

    let newScore = currScore + 1;
    rightScore.innerText = newScore;
    return newScore;
}

//SHOW COUNTDOWN OR FINAL RESULT
function countdown() {
    const count = document.getElementById('countdown');
    count.style.visibility = 'visible';
    for (let i = 3; i >= 1; i--) {
        setTimeout(() => {
            count.innerText = `${i}...`;
            if (i === 1) {
                setTimeout(() => {
                    count.style.visibility = 'hidden';
                    count.innerText = ' ';
                }, 1000);
            }
        }, (4 - i) * 1000)
    }
}

//SHOW WINNER
function finishGame(winner) {
    const count = document.getElementById('countdown');
    count.style.visibility = 'visible';
    count.style.color = '#511b1b';
    count.innerText = `${winner} player won!`;
}

function moveRockets(e) {
    switch (e.code) {
        case 'MetaLeft':
            leftRocketData.downLeft();
            break;
        case 'ShiftLeft':
            leftRocketData.upLeft();
            break;
        case 'ArrowDown':
            rightRocketData.downRight();
            break;
        case 'ArrowUp':
            rightRocketData.upRight();
            break;
    }
}

function stopRockets(e) {
    switch (e.code) {
        case 'MetaLeft':
            leftRocketData.stopDownLeft();
            break;
        case 'ShiftLeft':
            leftRocketData.stopUpLeft();
            break;
        case 'ArrowDown':
            rightRocketData.stopDownRight();
            break;
        case 'ArrowUp':
            rightRocketData.stopUpRight();
            break;
    }
}

//RANDOM FIRST MOVE
function firstMoveVector() {
    ballData.start();
    let speedXVector = randomInteger(0, 1000) % 2 ? -1 : 1;
    let speedYVector = randomInteger(0, 1000) % 2 ? -1 : 1;
    return [speedXVector, speedYVector]
}

//GET RANDOM INTEGER FOR RANDOW BALL VECTOR
function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}