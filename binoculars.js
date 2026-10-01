(function () {
  var intro = document.getElementById('binocularsIntro');
  if (!intro) return;
  var overlay = document.getElementById('binocularsOverlay');
  var photoBase = document.getElementById('binocularsPhotoBase');
  var photoReveal = document.getElementById('binocularsPhotoReveal');
  var binocularsText = document.getElementById('binocularsText');
  var desertHeroHeadlineWrap = document.getElementById('desertHeroHeadlineWrap');
  var desertHeroHeadline = document.getElementById('desertHeroHeadline');
  var desertHeroBioWrap = document.getElementById('desertHeroBioWrap');
  var BIO_LINE_COUNT = 4;
  var desertHeroBioLines = [];
  for (var li = 1; li <= BIO_LINE_COUNT; li++) {
    desertHeroBioLines.push(document.querySelectorAll('[data-bio-line="' + li + '"]'));
  }
  var siteNav = document.querySelector('.site-nav');
  var projectsWrap = document.querySelector('.projects-wrap');
  var filters = document.getElementById('filters');
  if (!overlay) return;

  var pinned = true;
  var offset, baseRadius, maxRadius, cy;

  // All milestones are in multiples of the viewport height (vh), measured as scroll distance
  // *into* the intro section (i.e. how far scrolled since the intro's own top hit the page top).
  var HOLES_END = 1.4;      // 0 -> 1.4vh: binocular holes grow to cover the whole screen (slower, more
  var ZOOM_END = 1.4;       // deliberate scroll than before, so the zoom actually reads instead of flashing by)
  var CROSSFADE_END = 1.4;  // 0 -> 1.4vh: crossfade to dessert.png, starting immediately (overlaps with
  // the WAY TO HEAVEN text fading out) so the photo is already fully dessert.png, at normal size,
  // by the time the holes finish opening.
  var BASE_ZOOM_AMOUNT = 0.45;   // Desert.png: pulses up then settles back down to normal size
  var REVEAL_ZOOM_AMOUNT = 1.1;  // dessert.png: starts already zoomed in, then shrinks down to normal
  var HEADLINE_START = 1.9; // 1.4 -> 1.9vh: extra hold after the photo settles, before any text appears
  var HEADLINE_END = 2.6;   // 1.9 -> 2.6vh: "Art Director..." headline "writes" itself on (slower)
  var BIO_START = 2.6;       // 2.6vh onward: only once the headline is in does the bio start "writing" in,
  var BIO_LINE_DURATION = 0.5; // one line at a time (not the whole paragraph at once), 0.5vh per line
  var BIO_END = BIO_START + BIO_LINE_DURATION * 4; // 2.6 -> 4.6vh (4 lines)
  // 4.6 -> 5.6vh: hold, nothing changes (a real pause after "Scroll down..." appears)
  var TEXT_FADEOUT_START = 5.6; // 5.6 -> 6.1vh: headline + bio fade out completely, before the
  var TEXT_FADEOUT_END = 6.1;   // photo itself ever starts moving
  // 6.1 -> 6.3vh: hold, nothing changes (text is fully gone, photo is still)
  // The photo's own sticky-stage naturally slides up and away over exactly the next 1vh of scroll
  // (that 1vh is fixed by how CSS sticky works, not a tunable constant). The nav/grid crossfade
  // runs across that exact same 1vh.
  var NAV_FADE_START = 6.3; // = TOTAL_VH - 1, i.e. the moment the photo starts sliding away
  var TOTAL_VH = 7.3;       // must match .binoculars-intro's CSS height (730vh)
  var NAV_FADE_END = TOTAL_VH; // = the moment the photo finishes sliding away and hands off to normal scroll

  function measure() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    offset = w <= 720 ? w * 0.11 : 110;
    baseRadius = w <= 720 ? 110 : 150;
    cy = h / 2;
    // large enough that the two circles fully cover the screen by the end of phase 1
    maxRadius = Math.sqrt(w * w + h * h);
  }

  function holeGradient(cx, r) {
    return 'radial-gradient(circle at ' + cx + 'px ' + cy + 'px, transparent 0px, transparent ' + r + 'px, #000 ' + (r + 1) + 'px)';
  }

  function clamp01(n) {
    return Math.max(0, Math.min(1, n));
  }

  function update() {
    var h = window.innerHeight;
    var rect = intro.getBoundingClientRect();
    var scrolledIn = -rect.top; // px scrolled since the intro's top reached the page top
    var scrolledVh = scrolledIn / h; // same, expressed in viewport-heights
    var w = window.innerWidth;

    // Phase 1: holes grow (overlapping from the start) until they swallow all the black
    var p1 = clamp01(scrolledVh / HOLES_END);
    var r = baseRadius + p1 * (maxRadius - baseRadius);
    var cxLeft = w / 2 - offset;
    var cxRight = w / 2 + offset;
    var maskValue = holeGradient(cxLeft, r) + ', ' + holeGradient(cxRight, r);
    overlay.style.maskImage = maskValue;
    overlay.style.webkitMaskImage = maskValue;
    if (binocularsText) {
      var textFadeP = clamp01(scrolledVh / (HOLES_END * 0.85));
      binocularsText.style.opacity = String(1 - textFadeP);
      binocularsText.style.transform = 'translate(-50%, -50%) scale(' + (1 + textFadeP * 0.6) + ')';
    }

    // Desert.png pulses up then settles back down to normal size by ZOOM_END
    var zoomP = clamp01(scrolledVh / ZOOM_END);
    var baseScale = 1 + BASE_ZOOM_AMOUNT * Math.sin(zoomP * Math.PI);
    if (photoBase) photoBase.style.transform = 'scale(' + baseScale + ')';

    // dessert.png starts already zoomed in (not zooming up from normal) and shrinks down to
    // normal size as it crossfades in, settling by ZOOM_END
    var revealScale = 1 + REVEAL_ZOOM_AMOUNT * (1 - zoomP);
    if (photoReveal) photoReveal.style.transform = 'scale(' + revealScale + ')';

    // Crossfade to dessert.png starts immediately (overlapping the WAY TO HEAVEN text fade-out)
    var p2 = clamp01(scrolledVh / CROSSFADE_END);
    if (photoReveal) {
      photoReveal.style.opacity = String(p2);
    }

    // Nav + the grid page (including the filter tabs) crossfade in, pinned in place over the
    // binoculars stage (never sliding up from below), then hand off to normal scrolling exactly
    // as the intro ends.
    var p3 = clamp01((scrolledVh - NAV_FADE_START) / (NAV_FADE_END - NAV_FADE_START));
    if (siteNav) siteNav.style.opacity = String(p3);
    if (projectsWrap) projectsWrap.style.opacity = String(p3);
    if (filters) filters.style.opacity = String(p3);

    // Headline + bio fade out completely once the photo settles and the reading pause ends,
    // finishing well before the photo itself starts sliding away
    var pTextOut = clamp01((scrolledVh - TEXT_FADEOUT_START) / (TEXT_FADEOUT_END - TEXT_FADEOUT_START));

    // "Art Director..." headline "writes" itself on, left to right, once the photo has settled,
    // then fades back out
    var pHeadlineIn = clamp01((scrolledVh - HEADLINE_START) / (HEADLINE_END - HEADLINE_START));
    var pHeadline = pHeadlineIn * (1 - pTextOut);
    if (desertHeroHeadlineWrap) desertHeroHeadlineWrap.style.opacity = pHeadline > 0 ? String(pHeadline) : '0';
    if (desertHeroHeadline) desertHeroHeadline.style.clipPath = 'inset(0 ' + (100 - pHeadlineIn * 100) + '% 0 0)';

    // Bio lines "write" themselves on one at a time, left to right, after the headline appears,
    // then fade back out together with the headline
    var pBioAny = clamp01((scrolledVh - BIO_START) / (BIO_END - BIO_START)) * (1 - pTextOut);
    if (desertHeroBioWrap) {
      desertHeroBioWrap.style.opacity = pBioAny > 0 ? String(pBioAny) : '0';
      desertHeroBioWrap.style.pointerEvents = pBioAny > 0.5 ? 'auto' : 'none';
    }
    for (var li = 0; li < desertHeroBioLines.length; li++) {
      var lineStart = BIO_START + li * BIO_LINE_DURATION;
      var pLine = clamp01((scrolledVh - lineStart) / BIO_LINE_DURATION);
      var lineClip = 'inset(0 ' + (100 - pLine * 100) + '% 0 0)';
      var lineEls = desertHeroBioLines[li];
      for (var j = 0; j < lineEls.length; j++) {
        lineEls[j].style.clipPath = lineClip;
      }
    }

    var shouldPin = scrolledVh < TOTAL_VH;
    if (shouldPin !== pinned) {
      pinned = shouldPin;
      if (siteNav) siteNav.classList.toggle('is-pinned-preview', pinned);
      if (projectsWrap) projectsWrap.classList.toggle('is-pinned-preview', pinned);
    }
  }

  function handleResize() {
    measure();
    update();
  }

  measure();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', handleResize);
  update();
})();
