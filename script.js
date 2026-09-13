const startSound = new Audio('start-click.wav');
const workAlarm = new Audio('work-done.wav');
const breakAlarm = new Audio('break-done.wav');

let countdown;
let timeLeft = 25 * 60; // Default to 25 mins
let isRunning = false;
let currentMode = 'WORK'; // 'WORK', 'SHORT_BREAK', 'LONG_BREAK'
let pomodorosCompleted = 0;

const timeDisplay = document.getElementById('time-left');
const modeDisplay = document.getElementById('current-mode');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Input fields
const workInput = document.getElementById('work-length');
const shortBreakInput = document.getElementById('short-break-length');
const longBreakInput = document.getElementById('long-break-length');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function switchMode() {
    if (currentMode === 'WORK') {
        pomodorosCompleted++;
        if (pomodorosCompleted % 4 === 0) {
            currentMode = 'LONG_BREAK';
            timeLeft = parseInt(longBreakInput.value) * 60;
        } else {
            currentMode = 'SHORT_BREAK';
            timeLeft = parseInt(shortBreakInput.value) * 60;
        }
    } else {
        currentMode = 'WORK';
        timeLeft = parseInt(workInput.value) * 60;
    }
    modeDisplay.textContent = currentMode.replace('_', ' ') + " CYCLE";
    updateDisplay();
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    
    // Reset and play the start click
    startSound.currentTime = 0; 
    startSound.play();

    countdown = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            isRunning = false;
            
            // Play the appropriate alarm before switching modes
            if (currentMode === 'WORK') {
                workAlarm.currentTime = 0;
                workAlarm.play();
            } else { // It's either SHORT_BREAK or LONG_BREAK
                breakAlarm.currentTime = 0;
                breakAlarm.play();
            }
            
            switchMode();
            
            // If you want the timer to automatically roll into the next cycle 
            // without requiring a manual click, uncomment the line below:
            startTimer(); 
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(countdown);
    isRunning = false;
}

function resetTimer() {
    clearInterval(countdown);
    isRunning = false;
    currentMode = 'WORK';
    pomodorosCompleted = 0;
    timeLeft = parseInt(workInput.value) * 60;
    modeDisplay.textContent = "WORK CYCLE";
    updateDisplay();
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Update time immediately if inputs change while paused
[workInput, shortBreakInput, longBreakInput].forEach(input => {
    input.addEventListener('change', () => {
        if (!isRunning) resetTimer();
    });
});

// Initialize
updateDisplay();
