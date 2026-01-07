// ===============================
// CONFIG
// ===============================
const API_URL = "https://gamageg-iris-classifier.hf.space/predict";

// ===============================
// FORM HANDLING
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("classifierForm");
    const loading = document.getElementById("loadingIndicator");
    const results = document.getElementById("resultsSection");
    const errorBox = document.getElementById("errorMessage");
    const errorContent = document.getElementById("errorContent");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // 🚨 THIS WAS MISSING
        hideError();
        hideResults();
        showLoading();

        const data = {
            sepal_length: parseFloat(document.getElementById("sepalLength").value),
            sepal_width: parseFloat(document.getElementById("sepalWidth").value),
            petal_length: parseFloat(document.getElementById("petalLength").value),
            petal_width: parseFloat(document.getElementById("petalWidth").value)
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const result = await response.json();
            showResults(result);
        } catch (err) {
            showError("❌ Failed to reach AI backend. Check API URL.");
            console.error(err);
        } finally {
            hideLoading();
        }
    });
});

// ===============================
// UI HELPERS
// ===============================
function showLoading() {
    document.getElementById("loadingIndicator").style.display = "block";
}

function hideLoading() {
    document.getElementById("loadingIndicator").style.display = "none";
}

function showResults(data) {
    const results = document.getElementById("resultsSection");
    document.getElementById("resultSpecies").textContent =
        data.prediction.toUpperCase();
    document.getElementById("resultConfidence").textContent =
        `${data.confidence.toFixed(2)}%`;

    results.style.display = "block";
}

function hideResults() {
    document.getElementById("resultsSection").style.display = "none";
}

function showError(message) {
    const box = document.getElementById("errorMessage");
    document.getElementById("errorContent").textContent = message;
    box.style.display = "block";
}

function hideError() {
    document.getElementById("errorMessage").style.display = "none";
}

// ===============================
// QUICK TESTS
// ===============================
function loadSample(type) {
    const samples = {
        setosa: { sl: 5.1, sw: 3.5, pl: 1.4, pw: 0.2 },
        versicolor: { sl: 6.0, sw: 2.8, pl: 4.5, pw: 1.3 },
        virginica: { sl: 6.9, sw: 3.1, pl: 5.4, pw: 2.1 }
    };

    const s = samples[type];
    document.getElementById("sepalLength").value = s.sl;
    document.getElementById("sepalWidth").value = s.sw;
    document.getElementById("petalLength").value = s.pl;
    document.getElementById("petalWidth").value = s.pw;
}

   
