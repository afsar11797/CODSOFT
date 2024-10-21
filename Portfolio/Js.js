function closeForm() {
  document.getElementById("form-container").style.display = "content";
}

window.addEventListener("load", () => {
  new Typewriter("#typewriter", {
    strings: [
      "Front-end Developer",
      "Web Designer",
      "Financial Analyst",
    ],
    autoStart: true,
    loop: true,
  });
});