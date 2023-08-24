document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

const texts = ["I'm Rifzkhy", "I'm Programmer", "I'm Designer"];

const typingElements = document.querySelectorAll(".typing");

function type(element, text) {
  let i = 0;

  const typingInterval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);
      setTimeout(() => erase(element), 1000);
    }
  }, 200);
}

function erase(element) {
  const text = element.textContent;

  const typingInterval = setInterval(() => {
    if (element.textContent.length > 0) {
      element.textContent = element.textContent.slice(0, -1);
    } else {
      clearInterval(typingInterval);
      setTimeout(() => {
        textIndex = (textIndex + 1) % texts.length;
        type(element, texts[textIndex]);
      }, 500);
    }
  }, 50);
}

function checkInView() {
  typingElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      // Element is in view, start typing effect
      if (element.textContent === "") {
        textIndex = (textIndex + 1) % texts.length;
        type(element, texts[textIndex]);
      }
    } else {
      // Element is out of view, reset effect
      element.textContent = "";
    }
  });
}

// Check if elements are in view when the page loads
checkInView();

// Check if elements are in view when the user scrolls
window.addEventListener("scroll", checkInView);

//! Scroll effect
const scrollElements = document.querySelectorAll(".js-scroll");

function elementInView(el, dividend = 1) {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
}

function elementOutofView(el) {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop > (window.innerHeight || document.documentElement.clientHeight)
  );
}

function displayScrollElement(element) {
  element.classList.add("scrolled");
}

function hideScrollElement(element) {
  element.classList.remove("scrolled");
}

function handleScrollAnimation() {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } else if (elementOutofView(el)) {
      hideScrollElement(el);
    }
  });
}

// Check if elements are in view when the page loads
handleScrollAnimation();

// Check if elements are in view when the user scrolls
window.addEventListener("scroll", handleScrollAnimation);

//! Writing effect
const elements = document.querySelectorAll(".write");

function type(element) {
  const text = element.textContent;
  element.textContent = "";

  let i = 0;

  function typeCharacter() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typeCharacter, 200);
    }
  }

  function checkInView() {
    const rect = element.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      // Element is in view, start typing effect
      typeCharacter();
    }
  }

  // Check if element is in view when the page loads
  checkInView();

  // Check if element is in view when the user scrolls
  window.addEventListener("scroll", checkInView);
}

elements.forEach(type);
