let timer;
let isRunning = false;
let isBreak = false;
let timeLeft;

document.getElementById('start').addEventListener('click', () => {
  if (!isRunning) {
    const workDuration = parseInt(document.getElementById('workDuration').value) * 60;
    const breakDuration = parseInt(document.getElementById('breakDuration').value) * 60;
    timeLeft = isBreak ? breakDuration : workDuration;
    timer = setInterval(countdown, 1000);
    isRunning = true;
  }
});

document.getElementById('stop').addEventListener('click', () => {
  clearInterval(timer);
  isRunning = false;
});

document.getElementById('reset').addEventListener('click', () => {
  clearInterval(timer);
  timeLeft = 1500;
  document.getElementById('time').textContent = formatTime(timeLeft);
  isRunning = false;
});

function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
    document.getElementById('time').textContent = formatTime(timeLeft);
  } else {
    clearInterval(timer);
    isRunning = false;
    isBreak = !isBreak;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Pomodoro Timer',
      message: isBreak ? 'Time for a break!' : 'Back to work!'
    });
    document.getElementById('start').click();
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
}

document.getElementById('time').textContent = formatTime(1500);
let sessionsCompleted = 0;

document.getElementById('start').addEventListener('click', () => {
  if (!isRunning) {
    const workDuration = parseInt(document.getElementById('workDuration').value) * 60;
    const breakDuration = parseInt(document.getElementById('breakDuration').value) * 60;
    const longBreakDuration = parseInt(document.getElementById('longBreakDuration').value) * 60;
    const sessionsBeforeLongBreak = parseInt(document.getElementById('sessionsBeforeLongBreak').value);
    
    if (isBreak) {
      if (sessionsCompleted % sessionsBeforeLongBreak === 0 && sessionsCompleted !== 0) {
        timeLeft = longBreakDuration;
      } else {
        timeLeft = breakDuration;
      }
    } else {
      timeLeft = workDuration;
    }

    timer = setInterval(countdown, 1000);
    isRunning = true;
  }
});

function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
    document.getElementById('time').textContent = formatTime(timeLeft);
  } else {
    clearInterval(timer);
    isRunning = false;
    isBreak = !isBreak;
    if (!isBreak) sessionsCompleted++;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Pomodoro Timer',
      message: isBreak ? 'Time for a break!' : 'Back to work!'
    });
    document.getElementById('start').click();
  }
}
function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
    document.getElementById('time').textContent = formatTime(timeLeft);
  } else {
    clearInterval(timer);
    isRunning = false;
    isBreak = !isBreak;
    if (!isBreak) sessionsCompleted++;
    const audio = new Audio('alert.mp3');
    audio.play();
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Pomodoro Timer',
      message: isBreak ? 'Time for a break!' : 'Back to work!'
    });
    document.getElementById('start').click();
  }
}
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['isRunning', 'isBreak', 'timeLeft', 'sessionsCompleted'], (data) => {
    isRunning = data.isRunning || false;
    isBreak = data.isBreak || false;
    timeLeft = data.timeLeft || 1500;
    sessionsCompleted = data.sessionsCompleted || 0;
    document.getElementById('time').textContent = formatTime(timeLeft);
    if (isRunning) {
      timer = setInterval(countdown, 1000);
    }
  });
});

/**function saveState() {
  chrome.storage.sync.set({
    isRunning: isRunning,
    isBreak: isBreak,
    timeLeft: timeLeft,
    sessionsCompleted: sessionsCompleted
  });
}**/

function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
    document.getElementById('time').textContent = formatTime(timeLeft);
  } else {
    clearInterval(timer);
    isRunning = false;
    isBreak = !isBreak;
    if (!isBreak) sessionsCompleted++;
    const audio = new Audio('alert.mp3');
    audio.play();
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Pomodoro Timer',
      message: isBreak ? 'Time for a break!' : 'Back to work!'
    });
    document.getElementById('start').click();
  }
  saveState();
}
