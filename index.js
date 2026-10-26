// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

const stateInput = document.getElementById("state-input") || document.querySelector("input");
const fetchButton = document.getElementById("submit-btn") || document.querySelector("button");

const alertContainer = document.getElementById("alerts-display");
const errorMessageDiv = document.getElementById("error-message");

function fetchWeatherAlerts(state) {
    const baseApiUrl = typeof weatherApi !== 'undefined' ? weatherApi : "https://weather.gov";
    const url = `${baseApiUrl}${state}`;

    hideError();

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch weather data for this state.");
            }
            return response.json();
        })
        .then(data => {
            displayAlerts(data);
        })
        .catch(errorObject => {
            console.log(errorObject.message);
            showError(errorObject.message);
        });
}

function displayAlerts(data) {
    if (!alertContainer) return;
    alertContainer.innerHTML = "";

    const alertCount = data.features ? data.features.length : 0;

    const summaryHeader = document.createElement("h2");
    summaryHeader.textContent = `Weather Alerts: ${alertCount}`;
    alertContainer.appendChild(summaryHeader);

    if (alertCount === 0) {
        const noAlertsMessage = document.createElement("p");
        noAlertsMessage.textContent = "No active weather alerts for this state.";
        alertContainer.appendChild(noAlertsMessage);
        return;
    }

    const list = document.createElement("ul");

    data.features.forEach(feature => {
        const listItem = document.createElement("li");
        listItem.textContent = feature.properties.headline;
        list.appendChild(listItem);
    });

    alertContainer.appendChild(list);
}

function showError(message) {
    if (errorMessageDiv) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove("hidden");
    }
}

function hideError() {
    if (errorMessageDiv) {
        errorMessageDiv.textContent = "";
        errorMessageDiv.classList.add("hidden");
    }
}

if (fetchButton) {
    fetchButton.addEventListener("click", (event) => {
        event.preventDefault();

        const stateValue = stateInput ? stateInput.value.trim().toUpperCase() : "";

        if (stateValue.length !== 2) {
            showError("Please enter a valid two-letter state abbreviation (e.g., NY, CA).");
            return;
        }

        fetchWeatherAlerts(stateValue);

        if (stateInput) {
            stateInput.value = "";
        }
    });
}
