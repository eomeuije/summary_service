
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function navigateTo(page) {
    if (window.location.pathname.includes(page)) return;
    if (page === 'main') {
        window.location.href = '/';
    } else if (page === 'summary') {
        window.location.href = '/summary-page';
    } else if (page === 'doc') {
        window.location.href = '/doc-upload';
    } else if (page === 'voice') {
        window.location.href = '/voice-upload';
    }
}

function logout() {
    fetch('/logout', { method: 'POST' })
        .then(() => {
            window.location.href = '/';
        })
        .catch(err => {
            console.error(err);
            alert('로그아웃에 실패했습니다.');
        });
}