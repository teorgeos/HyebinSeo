document.querySelectorAll('.feature-swap').forEach(function (swap) {
  var thumbs = swap.querySelectorAll('.feature-thumb');
  if (!thumbs.length) return;

  var ba = swap.querySelector('.before-after');
  var videoMain = swap.querySelector('.feature-main video');

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');

      if (ba && thumb.dataset.before && thumb.dataset.after) {
        var beforeImg = ba.querySelector('.ba-before img');
        var afterImg = ba.querySelector('.ba-after img');
        if (beforeImg) beforeImg.src = thumb.dataset.before;
        if (afterImg) afterImg.src = thumb.dataset.after;
        var range = ba.querySelector('.ba-range');
        if (range) {
          range.value = 50;
          range.dispatchEvent(new Event('input'));
        }
      }

      if (videoMain && thumb.dataset.video) {
        videoMain.src = thumb.dataset.video;
        videoMain.load();
        videoMain.play();
      }
    });
  });
});
