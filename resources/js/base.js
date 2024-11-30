
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
    fetch('/sign/logout', { method: 'POST' })
        .then(() => {
            window.location.href = '/';
        })
        .catch(err => {
            console.error(err);
            alert('로그아웃에 실패했습니다.');
        });
}

function voiceNotLogginAlert() {
    var userResponse = confirm("결제가 필요한 서비스입니다. 로그인 하시겠습니까?");

    if (userResponse) {
        window.location.href = '/sign/in';
    }
}
function voiceNotMemberAlert() {
    alert('결제가 필요한 서비스입니다.\neuije6795@gmail.com으로 문의해 주세요.');
}