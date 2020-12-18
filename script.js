const mainPanelSize = 600

const timer = document.createElement("div")
const hour1 = document.createElement("img")
const hour2 = document.createElement("img")
const min1 = document.createElement("img")
const min2 = document.createElement("img")
const sec1 = document.createElement("img")
const sec2 = document.createElement("img")
const ms1 = document.createElement("img")
const ms2 = document.createElement("img")
const ms3 = document.createElement("img")

const bottomContainer = document.createElement("div")
bottomContainer.setAttribute('id', 'bottomContainer')

let emptyPuzzle;
let timeouts = []

let previousIndex
let imgIndex = 1
document.getElementById(`slider${imgIndex}`).style.width = "100px"

document.getElementById("back").onclick = function () {
    if (!sliding) {
        sliding = true
        previousIndex = imgIndex
        if (imgIndex == 1) imgIndex = 3
        else imgIndex -= 1
        let currentSlide = document.getElementById('slider').children[0]
        currentSlide.style.backgroundPosition = "left"
        let backImg = document.createElement("div")
        backImg.style.width = "0px"
        backImg.classList.add('slider-img')
        backImg.style.backgroundPosition = "right"
        backImg.style.backgroundImage = `url(./img/${imgIndex}.jpg)`
        document.getElementById('slider').insertBefore(backImg, document.getElementById('slider').children[0])

        for (let i = 0; i < 100; i++) {
            setTimeout(function () {
                currentSlide.style.width = `${100 - i - 1}px`
                backImg.style.width = `${0 + i + 1}px`
                if (i == 99) {
                    currentSlide.remove();
                    sliding = false;
                }
            }, i * 10)
        }
    }

}

document.getElementById("next").onclick = function () {
    if (!sliding) {
        sliding = true
        previousIndex = imgIndex
        if (imgIndex == 3) imgIndex = 1
        else imgIndex += 1
        let currentSlide = document.getElementById('slider').children[0]
        currentSlide.style.backgroundPosition = "right"
        let nextImg = document.createElement("div")
        nextImg.style.width = "0px"
        nextImg.classList.add('slider-img')
        nextImg.style.backgroundPosition = "left"
        nextImg.style.backgroundImage = `url(./img/${imgIndex}.jpg)`
        document.getElementById('slider').appendChild(nextImg)

        for (let i = 0; i < 100; i++) {
            setTimeout(function () {
                currentSlide.style.width = `${100 - i - 1}px`
                nextImg.style.width = `${0 + i + 1}px`
                if (i == 99) {
                    currentSlide.remove();
                    sliding = false;
                }
            }, i * 10)
        }
    }

}
const timerDigits = [hour1, hour2, min1, min2, sec1, sec2, ms1, ms2, ms3];
function resetTimer() {
    for (let i = 0; i < timerDigits.length; i++) {
        timerDigits[i].src = "./digits/c0.gif"
    }
}

function setupMenu() {
    const topContainer = document.createElement("div")
    topContainer.setAttribute('id', 'topContainer')


    for (let i = 0; i < timerDigits.length; i++) {
        timerDigits[i].src = "./digits/c0.gif"
        timer.appendChild(timerDigits[i])
        if (i == 1 || i == 3) {
            let colon = document.createElement("img")
            colon.src = "./digits/colon.gif"
            timer.appendChild(colon)
        }
        if (i == 5) {
            let dot = document.createElement("img")
            dot.src = "./digits/dot.gif"
            timer.appendChild(dot)
        }
    }

    timer.id = "timer"
    const mode3x3Btn = document.createElement("button")
    const mode4x4Btn = document.createElement("button")
    const mode5x5Btn = document.createElement("button")
    const mode6x6Btn = document.createElement("button")
    const modeBtns = [mode3x3Btn, mode4x4Btn, mode5x5Btn, mode6x6Btn];
    const modeBtnsContainer = document.createElement("div");
    modeBtnsContainer.setAttribute('id', 'modeBtnsContainer')
    const modeBtnsLables = ["3 x 3", "4 x 4", "5 x 5", "6 x 6"]
    for (let i = 0; i < modeBtns.length; i++) {
        timeouts = [];
        modeBtns[i].classList.add('mode-btn')
        modeBtns[i].textContent = modeBtnsLables[i]
        modeBtns[i].onclick = function () {
            resetTimer()
            clearInterval(gameInterval)
            generatePuzzles(i + 3, `./img/${imgIndex}.jpg`, (i + 5) * 50 * (i + 4))
        }
        modeBtnsContainer.appendChild(modeBtns[i])
    }
    topContainer.appendChild(modeBtnsContainer)
    topContainer.appendChild(timer)
    document.body.appendChild(topContainer)
}

setupMenu()

let finished = false;
let puzzles = [];
let winnerPuzzles = [];
let randomPuzzles = [];
let shuffled = false;

let startTime, currentTime, winTime, gameInterval;



function setupMainPanel() {
    const centerContainer = document.createElement("div")
    centerContainer.setAttribute('id', 'centerContainer')

    const mainPanel = document.createElement("div")
    mainPanel.setAttribute('id', 'mainPanel')

    centerContainer.appendChild(mainPanel)

    document.body.appendChild(centerContainer)
}

setupMainPanel()

function checkWin(size) {
    if (shuffled) {
        for (let o = 0; o < size; o++) {
            for (let p = 0; p < size; p++) {
                if (puzzles[o][p] != winnerPuzzles[o][p]) return false
            }
        }
        return true
    }
}

function setDigit(img, digit) {
    img.src = `./digits/c${digit}.gif`
}

function changeTimer(s) {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;

    if (ms < 10) setDigit(ms3, ms)
    if (ms >= 10 && ms <= 99) {
        setDigit(ms2, ms.toString()[0])
        setDigit(ms3, ms.toString()[1])
    }
    if (ms >= 100) {
        setDigit(ms1, ms.toString()[0])
        setDigit(ms2, ms.toString()[1])
        setDigit(ms3, ms.toString()[2])
    }
    if (secs < 10) setDigit(sec2, secs)
    if (secs >= 10) {
        setDigit(sec1, secs.toString()[0])
        setDigit(sec2, secs.toString()[1])
    }
    if (mins < 10) setDigit(min2, mins)
    if (mins >= 10) {
        setDigit(min1, mins.toString()[0])
        setDigit(min2, mins.toString()[1])
    }
    if (hrs < 10) setDigit(hour2, hrs)
    if (hrs >= 10) {
        setDigit(hour1, hrs.toString()[0])
        setDigit(hour2, hrs.toString()[1])
    }
}

function msToTime(s) {
    let ms = s % 1000;
    s = (s - ms) / 1000;
    let secs = s % 60;
    s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;

    return hrs + ':' + mins + ':' + secs + '.' + ms;
}

function shufflePuzzles(number, size) {
    finished = false
    let puzzlesDivs = mainPanel.children
    let o = 1;
    timeouts = []
    for (let k = 0; k < number; k++) {
        let i1 = Math.floor(Math.random() * size)
        let j1 = Math.floor(Math.random() * size)
        timeouts.push(setTimeout(function () {
            puzzlesDivs[(i1 * size) + j1].click()
            if (k == number - 1) {
                shuffled = true;
                startTime = new Date()
                gameInterval = setInterval(function () {
                    currentTime = new Date()
                    let diff = currentTime.getTime() - startTime.getTime();
                    changeTimer(diff)
                    if (finished) winTime = currentTime

                }, 1)
            }
        }, o))
        o++;
    }
}

function winGame(size) {
    finished = true
    winTime = currentTime
    let diff = winTime.getTime() - startTime.getTime();
    changeTimer(diff)

    winTime = winTime.getTime() - startTime.getTime()
    console.log(msToTime(winTime))
    clearInterval(gameInterval)

    setTimeout(function () {
        alert(`Wygrales! Czas ${msToTime(winTime)}`)
    }, 800)
    setTimeout(function () {
        checkIfTop10(size, winTime)
    }, 850)

}



function movePuzzle(specialPuzzle, direction, size, top, left) {
    let distance = mainPanelSize / size
    if (direction == "down") {
        specialPuzzle.style.top = `${top + distance}px`
    }
    if (direction == "up") {
        specialPuzzle.style.top = `${top - distance}px`
    }
    if (direction == "right") {
        specialPuzzle.style.left = `${left + distance}px`
    }
    if (direction == "left") {
        specialPuzzle.style.left = `${left - distance}px`
    }
}
let canMove = true;
function slidePuzzle(specialPuzzle, direction, size, top, left) {
    canMove = false;
    let tick = 50
    let distance = (mainPanelSize / size)/tick
    canMove
    for (let i = 0; i < tick; i++) {
        setTimeout(function () {
            if (direction == "down") {
                specialPuzzle.style.top = `${top + distance*(i+1)}px`
            }
            if (direction == "up") {
                specialPuzzle.style.top = `${top - distance*(i+1)}px`
            }
            if (direction == "right") {
                specialPuzzle.style.left = `${left + distance*(i+1)}px`
            }
            if (direction == "left") {
                specialPuzzle.style.left = `${left - distance*(i+1)}px`
            }
            if(i == tick - 1) canMove = true
        }, (i + 1) * (500 / tick))
    }
}

function createPuzzle(size, i, j, imgPath) {
    let puzzle = document.createElement('div')
    puzzle.classList.add('puzzle')
    puzzle.id = `puzzle${i}${j}`
    puzzle.dataset.puzzleId = `puzzle${i}${j}`

    puzzle.style.height = `${mainPanelSize / size}px`
    puzzle.style.width = `${mainPanelSize / size}px`
    puzzle.style.backgroundPositionX = `${-j * mainPanelSize / size}px`
    puzzle.style.backgroundPositionY = `${-i * mainPanelSize / size}px`
    puzzle.style.backgroundImage = `url(${imgPath})`

    puzzle.onclick = function () {
        let top = parseInt(getComputedStyle(this).top.substring(0, getComputedStyle(this).top.length - 2))
        let left = parseInt(getComputedStyle(this).left.substring(0, getComputedStyle(this).left.length - 2))

        let id = this.id.substring(6)
        let ij = this.dataset.puzzleId.substring(6)

        let puzzleI = parseInt(ij[0])
        let puzzleJ = parseInt(ij[1])
        //move bottom
        if (puzzleI < size - 1) {
            if (puzzles[puzzleI + 1][puzzleJ] == 100) {
                if(!shuffled) movePuzzle(this, "down", size, top, left)
                if(shuffled && !canMove) return false
                if(shuffled && canMove) slidePuzzle(this, "down", size, top, left)
                puzzles[puzzleI][puzzleJ] = 100
                puzzles[puzzleI + 1][puzzleJ] = id
                puzzleI = puzzleI + 1
                puzzle.dataset.puzzleId = `puzzle${puzzleI}${puzzleJ}`
                let win = checkWin(size)
                if (win && !finished) winGame(size)
                return true;
            }
        }
        // move top
        if (puzzleI > 0) {
            if (puzzles[puzzleI - 1][puzzleJ] == 100) {
                if(!shuffled) movePuzzle(this, "up", size, top, left)
                if(shuffled && !canMove) return false
                if(shuffled && canMove) slidePuzzle(this, "up", size, top, left)
                puzzles[puzzleI][puzzleJ] = 100
                puzzles[puzzleI - 1][puzzleJ] = id
                puzzleI = puzzleI - 1
                puzzle.dataset.puzzleId = `puzzle${puzzleI}${puzzleJ}`
                let win = checkWin(size)
                if (win && !finished) winGame(size)
                return true
            }
        }
        // move right
        if (puzzleJ < size - 1) {
            if (puzzles[puzzleI][puzzleJ + 1] == 100) {
                if(!shuffled) movePuzzle(this, "right", size, top, left)
                if(shuffled && !canMove) return false
                if(shuffled && canMove) slidePuzzle(this, "right", size, top, left)
                puzzles[puzzleI][puzzleJ] = 100
                puzzles[puzzleI][puzzleJ + 1] = id
                puzzleJ = puzzleJ + 1
                puzzle.dataset.puzzleId = `puzzle${puzzleI}${puzzleJ}`
                let win = checkWin(size)
                if (win && !finished) winGame(size)
                return true;
            }
        }
        // move left
        if (puzzleJ > 0) {
            if (puzzles[puzzleI][puzzleJ - 1] == 100) {
                if(!shuffled) movePuzzle(this, "left", size, top, left)
                if(shuffled && !canMove) return false
                if(shuffled && canMove) slidePuzzle(this, "left", size, top, left)
                puzzles[puzzleI][puzzleJ] = 100
                puzzles[puzzleI][puzzleJ - 1] = id
                puzzleJ = puzzleJ - 1
                puzzle.dataset.puzzleId = `puzzle${puzzleI}${puzzleJ}`
                let win = checkWin(size)
                if (win && !finished) winGame(size)
                return true;
            }
        }
    }
    puzzles[i][j] = puzzle.dataset.puzzleId.substring(6)
    winnerPuzzles[i][j] = puzzle.dataset.puzzleId.substring(6)
    mainPanel.appendChild(puzzle)
    return false
}

function generatePuzzles(size, imgPath, shuffleNumber) {
    shuffled = false
    mainPanel.innerHTML = ""
    for (let i = 0; i < size; i++) {
        puzzles.push(new Array(size))
        winnerPuzzles.push(new Array(size))
        for (let j = 0; j < size; j++) {
            if (i == size - 1 && j == size - 1) {
                emptyPuzzle = document.createElement('div')
                emptyPuzzle.classList.add('puzzle')
                emptyPuzzle.classList.add('empty-puzzle')
                emptyPuzzle.style.width = `${mainPanelSize / size}px`
                emptyPuzzle.style.height = `${mainPanelSize / size}px`
                mainPanel.appendChild(emptyPuzzle)
                puzzles[i][j] = 100
                winnerPuzzles[i][j] = 100
            }
            else createPuzzle(size, i, j, imgPath)
        }
    }
    shufflePuzzles(shuffleNumber, size);
}

function setCookie(size, username, score, place) {
    if (place < 10) place = `0${place}`
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (365 * 10 * 24 * 60 * 60 * 1000))
    expireDate = expireDate.toUTCString()
    document.cookie = `${size}${place}=${username}-${score};expires=${expireDate}`
}

function getCookies(size) {
    let cookies = []
    let documentCookies = document.cookie.split("; ")
    documentCookies.forEach((cookie, index) => {
        if (cookie[0] == size) cookies.push({
            username: cookie.substring(1, cookie.length).split("=")[1].split("-")[0],
            score: parseInt(cookie.substring(1, cookie.length).split("=")[1].split("-")[1])
        })
    })
    return cookies
}

function checkIfTop10(size, score) {
    let cookies = getCookies(size)
    console.log(cookies)
    if (cookies.length == 0) {
        let username = prompt("Jestes w TOP 10! Podaj swój nick")
        username = encodeURI(username)
        setCookie(size, username, score, 1)
        writeTopScores(size)
        return true
    }
    let cookiesCount = cookies.length < 10 ? cookies.length : 10
    for (let i = 0; i < cookiesCount; i++) {
        if (score < cookies[i].score) {
            let username = prompt("Jestes w TOP 10! Podaj swój nick")
            username = encodeURI(username)
            setCookie(size, username, score, i + 1)
            if (cookiesCount < 10) {
                for (let j = i; j < cookiesCount; j++) {
                    setCookie(size, cookies[j].username, cookies[j].score, j + 2)
                }
            }
            else for (let j = i; j < cookiesCount - 1; j++) {
                setCookie(size, cookies[j].username, cookies[j].score, j + 2)
            }
            writeTopScores(size)
            return true
        }
    }
    if (cookies.length < 10) {
        let username = prompt("Jestes w TOP 10! Podaj swój nick")
        username = encodeURI(username)
        setCookie(size, username, score, cookies.length + 1)
        writeTopScores(size)
        return true
    }
    return false
}

function setupTopScores() {
    bottomContainer.innerHTML = ""
    for (let i = 3; i < 7; i++) {
        let topScores = document.createElement("div")
        topScores.id = `$top${i}x${i}`
        let cookies = getCookies(i)
        bottomContainer.appendChild(topScores)
    }
    document.body.appendChild(bottomContainer)
    for (let i = 3; i < 7; i++) writeTopScores(i)
}

function writeTopScores(size) {
    let topScores = document.getElementById(`$top${size}x${size}`)
    topScores.innerHTML = ""
    let cookies = getCookies(size)
    if (cookies.length > 0) {
        let label = document.createElement("h1")
        label.textContent = `${size}x${size} TOP 10`
        topScores.appendChild(label)
        cookies.forEach((cookie, index) => {
            let highscore = document.createElement("p")
            highscore.textContent = `${index + 1}. ${cookie.username} - ${msToTime(cookie.score)}`
            topScores.appendChild(highscore)
        })
    }
}

let sliding = false

setupTopScores()