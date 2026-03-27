import { describe, it, expect, beforeEach, vi } from 'vitest';

document.body.innerHTML = `
    <div class="timer">25:00</div>
    <div class="subtitle">Tempo de Foco</div>
    <div class="stat-number">0</div>
    <div class="stat-number">0</div>
    <div class="stat-number">0</div>
    <button id="timer-start"></button>
    <button id="timer-reset"></button>
    <button id="increase-time"></button>
    <button id="decrease-time"></button>
    <button id="settings-icon"></button>
    <div id="sidebar"></div>
    <button id="close-sidebar"></button>
    <div id="overlay"></div>
    <button class="mode-btn" data-mode="foco"></button>
    <button class="mode-btn" data-mode="pausa-curta"></button>
    <button class="mode-btn" data-mode="pausa-longa"></button>
`;

import * as timerApp from './app.js';

describe('Pomodoro Timer - Testes de Lógica', () => {
    
    beforeEach(() => {
        vi.useFakeTimers(); 
        timerApp.resetTimer(); 
    });

    it('deve inicializar com 25 minutos', () => {
        expect(timerApp.tempoRestante).toBe(1500);
        const display = document.querySelector(".timer");
        expect(display.textContent).toBe("25:00");
    });

    it('deve mudar para o modo Pausa Curta corretamente', () => {
        timerApp.changeMode('pausa-curta');
        expect(timerApp.tempoRestante).toBe(5 * 60);
        const subtitle = document.querySelector(".subtitle");
        expect(subtitle.textContent).toBe("Pausa Curta");
    });

    it('deve aumentar o tempo em 5 minutos', () => {
        timerApp.adjustTime(5);
        expect(timerApp.tempoRestante).toBe(30 * 60);
        const display = document.querySelector(".timer");
        expect(display.textContent).toBe("30:00");
    });

    it('não deve permitir reduzir o tempo abaixo de 5 minutos', () => {
        timerApp.changeMode('pausa-curta'); 
        timerApp.adjustTime(-5); 
        expect(timerApp.tempoRestante).toBe(5 * 60);
    });

    it('deve atualizar o timer visualmente a cada segundo após o start', () => {
        timerApp.startTimer();
        vi.advanceTimersByTime(1000);
        
        const display = document.querySelector(".timer");
        expect(display.textContent).toBe("24:59");
        expect(timerApp.tempoRestante).toBe(1499);
    });
});