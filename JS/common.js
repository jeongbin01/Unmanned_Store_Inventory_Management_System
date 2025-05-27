// common.js
// ————————————————
// 사이드바 토글 & 내비게이션 active 처리

document.addEventListener('DOMContentLoaded', () => {
  // 사이드바 토글 클릭 시 내비게이션 토글 총변경
  btn?.addEventListener('click', () => {
    sidebar.classList.toggle('show');
  });

  // 내비게이션 링크 클릭 시 active 클래스 토글
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});
