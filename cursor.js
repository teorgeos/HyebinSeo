(function () {
  var customCursor = document.getElementById('customCursor');
  if (!customCursor) return;
  window.addEventListener('mousemove', function (e) {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      customCursor.style.width = '34px';
      customCursor.style.height = '34px';
    });
    el.addEventListener('mouseleave', function () {
      customCursor.style.width = '22px';
      customCursor.style.height = '22px';
    });
  });
})();
