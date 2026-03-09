const startBtn = document.getElementById("timer-start");
const resetBtn = document.getElementById("timer-reset");
const timerDisplay = document.querySelector(".timer");
const subtitle = document.querySelector(".subtitle");
const statsSessions = document.querySelectorAll(".stat-number")[0];
const statsMinutes = document.querySelectorAll(".stat-number")[1];
const statsCycles = document.querySelectorAll(".stat-number")[2];
const modeButtons = document.querySelectorAll(".mode-btn");
const increaseBtn = document.getElementById("increase-time");
const decreaseBtn = document.getElementById("decrease-time");
const settingsIcon = document.getElementById("settings-icon");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-sidebar");
const overlay = document.getElementById("overlay");
const logoutBtn = document.getElementById("logout-btn");


let tempoRestante = 25 * 60;
let intervalo = null;
let isWorking = true;
let completedSessions = 0;
let totalFocusMinutes = 0;
let completedCycles = 0;

const times = {
    foco: 25,
    "pausa-curta": 5,
    "pausa-longa": 15
};

const body = document.body;

function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
    document.body.classList.add("sidebar-open");
}

// Função para fechar barra lateral
function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    document.body.classList.remove("sidebar-open");
}

if (settingsIcon) {
    settingsIcon.addEventListener("click", openSidebar);
}

if (closeBtn) {
    closeBtn.addEventListener("click", closeSidebar);
}

if (overlay) {
    overlay.addEventListener("click", closeSidebar);
}

// Logout (ainda falta autenticar com o Firebase) tenho que ver isso
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (confirm("Deseja realmente sair da conta?")) {
            alert("Você saiu da conta!");
            window.location.href = "../../cadastro/index.html";
        }
    });
}

// Atualiza o display do timer
function updateTimer() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    timerDisplay.textContent = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

// Muda o modo (Foco / Pausa Curta / Pausa Longa)
function changeMode(mode) {
    body.classList.remove("mode-foco", "mode-pausa-curta", "mode-pausa-longa");
    body.classList.add(`mode-${mode}`);

    modeButtons.forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    isWorking = (mode === "foco");
    tempoRestante = times[mode] * 60;
    subtitle.textContent = isWorking
        ? "Tempo de Foco"
        : (mode === "pausa-curta" ? "Pausa Curta" : "Pausa Longa");

    updateTimer();
    stopTimer();
}

// Ajusta tempo manualmente
function adjustTime(delta) {
    if (intervalo !== null) return; // não permite ajustar enquanto roda

    let currentMinutes = Math.floor(tempoRestante / 60);
    let newMinutes = currentMinutes + delta;

    if (newMinutes < 5) newMinutes = 5;
    if (newMinutes > 60) newMinutes = 60;

    tempoRestante = newMinutes * 60;
    updateTimer();

    if (newMinutes !== times.foco && isWorking) {
        subtitle.textContent = `${newMinutes} Minutos de Foco (Personalizado)`;
    } else if (isWorking) {
        subtitle.textContent = "Tempo de Foco";
    }
}

// Inicia o timer
function startTimer() {
    if (intervalo !== null) return;

    intervalo = setInterval(() => {
        tempoRestante--;

        if (tempoRestante <= 0) {
            clearInterval(intervalo);
            intervalo = null;
            alert(isWorking ? "Foco terminado! Hora da pausa." : "Pausa terminada! Volte ao foco.");

            if (isWorking) {
                completedSessions++;
                totalFocusMinutes += times.foco;
                statsSessions.textContent = completedSessions;
                statsMinutes.textContent = totalFocusMinutes;

                if (completedSessions % 4 === 0) {
                    completedCycles++;
                    statsCycles.textContent = completedCycles;
                    changeMode("pausa-longa");
                } else {
                    changeMode("pausa-curta");
                }
            } else {
                changeMode("foco");
            }
        }

        updateTimer();
    }, 1000);
}

// Para o timer
function stopTimer() {
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
    }
}

// Reseta tudo
function resetTimer() {
    stopTimer();
    tempoRestante = 25 * 60;
    isWorking = true;
    subtitle.textContent = "Tempo de Foco";
    updateTimer();
    body.classList.remove("mode-pausa-curta", "mode-pausa-longa");
    body.classList.add("mode-foco");
}

// Desabilita/abilita botões de ajustar tempo
function toggleAdjustButtons(disable) {
    if (increaseBtn) increaseBtn.disabled = disable;
    if (decreaseBtn) decreaseBtn.disabled = disable;
}

// Eventos dos modos
modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const mode = button.getAttribute("data-mode");
        if (mode) {
            changeMode(mode);
        }
    });
});

// Eventos dos botões de ação
if (startBtn) {
    startBtn.addEventListener("click", () => {
        startTimer();
        toggleAdjustButtons(true);
    });
}

if (resetBtn) {
    resetBtn.addEventListener("click", resetTimer);
}

// Eventos de ajuste de tempo
if (increaseBtn) increaseBtn.addEventListener("click", () => adjustTime(5));
if (decreaseBtn) decreaseBtn.addEventListener("click", () => adjustTime(-5));

// Inicializa no modo Foco (depois tem que ajeitar para ir para os outros modos quando estiver neles)
changeMode("foco");