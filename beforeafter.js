document.querySelectorAll('.before-after').forEach(function (el) {
  var before = el.querySelector('.ba-before');
  var handle = el.querySelector('.ba-handle');
  var range = el.querySelector('.ba-range');
  if (!before || !handle || !range) return;

  function update(val) {
    before.style.clipPath = 'inset(0 ' + (100 - val) + '% 0 0)';
    handle.style.left = val + '%';
  }

  update(range.value);
  range.addEventListener('input', function () {
    update(range.value);
  });
});
