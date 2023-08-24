document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

const texts = ["I'm Rifzkhy", "I'm Programmer", "I'm Desainer"];

const typingElement = document.querySelector(".typing");
let textIndex = 0;

function type() {
  let i = 0;
  const text = texts[textIndex];
  const typingInterval = setInterval(() => {
    if (i < text.length) {
      typingElement.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);
      setTimeout(erase, 1000); // Wait for a moment before erasing
    }
  }, 200); // Adjust the typing speed by changing the interval (e.g., 50 for faster typing).
}

function erase() {
  const typingInterval = setInterval(() => {
    if (typingElement.textContent.length > 0) {
      typingElement.textContent = typingElement.textContent.slice(0, -1);
    } else {
      clearInterval(typingInterval);
      textIndex = (textIndex + 1) % texts.length; // Move to the next text
      setTimeout(type, 500); // Wait for a moment before typing the next text
    }
  }, 50); // Adjust the erasing speed if needed
}

window.addEventListener("load", () => {
  $(window).on("load", function () {
    $("html, body").animate({ scrollTop: 0 });
    $(".loader").fadeOut(1000);
    $(".content").fadeIn(1000);
    setTimeout(type, 1000);
  });
});

const scrollElements = document.querySelectorAll(".js-scroll");

const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};

const elementOutofView = (el) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop > (window.innerHeight || document.documentElement.clientHeight)
  );
};

const displayScrollElement = (element) => {
  element.classList.add("scrolled");
};

const hideScrollElement = (element) => {
  element.classList.remove("scrolled");
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } else if (elementOutofView(el)) {
      hideScrollElement(el);
    }
  });
};

window.addEventListener("scroll", () => {
  handleScrollAnimation();
});
