export function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const main = document.querySelector('.main');
  sidebar.classList.toggle('collapsed');
  main.classList.toggle('expanded');
}

export function openModal(id) {
  const modal = document.getElementById(id);
  modal?.classList.add('open');
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  modal?.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-modal-open');
      openModal(target);
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-modal-close');
      closeModal(target);
    });
  });
});
