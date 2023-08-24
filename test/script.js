// script.js
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
  }, 100); // Adjust the typing speed by changing the interval (e.g., 50 for faster typing).
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

// Start the typing effect when the page loads
window.addEventListener("load", () => {
  type();
});
