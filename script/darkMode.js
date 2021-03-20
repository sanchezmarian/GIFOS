'use strict';

const switchBtn = document.querySelector('#switch');
const logo = document.getElementById('logo');

switchBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    logo.removeAttribute("src", "/images/logo-desktop.svg");
    logo.setAttribute("src", "/images/logo-desktop-modo-noc.svg");
    switchBtn.textContent = "Modo Diurno";
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('dark-mode', 'true');
    } else {
        logo.removeAttribute("src", "/images/logo-desktop-modo-noc.svg");
        logo.setAttribute("src", "/images/logo-desktop.svg");
        switchBtn.textContent = "Modo Nocturno";
        localStorage.setItem('dark-mode', 'false');
    }
});
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.toggle('dark');
    switchBtn.textContent = "Modo Diurno";
    logo.setAttribute("src", "/images/logo-desktop-modo-noc.svg");
} else {
    document.body.classList.remove('dark');
    logo.setAttribute("src", "/images/logo-desktop.svg");
    switchBtn.textContent = "Modo Nocturno";
}