document.addEventListener('DOMContentLoaded', function () {
  var btns = document.querySelectorAll('.lang-toggle button');
  function update() {
    var cur = document.documentElement.getAttribute('data-lang') || 'ko';
    btns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === cur);
    });
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      document.documentElement.setAttribute('data-lang', lang);
      localStorage.setItem('lang', lang);
      update();
    });
  });
  update();
});
