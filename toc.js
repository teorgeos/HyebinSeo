(function () {
  var links = document.querySelectorAll('.toc a');
  if (!links.length) return;

  var sections = [];
  links.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) sections.push({ link: link, el: el });
  });

  function setActive(id) {
    links.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s.el); });
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  var toc = document.querySelector('.toc');
  if (toc) {
    var hideTimer;
    var showToc = function () {
      toc.classList.add('visible');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        toc.classList.remove('visible');
      }, 1200);
    };
    window.addEventListener('scroll', showToc, { passive: true });
  }
})();
