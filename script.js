// ==============================
// CONFIG
// ==============================
const API_URL = "https://gamageg-iris-classifier.hf.space/predict";

// ==============================
// MAIN ACTION
// ==============================
async function classifyFlower() {
    hideError();
    hideResult();
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
            throw new Error("API error");
        }

        const result = await response.json();
        showResult(result);

    } catch (err) {
        showError("❌ Could not reach AI backend");
        console.error(err);
    } finally {
        hideLoading();
    }
}

// ==============================
// UI HELPERS
// ==============================
function showLoading() {
    document.getElementById("loading").style.display = "block";
}

function hideLoading() {
    document.getElementById("loading").style.display = "none";
}

function showResult(data) {
    document.getElementById("species").textContent =
        "Prediction: " + data.prediction.toUpperCase();
    document.getElementById("confidence").textContent =
        "Confidence: " + data.confidence.toFixed(2) + "%";
    document.getElementById("result").style.display = "block";
}

function hideResult() {
    document.getElementById("result").style.display = "none";
}

function showError(msg) {
    document.getElementById("error").textContent = msg;
    document.getElementById("error").style.display = "block";
}

function hideError() {
    document.getElementById("error").style.display = "none";
}

// ==============================
// QUICK TESTS
// ==============================
function loadSample(type) {
    const samples = {
        setosa: [5.1, 3.5, 1.4, 0.2],
        versicolor: [6.0, 2.8, 4.5, 1.3],
        virginica: [6.9, 3.1, 5.4, 2.1]
    };

    const s = samples[type];
    document.getElementById("sepalLength").value = s[0];
    document.getElementById("sepalWidth").value = s[1];
    document.getElementById("petalLength").value = s[2];
    document.getElementById("petalWidth").value = s[3];
}
