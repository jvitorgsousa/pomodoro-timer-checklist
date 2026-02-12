
const start = document.getElementById("timer-start");
const reset = document.getElementById("timer-reset");
const stop = document.getElementById("timer-stop");
const timer = document.querySelector(".timer");
const plus = document.getElementById("timer-plus");
const min = document.getElementById("timer-min");

let tempoRestante = 1500;
let intervalo = null;
let flagStart = false;

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

        if (tempoRestante <= 0) {
            clearInterval(intervalo);
            intervalo = null;
            alert("Tempo encerrado!");
        }
    }, 1000);

    if (tempoRestante == 0) {
        resetTimer();
    }
}

function stopTimer() {
    clearInterval(intervalo);
    intervalo = null;
}

function resetTimer() {
    clearInterval(intervalo);
    intervalo = null;
    tempoRestante = 1500;
    plus.disabled = min.disabled = false;

    updateTimer();
}

start.addEventListener("click", startTimer);
stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);

plus.addEventListener("click", () => {
    alterTimer("+")
});

min.addEventListener("click", () => {
    alterTimer("-")
});

updateTimer();