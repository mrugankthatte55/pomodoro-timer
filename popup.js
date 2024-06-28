document.getElementById('start').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'start' }, (response) => {
    if (response.success) {
      updateUI();
    }
  });
});

document.getElementById('pause').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'pause' }, (response) => {
    if (response.success) {
      updateUI();
    }
  });
});

document.getElementById('stop').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stop' }, (response) => {
    if (response.success) {
      updateUI();
    }
  });
});

document.getElementById('reset').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'reset' }, (response) => {
    if (response.success) {
      updateUI();
    }
  });
});

function updateUI() {
  chrome.storage.sync.get(['timeLeft', 'isRunning', 'workDuration', 'breakDuration', 'longBreakDuration', 'sessionsBeforeLongBreak'], (data) => {
    document.getElementById('time').textContent = formatTime(data.timeLeft || 1500);
    document.getElementById('workDuration').value = (data.workDuration / 60) || 25;
    document.getElementById('breakDuration').value = (data.breakDuration / 60) || 5;
    document.getElementById('longBreakDuration').value = (data.longBreakDuration / 60) || 15;
    document.getElementById('sessionsBeforeLongBreak').value = data.sessionsBeforeLongBreak || 4;
    document.getElementById('start').disabled = data.isRunning;
    document.getElementById('pause').disabled = !data.isRunning;
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.timeLeft) {
      document.getElementById('time').textContent = formatTime(changes.timeLeft.newValue);
    }
    if (namespace === 'sync' && changes.isRunning) {
      document.getElementById('start').disabled = changes.isRunning.newValue;
      document.getElementById('pause').disabled = !changes.isRunning.newValue;
    }
  });
});
