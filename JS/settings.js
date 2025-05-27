// ───────── settings.js ─────────

document.addEventListener('DOMContentLoaded', () => {
    // 탭 전환
    document.querySelectorAll('#settingsTab .nav-link').forEach(tab => {
        tab.addEventListener('click', () => {
            // 네비게이션
            document.querySelectorAll('#settingsTab .nav-link').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 컨텐츠
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('d-none'));
            const pane = document.getElementById(tab.dataset.tab);
            pane.classList.remove('d-none');
            pane.classList.add('active');
        });
    });

    // 계정 저장
    document.getElementById('saveAccountBtn').addEventListener('click', () => {
        const cp = document.getElementById('currentPassword').value;
        const np = document.getElementById('newPassword').value;
        const cf = document.getElementById('confirmPassword').value;
        if (!cp || !np || cf !== np) {
            return alert('비밀번호를 올바르게 입력해주세요.');
        }
        alert('비밀번호가 변경되었습니다.');
    });

    // 스토어 저장
    document.getElementById('saveStoreBtn').addEventListener('click', () => {
        alert('매장 정보가 저장되었습니다.');
    });

    // 알림 저장
    document.getElementById('saveNotifyBtn').addEventListener('click', () => {
        alert('알림 설정이 저장되었습니다.');
    });
});