Reveal.initialize({
  loop: true,
  controls: true,
  autoSlide: 3000,
  keyboard: true,
  width: 960,
  height: 700,
  margin: 0.1,
  progress: false,
  dependencies: [
    { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
    { src: '/app/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: '/app/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } }
  ]
});
