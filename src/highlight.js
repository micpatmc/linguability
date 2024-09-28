document.addEventListener("DOMContentLoaded", function () {
  function highlight(event) {
    const clickedButton = event.target;
    const group = clickedButton.getAttribute("data-group");
    const id = clickedButton.getAttribute("id");

    const buttonsInGroup = document.querySelectorAll(
      `button[data-group="${group}"]`
    );

    buttonsInGroup.forEach((button) => {
      button.classList.remove("bg-green-500");
      button.classList.remove("bg-yellow-500");
      button.classList.remove("bg-red-500");
      button.classList.remove("bg-blue-500");
      button.classList.add("bg-slate-400");
    });

    clickedButton.classList.remove("bg-slate-400");
    switch (id) {
      case "beginner":
        clickedButton.classList.add("bg-green-500");
        break;
      case "intermediate":
        clickedButton.classList.add("bg-yellow-500");
        break;
      case "advanced":
        clickedButton.classList.add("bg-red-500");
        break;
      case "spanish":
        clickedButton.classList.add("bg-blue-500");
        break;
      case "french":
        clickedButton.classList.add("bg-blue-500");
        break;
    }
  }

  const buttons = document.querySelectorAll("button[data-group]");
  buttons.forEach((button) => {
    button.addEventListener("click", highlight);
  });
});
