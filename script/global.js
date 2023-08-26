function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.onload = function () {
  scrollToTop();
};

let mybutton = document.getElementById("myBtn");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (window.pageYOffset > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  scrollToTop();
}

mybutton.addEventListener("click", topFunction);
