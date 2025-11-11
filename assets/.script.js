for(let i = 1; i < 100; i++) {
    new TypeIt(`.typewrite${i}`, {
    speed: 10,
    waitUntilVisible: true,
}).go();
}
ScrollReveal().reveal(".appear", slideUp, {
      delay: 500,
      duration: 500,
    });