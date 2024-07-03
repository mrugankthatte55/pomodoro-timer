let isRunning = false;
let isBreak = false;
let timeLeft;
let sessionsCompleted = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['isRunning', 'isBreak', 'timeLeft', 'sessionsCompleted', 'workDuration', 'breakDuration', 'longBreakDuration', 'sessionsBeforeLongBreak'], (data) => {
    isRunning = data.isRunning || false;
    isBreak = data.isBreak || false;
    timeLeft = data.timeLeft || 1500;
    sessionsCompleted = data.sessionsCompleted || 0;
    if (isRunning) {
      chrome.alarms.create('pomodoroTimer', { periodInMinutes: 1 / 60 });
    }
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoroTimer') {
    countdown();
  }
});

function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
    chrome.storage.sync.set({ timeLeft: timeLeft });
  } else {
    isRunning = false;
    isBreak = !isBreak;
    if (!isBreak) sessionsCompleted++;
    chrome.storage.sync.get(['workDuration', 'breakDuration', 'longBreakDuration', 'sessionsBeforeLongBreak'], (data) => {
      const workDuration = data.workDuration || 25 * 60;
      const breakDuration = data.breakDuration || 5 * 60;
      const longBreakDuration = data.longBreakDuration || 15 * 60;
      const sessionsBeforeLongBreak = data.sessionsBeforeLongBreak || 4;

      if (isBreak) {
        if (sessionsCompleted % sessionsBeforeLongBreak === 0 && sessionsCompleted !== 0) {
          timeLeft = longBreakDuration;
        } else {
          timeLeft = breakDuration;
        }
      } else {
        timeLeft = workDuration;
      }

      chrome.storage.sync.set({
        isRunning: isRunning,
        isBreak: isBreak,
        sessionsCompleted: sessionsCompleted,
        timeLeft: timeLeft
      });

      const audio = new Audio('alert.mp3');
      audio.play();
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Pomodoro Timer',
        message: isBreak ? 'Time for a break!' : 'Back to work!'
      });

      isRunning = true;
      chrome.alarms.create('pomodoroTimer', { periodInMinutes: 1 / 60 });
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    if (!isRunning) {
      chrome.storage.sync.get(['workDuration', 'breakDuration', 'longBreakDuration', 'sessionsBeforeLongBreak'], (data) => {
        const workDuration = data.workDuration || 25 * 60;
        const breakDuration = data.breakDuration || 5 * 60;
        const longBreakDuration = data.longBreakDuration || 15 * 60;
        const sessionsBeforeLongBreak = data.sessionsBeforeLongBreak || 4;

        if (isBreak) {
          if (sessionsCompleted % sessionsBeforeLongBreak === 0 && sessionsCompleted !== 0) {
            timeLeft = longBreakDuration;
          } else {
            timeLeft = breakDuration;
          }
        } else {
          timeLeft = workDuration;
        }

        isRunning = true;
        chrome.storage.sync.set({
          isRunning: isRunning,
          timeLeft: timeLeft
        });
        chrome.alarms.create('pomodoroTimer', { periodInMinutes: 1 / 60 });
        sendResponse({ success: true });
      });
    }
  } else if (message.action === 'pause') {
    chrome.alarms.clear('pomodoroTimer');
    isRunning = false;
    chrome.storage.sync.set({ isRunning: isRunning });
    sendResponse({ success: true });
  } else if (message.action === 'stop') {
    chrome.alarms.clear('pomodoroTimer');
    isRunning = false;
    timeLeft = 1500;
    chrome.storage.sync.set({
      timeLeft: timeLeft,
      isRunning: isRunning
    });
    sendResponse({ success: true });
  } else if (message.action === 'reset') {
    const workDuration = message.workDuration;
    const breakDuration = message.breakDuration;
    const longBreakDuration = message.longBreakDuration;
    const sessionsBeforeLongBreak = message.sessionsBeforeLongBreak;

    chrome.alarms.clear('pomodoroTimer');
    timeLeft = workDuration;
    isRunning = false;
    chrome.storage.sync.set({
      timeLeft: timeLeft,
      isRunning: isRunning,
      workDuration: workDuration,
      breakDuration: breakDuration,
      longBreakDuration: longBreakDuration,
      sessionsBeforeLongBreak: sessionsBeforeLongBreak
    });
    sendResponse({ success: true });
  }
});
