window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    alert("Response submitted");
  });

new Swiper(".swiper", {
  loop: true,
  slidesPerView: 3,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
});