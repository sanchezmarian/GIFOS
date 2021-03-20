'use strict';

const ctnGifos = document.getElementById('ctnGifos');
let idsMisGifos = new Array();
// idsMisGifos = JSON.parse(localStorage.getItem("myGifos"));
idsMisGifos = localStorage.getItem("myGifos");
console.log(idsMisGifos);
if (idsMisGifos === null || idsMisGifos === "" || idsMisGifos < 1) {
    ctnGifos.innerHTML = `<div class="no-cont" id="no-gifos">
    <img src="images/icon-mis-gifos-sin-contenido.svg" alt="no-gifos">
    <p class="unlucky">¡Anímate a crear tu propio GIFO!</p>
</div>`
} else if (idsMisGifos.length > 0) {
    idsMisGifos = localStorage.getItem("myGifos").split(",");
    ctnGifos.innerHTML = '';
    idsMisGifos.forEach(e => {
        traerMisGifos(e);
    });
} else {
    ctnGifos.innerHTML = `<div class="no-cont" id="no-gifos">
    <img src="images/icon-mis-gifos-sin-contenido.svg" alt="no-gifos">
    <p class="unlucky">¡Anímate a crear tu propio GIFO!</p>
</div>`
}
async function traerMisGifos(id) {
    try {
        let request = await (fetch(`https://api.giphy.com/v1/gifs/${id}?api_key=${apiKey}`));
        let response = await request.json();
        mostrarMisGifos(response.data);
    } catch (error) {
        console.error(error);
    }
}
function mostrarMisGifos(object) {
    ctnGifos.innerHTML += `
    <div class="gif" onclick="expandMisGifMobile('${object.images.downsized.url}','${object.id}','${object.username}','${object.title}')">
    <img class="imgGif" src="${object.images.downsized.url}" id="gif-id-${object.id}" alt="${object.title}">
    <div class="filter"></div>
    <div class="btnGifs">
    <button class="ctnBtn favorite" onclick="addLocalStorageMisGifos('${object.id}')"><i id="btnTrash-${object.id}" class="far fa-trash-alt"></i></button>
    <button class="ctnBtn download" onclick="activeDownload('${object.images.downsized.url}', '${object.title}')"><i class="fas fa-download" id="btnDownload"></i></button>
    <button class="ctnBtn expand" onclick="expandMisGifDesktop('${object.images.downsized.url}','${object.id}','${object.username}','${object.title}')"><i class="fas fa-expand-alt" id="btnExpand"></i></button>
    </div>
    <div class="namesGifs"><span class="userName">${object.username}</span><h5 class="titleGif">${object.title}</h5></div></div>`
};
function expandMisGifDesktop(image, id, userName, title) {
    if (window.matchMedia("(min-width: 1023px)").matches) {
        modalCtn.style.display = 'block';
        modalCtn.innerHTML = `
        <button class="modal-close" onclick="cerrarModalCtn()"><img src="./images/button-close.svg"></button>
        <img src="${image}" alt="${id}" class="modal-gif">
        <div class="ctn-expand-data">
            <div class="expand-data-text">
                <p class="text-user">${userName}</p>
                <p class="text-title">${title}</p>
            </div>
            <div class="expand-data-button">
                <button class="button-download-favorite" onclick="addLocalStorageMisGifos('${id}')"><i id="btnTrash-${id}" class="far fa-trash-alt"></i></button>
                <button class="button-download-favorite" onclick="activeDownload('${image}', '${title}')"><i class="fas fa-download" id="btnDownload"></i></button>
            </div>
        </div>
        `
        modalCtn.classList.add("expandActive");
        document.body.appendChild(modalCtn);
    }
}
function expandMisGifMobile(image, id, userName, title) {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        modalCtn.style.display = 'block';
        modalCtn.innerHTML = `
        <button class="modal-close" onclick="cerrarModalCtn()"><img src="./images/button-close.svg"></button>
        <img src="${image}" alt="${id}" class="modal-gif">
        <div class="ctn-expand-data">
            <div class="expand-data-text">
                <p class="text-user">${userName}</p>
                <p class="text-title">${title}</p>
            </div>
            <div class="expand-data-button">
                <button class="button-download-favorite" onclick="addLocalStorageMisGifos('${id}', '${image}', '${title}', '${userName}')"><i id="btnTrash-${id}" class="far fa-trash-alt"></i></button>
                <button class="button-download-favorite" onclick="activeDownload('${image}', '${title}')"><i class="fas fa-download" id="btnDownload"></i></button>
            </div>
        </div>
        `
        modalCtn.classList.add("expandActive");
        document.body.appendChild(modalCtn);
    }
}
function addLocalStorageMisGifos(id) {
    let trashBtn = document.getElementById('btnTrash-' + id);
    let ids = new Array();
    ids = localStorage.getItem("myGifos").split(",");
    if (ids.includes(id)) {
        let deleteId = ids.findIndex((e) => e === id);
        ids.splice(deleteId, 1);
        ids = ids.join(",");
        localStorage.setItem("myGifos", ids);
        trashBtn.className = "far fa-trash-alt";
    }
    window.location.pathname = '/misGifos.html';
}