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
  loadCheckboxes();
  setupTimers();
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

// ✅ Checkbox Save
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach((box, index) => {
  box.addEventListener('change', () => {
    const checkedStates = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem('tasks', JSON.stringify(checkedStates));
    saveDailyRecord();
  });
});

function loadCheckboxes() {
  const saved = JSON.parse(localStorage.getItem('tasks'));
  if (saved) {
    checkboxes.forEach((box, i) => box.checked = saved[i]);
  }
}

// ♻ Reset Button
document.getElementById('resetBtn').addEventListener('click', () => {
  checkboxes.forEach(cb => cb.checked = false);
  localStorage.removeItem('tasks');
});

// 📋 Daily Record Save
function saveDailyRecord() {
  const activities = document.querySelectorAll('.activity');
  const timeSlots = document.querySelectorAll('.time');
  const data = [];

  checkboxes.forEach((cb, i) => {
    if (cb.checked) {
      data.push({
        time: timeSlots[i].textContent,
        task: activities[i].textContent
      });
    }
  });

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const now = new Date();
  const today = now.toLocaleDateString();
  const dayName = days[now.getDay()];
  const timestamp = now.toLocaleTimeString();

  const record = {
    date: `${today} (${dayName})`,
    time: timestamp,
    completed: data
  };

  let dailyRecords = JSON.parse(localStorage.getItem('dailyRecords')) || [];
  dailyRecords.push(record);
  localStorage.setItem('dailyRecords', JSON.stringify(dailyRecords));
}

// 🔍 View Daily Record Button
document.getElementById('viewRecordBtn').addEventListener('click', () => {
  window.location.href = "record.html";
});

// ⏳ Stopwatch / Countdown Feature
function setupTimers() {
  const tasks = document.querySelectorAll('.task');

  tasks.forEach(task => {
    const btn = task.querySelector('.start-btn');
    const timerDisplay = task.querySelector('.timer');
    let countdown;
    let running = false;
    let remainingSeconds;

    function getSecondsFromDisplay() {
      const parts = timerDisplay.textContent.split(':');
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    btn.addEventListener('click', () => {
      if (!running) {
        remainingSeconds = getSecondsFromDisplay();
        running = true;
        btn.textContent = "Stop";

        countdown = setInterval(() => {
          remainingSeconds--;
          if (remainingSeconds <= 0) {
            clearInterval(countdown);
            timerDisplay.textContent = "00:00";
            btn.textContent = "Done";
            running = false;
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
      }
    });
  });
}
// viewRecordBtn click pe daily-record.html khulega
document.getElementById("viewRecordBtn").addEventListener("click", function() {
    window.location.href = "dailyrecord.html";
});
   

function saveTaskRecord(taskName, duration) {
    let date = new Date();
    let record = {
        date: date.toLocaleDateString(),
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        task: taskName,
        duration: duration,
        endTime: date.toLocaleTimeString()
    };

    let existing = JSON.parse(localStorage.getItem("dailyRecords")) || [];
    existing.push(record);
    localStorage.setItem("dailyRecords", JSON.stringify(existing));
}
