document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
    document.querySelector(".content").style.visibility = "hidden";
    document.querySelector("#loader").style.visibility = "visible";
  } else {
    setTimeout(function () {
      document.querySelector("#loader").style.display = "none";
      document.querySelector(".content").style.visibility = "visible";
    }, 1000);
  }
};

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

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

let experience = document.querySelectorAll('.experience');

    window.onscroll = () => {
      experience.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 250;
        let height = sec.offsetHeight;

        if (top >= offset && top < offset + height) {
          sec.classList.add('experience-animate');
        } 
      })
}
    
// TODO: Skill bar animation
function moveAlldesign() {
  var skillBars = document.querySelectorAll(".myBardesign");

  skillBars.forEach(function (myBardesign) {
    var width = 10;
    var numericValue = parseFloat(myBardesign.getAttribute("data-percent"));
    var i = 0;

    if (i == 0) {
      i = 1;
      var id = setInterval(frame, 10);

      function frame() {
        if (width >= numericValue) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          myBardesign.style.width = width + "%";
          myBardesign.innerHTML = width + "%";
        }
      }
    }
  });
}
