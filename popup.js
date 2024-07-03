document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  setupButtonListeners();
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.timeLeft) {
      document.getElementById('time').textContent = formatTime(changes.timeLeft.newValue);
    }
    if (namespace === 'sync' && (changes.isRunning || changes.isPaused)) {
      updateUI();
    }
  });
});

function setupButtonListeners() {
  document.getElementById('start').addEventListener('click', startTimer);
  document.getElementById('pause').addEventListener('click', pauseTimer);
  document.getElementById('stop').addEventListener('click', stopTimer);
  document.getElementById('reset').addEventListener('click', resetTimer);
}

function updateUI() {
  chrome.storage.sync.get(['timeLeft', 'isRunning', 'isPaused'], (data) => {
    document.getElementById('time').textContent = formatTime(data.timeLeft || 1500);
    const isRunning = data.isRunning || false;
    const isPaused = data.isPaused || false;

    document.getElementById('start').disabled = isRunning || isPaused;
    document.getElementById('pause').disabled = !isRunning || isPaused;
  });
}

function startTimer() {
  chrome.runtime.sendMessage({ action: 'start' }, (response) => {
    if (response && response.success) {
      updateUI();
    }
  });
}

function pauseTimer() {
  chrome.runtime.sendMessage({ action: 'pause' }, (response) => {
    if (response && response.success) {
      updateUI();
    }
  });
}

function stopTimer() {
  chrome.runtime.sendMessage({ action: 'stop' }, (response) => {
    if (response && response.success) {
      updateUI();
    }
  });
}

function resetTimer() {
  const workDuration = parseInt(document.getElementById('workDuration').value) * 60 || 1500;
  const breakDuration = parseInt(document.getElementById('breakDuration').value) * 60 || 300;
  const longBreakDuration = parseInt(document.getElementById('longBreakDuration').value) * 60 || 900;
  const sessionsBeforeLongBreak = parseInt(document.getElementById('sessionsBeforeLongBreak').value) || 4;

  chrome.runtime.sendMessage({
    action: 'reset',
    workDuration: workDuration,
    breakDuration: breakDuration,
    longBreakDuration: longBreakDuration,
    sessionsBeforeLongBreak: sessionsBeforeLongBreak
  }, (response) => {
    if (response && response.success) {
      updateUI();
    }
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
}
