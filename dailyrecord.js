// Load records from localStorage
let records = JSON.parse(localStorage.getItem("dailyRecords")) || [];
let tableBody = document.getElementById("recordTableBody");

// Function to display records
function displayRecords() {
  tableBody.innerHTML = ""; // Clear old rows

  if (records.length === 0) {
    let row = `<tr>
      <td colspan="6" class="no-data">📭 No data found</td>
    </tr>`;
    tableBody.innerHTML = row;
  } else {
    records.forEach((rec, index) => {
      let row = `<tr>
        <td>${index + 1}</td>
        <td>${rec.date}</td>
        <td>${rec.task}</td>
        <td>${rec.totalDuration || "-"}</td>
        <td>${rec.timeSpent || "-"}</td>
        <td>${rec.endTime}</td>
      </tr>`;
      tableBody.innerHTML += row;
    });
  }
}

// Theme Toggle Function
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-theme") ? "dark" : "light"
  );
}

// Apply theme on page load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}

// Clear All Records Function
function clearAllRecords() {
  if (confirm("Are you sure you want to delete all records?")) {
    localStorage.removeItem("dailyRecords");
    records = [];
    displayRecords();
  }
}

// Initial table display
displayRecords();
