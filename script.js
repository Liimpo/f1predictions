// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAkM3mKk9w4zylsMHlBiWZpfSRDbCXVWsE",
  authDomain: "f1-prediction-68d4a.firebaseapp.com",
  projectId: "f1-prediction-68d4a",
  storageBucket: "f1-prediction-68d4a.firebasestorage.app",
  messagingSenderId: "1003727143580",
  appId: "1:1003727143580:web:aa6deba67bb51f3abfa359"
};


firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Load F1 data from the official API
async function loadF1Data() {
    try {
        const response = await fetch('https://fantasy.formula1.com/feeds/drivers/1_en.json?buster=20260302131625');
        const data = await response.json();
        const drivers = data.drivers;
        const constructors = data.constructors;

        // Populate driver dropdowns
        const driverSelects = ['driver1', 'driver2', 'driver3'];
        driverSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Select Driver</option>';
            drivers.forEach(driver => {
                const option = document.createElement('option');
                option.value = `${driver.first_name} ${driver.last_name}`;
                option.textContent = `${driver.first_name} ${driver.last_name} (${driver.team_name})`;
                select.appendChild(option);
            });
        });

        // Populate constructor dropdowns
        const constructorSelects = ['team1', 'team2', 'team3'];
        constructorSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Select Team</option>';
            constructors.forEach(constructor => {
                const option = document.createElement('option');
                option.value = constructor.name;
                option.textContent = constructor.name;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error("Error loading F1 data:", error);
    }
}

// Login function
function login() {
    const userName = document.getElementById("userName").value;
    if (userName) {
        localStorage.setItem("userName", userName);
        document.getElementById("login").style.display = "none";
        document.getElementById("predictionForm").style.display = "block";
        loadResults();
    }
}

// Save predictions to Firebase
function savePredictions() {
    const userName = localStorage.getItem("userName");
    const predictions = {
        teams: [
            document.getElementById("team1").value,
            document.getElementById("team2").value,
            document.getElementById("team3").value
        ],
        drivers: [
            document.getElementById("driver1").value,
            document.getElementById("driver2").value,
            document.getElementById("driver3").value
        ],
        score: 0
    };
    database.ref('predictions/' + userName).set(predictions);
    loadResults();
}

// Load and display results
function loadResults() {
    database.ref('predictions').once('value').then((snapshot) => {
        const resultsBody = document.getElementById("resultsBody");
        resultsBody.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.key;
            const data = childSnapshot.val();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user}</td>
                <td>${data.teams.join(", ")}</td>
                <td>${data.drivers.join(", ")}</td>
                <td>${data.score}</td>
            `;
            resultsBody.appendChild(row);
        });
        document.getElementById("results").style.display = "block";
    });
}

// Load F1 data when the page loads
window.onload = loadF1Data;
