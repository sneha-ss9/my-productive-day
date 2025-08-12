// 🌙 Theme Toggle
const toggleBtn = document.getElementById('toggleTheme');
const body = document.body;
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');

function setTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    sun.style.display = 'none';
    moon.style.display = 'inline';
  } else {
    body.classList.remove('dark-mode');
    sun.style.display = 'inline';
    moon.style.display = 'none';
  }
  localStorage.setItem('theme', theme);
}

toggleBtn.addEventListener('click', () => {
  const isDark = body.classList.contains('dark-mode');
  setTheme(isDark ? 'light' : 'dark');
});

// Load saved theme on page load
window.onload = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  startClock();
  showQuote();
  setupTimers();
  // ❌ No auto-checkbox load to avoid pre-selected state
};

// 🕒 Live Clock & Date with Day
function startClock() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  setInterval(() => {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const dayName = days[now.getDay()];
    const timeString = now.toLocaleTimeString();
    document.getElementById('clock').textContent = `📅 ${dateString} (${dayName}) ⏰ ${timeString}`;
  }, 1000);
}

// 💬 Motivational Quotes
const quotes = [
  "Believe in yourself.",
  "Every day is a second chance.",
  "Discipline is the bridge between goals and success.",
  "Success is no accident.",
  "Push yourself, no one else is going to do it for you.",
  "Start where you are. Use what you have. Do what you can.",
  "Don’t stop until you’re proud.",
  "Dream it. Wish it. Do it.",
  "Work hard in silence, let success make the noise."
];

function showQuote() {
  const quoteBox = document.getElementById('quoteBox');
  let index = 0;
  quoteBox.textContent = quotes[index];
  index++;
  setInterval(() => {
    quoteBox.textContent = quotes[index];
    index = (index + 1) % quotes.length;
  }, 4000);
}

// ✅ Checkbox Save + Record Save
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach((box, index) => {
  box.addEventListener('change', () => {
    if (box.checked) {
      const taskName = document.querySelectorAll('.activity')[index].textContent;
      const timerData = timersData[index] || { timeSpent: 0, totalDuration: 0 };

      // Calculate time spent at moment of checking
      if (timerData.startTime) {
        let elapsedSeconds = Math.floor((Date.now() - timerData.startTime) / 1000);
        timerData.timeSpent = Math.floor(elapsedSeconds / 60);
      }

      saveTaskRecord(taskName, timerData.totalDuration, timerData.timeSpent);
    }
  });
});

// ♻ Reset Button
document.getElementById('resetBtn').addEventListener('click', () => {
  checkboxes.forEach(cb => cb.checked = false);
  localStorage.removeItem('tasks');
});

// 📋 Save record to localStorage (No separate "day" property)
function saveTaskRecord(taskName, totalDurationMin, timeSpentMin) {
  let now = new Date();
  let dateWithDay = `${now.toLocaleDateString()} (${now.toLocaleString('en-US', { weekday: 'short' })})`;

  let existing = JSON.parse(localStorage.getItem("dailyRecords")) || [];

  // Prevent duplicate for same task on same date
  let alreadyExists = existing.some(r => r.date === dateWithDay && r.task === taskName);
  if (alreadyExists) return;

  let record = {
    date: dateWithDay,
    task: taskName,
    totalDuration: totalDurationMin,
    timeSpent: timeSpentMin,
    endTime: now.toLocaleTimeString()
  };

  existing.push(record);
  localStorage.setItem("dailyRecords", JSON.stringify(existing));
}

// 🔍 View Daily Record Button
document.getElementById('viewRecordBtn').addEventListener('click', () => {
  window.location.href = "dailyrecord.html";
});

// Store timer data per task
let timersData = [];

// ⏳ Stopwatch / Countdown Feature
function setupTimers() {
  const tasks = document.querySelectorAll('.task');

  tasks.forEach((task, idx) => {
    const btn = task.querySelector('.start-btn');
    const timerDisplay = task.querySelector('.timer');
    let countdown;
    let running = false;
    let remainingSeconds;
    let startTime;
    let totalDurationMin;

    timersData[idx] = { totalDuration: 0, timeSpent: 0, startTime: null };

    function getSecondsFromDisplay() {
      const parts = timerDisplay.textContent.split(':');
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    btn.addEventListener('click', () => {
      if (!running) {
        remainingSeconds = getSecondsFromDisplay();
        totalDurationMin = Math.floor(remainingSeconds / 60);
        timersData[idx].totalDuration = totalDurationMin;

        startTime = Date.now();
        timersData[idx].startTime = startTime;

        running = true;
        btn.textContent = "Stop";

        countdown = setInterval(() => {
          remainingSeconds--;
          if (remainingSeconds <= 0) {
            clearInterval(countdown);
            timerDisplay.textContent = "00:00";
            btn.textContent = "Done";
            running = false;
            timersData[idx].timeSpent = totalDurationMin;
            return;
          }
          let mins = Math.floor(remainingSeconds / 60);
          let secs = remainingSeconds % 60;
          timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);

      } else {
        clearInterval(countdown);
        running = false;
        btn.textContent = "Start";
        let elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        timersData[idx].timeSpent = Math.floor(elapsedSeconds / 60);
      }
    });
  });
}
