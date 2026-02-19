
const start = document.getElementById("timer-start");
const reset = document.getElementById("timer-reset");
const stop = document.getElementById("timer-stop");
const timer = document.querySelector(".timer");
const plus = document.getElementById("timer-plus");
const min = document.getElementById("timer-min");

let tempoRestante = 2;
let intervalo = null;
let breakerFlag = true;
let breakerCount = 0;

function alterTimer(operacao) {
    let timerStrToInt = tempoRestante / 60 ;

    if (operacao === "+"){
        if (timerStrToInt < 45){
            timerStrToInt = parseInt(timer.textContent.charAt(0) + timer.textContent.charAt(1), 10);
            tempoRestante = (timerStrToInt + 5) * 60;
            updateTimer();
        }
    } else {
        if (timerStrToInt > 20){
            timerStrToInt = parseInt(timer.textContent.charAt(0) + timer.textContent.charAt(1), 10);
            tempoRestante = (timerStrToInt - 5) * 60;
            updateTimer();
        }
    }
}

function updateTimer() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;

    timer.textContent = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

function startTimer() {
    if (intervalo !== null) return;
    plus.disabled = min.disabled = true;

    intervalo = setInterval(() => {
        tempoRestante--;
        updateTimer();

        if (tempoRestante == 0) {
            clearInterval(intervalo);
            intervalo = null;
            alert("Tempo encerrado!");
            startBreak();
        }
    }, 1000);
}

function startBreak() {
    tempoRestante = 5;

    if (breakerFlag == false){
        console.log("EM POMODORO")

        breakerFlag = true;
        resetTimer();
    } else {
        breakerCount += 1;
        document.getElementById("intervalo").innerHTML = `intervalo ${breakerCount}` 
        updateTimer();
        console.log("EM INTERVALO")
        console.log(breakerFlag)
        
        breakerFlag = false;
    }
}

function flushBreakCounter() {
    document.getElementById("intervalo").innerHTML = `intervalo` 
    breakerCount = 0;
}

function stopTimer() {
    clearInterval(intervalo);
    intervalo = null;
}

function resetTimer() {
    clearInterval(intervalo);
    intervalo = null;
    tempoRestante = 2;
    plus.disabled = min.disabled = false;
    
    updateTimer();
}

start.addEventListener("click", startTimer);
stop.addEventListener("click", stopTimer);

reset.addEventListener("click", () =>{
    resetTimer();
    flushBreakCounter();
    breakerFlag = true;  
});

plus.addEventListener("click", () => {
    alterTimer("+")
});
min.addEventListener("click", () => {
    alterTimer("-")
});

updateTimer();