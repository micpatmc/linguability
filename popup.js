document.addEventListener('DOMContentLoaded', function () {
  // Get references to the buttons and the Get Started button
  const languageButtons = document.querySelectorAll(
    'button[data-group="language"]'
  );
  const experienceButtons = document.querySelectorAll(
    'button[data-group="experience"]'
  );
  const getStartedButton = document.getElementById("getStarted");

  let selectedLanguage = null;
  let selectedExperience = null;

  // Event listeners for language selection
  languageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      selectedLanguage = this.id; // Set the selected language based on the button clicked
      languageButtons.forEach((btn) => btn.classList.remove("bg-blue-400")); // Remove highlighting from all buttons
      this.classList.add("bg-blue-400"); // Highlight the selected button
    });
  });

  // Event listeners for experience level selection
  experienceButtons.forEach((button) => {
    button.addEventListener("click", function () {
      selectedExperience = this.id; // Set the selected experience level
      experienceButtons.forEach((btn) =>
        btn.classList.remove("bg-green-400", "bg-yellow-400", "bg-red-400")
      );
      this.classList.add(
        `bg-${
          this.classList.contains("hover:bg-green-400")
            ? "green-400"
            : this.classList.contains("hover:bg-yellow-400")
            ? "yellow-400"
            : "red-400"
        }`
      );
    });
  });

  // Handle the Get Started button click
  getStartedButton.addEventListener("click", function () {
    const messageObject = {
      language: selectedLanguage,
      difficulty: selectedExperience,
    };

    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0].id;

      // Send a message to the content script of the active tab
      chrome.tabs.sendMessage(activeTab, messageObject, (response) => {
        console.log("Response from content script:", response);
      });
    });
  });

  // Handle swap between loading SVG and button text and disable/enable
  // button via a listener to receive information from the content
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received from content script:", message);

    let isLoading = message.isLoading;

    toggleLoading(isLoading);
    sendResponse({ status: "Message received", data: message });
  });
});

const toggleLoading = (isLoading) => {
  const getStartedButton = document.getElementById("getStarted");
  const getStartedText = document.getElementById("getStartedText");
  const loadingSVG = document.getElementById("loadingSVG");

  if (isLoading) {
    loadingSVG.style.display = "block";
    getStartedText.style.display = "none";
    getStartedButton.disabled = true;
  } else {
    loadingSVG.style.display = "none";
    getStartedText.style.display = "block";
    getStartedButton.disabled = false;
  }
}
