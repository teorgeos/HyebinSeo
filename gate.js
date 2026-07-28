document.addEventListener('DOMContentLoaded', function () {
  // 여기 비밀번호를 원하는 값으로 바꾸세요.
  var PASSWORD = 'portfolio2026';
  var STORAGE_KEY = 'portfolio_unlocked';

  if (localStorage.getItem(STORAGE_KEY) === 'yes') return;

  var overlay = document.createElement('div');
  overlay.className = 'gate-overlay';
  overlay.innerHTML =
    '<div class="gate-box">' +
      '<p class="gate-label">Password</p>' +
      '<input type="password" class="gate-input" id="gate-input" autofocus>' +
      '<button class="gate-btn" id="gate-btn">Enter</button>' +
      '<p class="gate-error" id="gate-error"></p>' +
    '</div>';
  document.documentElement.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  function tryUnlock() {
    var val = document.getElementById('gate-input').value;
    if (val === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'yes');
      overlay.remove();
      document.body.style.overflow = '';
    } else {
      document.getElementById('gate-error').textContent = '비밀번호가 올바르지 않습니다.';
    }
  }

  document.getElementById('gate-btn').addEventListener('click', tryUnlock);
  document.getElementById('gate-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tryUnlock();
  });
});
