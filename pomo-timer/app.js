
const start = document.getElementById("timer-start");
const reset = document.getElementById("timer-reset");
const stop = document.getElementById("timer-stop");
const timer = document.querySelector(".timer");

let tempoRestante = 1500;
let intervalo = null;

function updateTimer() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;

    timer.textContent = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

function startTimer() {
    if (intervalo !== null) return;

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
    updateTimer();
}

start.addEventListener("click", startTimer);
stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);

updateTimer();