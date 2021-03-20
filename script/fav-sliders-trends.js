'use strict';

const apiKey = "AJ1WyhjI14o15atjhc2DsRdtOvJHm6aV";
const trendsCont = document.getElementById("trends");
const trendingCont = document.getElementById('carrusel');
const contCarrusel = document.getElementById('contCarrusel');
const prevBtn = document.getElementById('slider-left');
const nextBtn = document.getElementById('slider-right');
const prevBtn1 = document.getElementById('slider-left-hover');
const nextBtn1 = document.getElementById('slider-right-hover');
const downloadBtn = document.getElementById('btnDownload');
const expandBtn = document.getElementById('btnExpand');
const ctnFavoritos = document.getElementById('ctnFavoritos');
const noFavorites = document.getElementById('no-favorites');
const favorite = document.getElementById('favoritos');
let modalCtn = document.createElement("div");

traerTrendingGifos();
nextBtn.addEventListener('click', () => {
    contCarrusel.scrollLeft += 400;
});
prevBtn.addEventListener('click', () => {
    contCarrusel.scrollLeft -= 400;
});
nextBtn1.addEventListener('click', () => {
    contCarrusel.scrollLeft += 400;
});
prevBtn1.addEventListener('click', () => {
    contCarrusel.scrollLeft -= 400;
});
if (window.location.pathname == '/index.html') {
    traerTrending();
}
if (window.location.pathname == '/favoritos.html') {
    let ids = new Array();
    ids = localStorage.getItem("IDs");
    if (ids === null || ids.length <= 0) {
        ctnFavoritos.innerHTML = `<div class="no-cont" id="no-favorites">
        <img src="images/icon-fav-sin-contenido.svg" alt="no-favorites">
        <p class="unlucky">"¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!"</p>
    </div>`
    } else if (ids.length > 1) {
        ids = localStorage.getItem("IDs").split(",");
        ctnFavoritos.innerHTML = '';
        ids.forEach(e => {
            traerFavoritos(e);
        });
        console.log(ids.length);
    } else if (ids.length === 1) {
        ids = localStorage.getItem("IDs");
        ctnFavoritos.innerHTML = '';
        ids.forEach(e => {
            traerFavoritos(e);
        });
        console.log(ids.length);
    }
}
favorite && favorite.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = `favoritos.html#${e.path[0].id}`;
});
function addLocalStorage(id) {
    let favoriteBtn = document.getElementById('btnFavorite-' + id);
    try {
        if (favoriteBtn.className != "fas fa-heart") {
            favoriteBtn.className = "fas fa-heart";
        } else {
            favoriteBtn.className = "far fa-heart";
        }
        if (
            localStorage.getItem("IDs") < 1
        ) {
            favoriteBtn.className = "fas fa-heart";
            localStorage.setItem("IDs", id);
            if (window.location.hash[0] == '#' && window.location.hash.slice(1) == "favoritos") {
                noFavorites.style.display = "initial";
            }
        } else if (
            localStorage.getItem("IDs") === null ||
            localStorage.getItem("IDs") === undefined ||
            localStorage.getItem("IDs") === ""
        ) {
            favoriteBtn.className = "fas fa-heart";
            if (window.location.hash[0] == '#' && window.location.hash.slice(1) == "favoritos") {
                noFavorites.style.display = "initial";
            }
        } else {
            if (window.location.hash[0] == '#' && window.location.hash.slice(1) == "favoritos") {
                noFavorites.style.display = "none";
            }
            let ids = new Array();
            ids = localStorage.getItem("IDs").split(",");
            if (ids.includes(id)) {
                let deleteId = ids.findIndex((e) => e === id);
                ids.splice(deleteId, 1);
                ids = ids.join(",");
                localStorage.setItem("IDs", ids);
                favoriteBtn.className = "far fa-heart";
            } else {
                ids.push(id);
                ids = ids.join(",");
                localStorage.setItem("IDs", ids);
                favoriteBtn.className = "fas fa-heart";
            }
        }
        ids = localStorage.getItem("IDs").split(",");
    } catch (error) {
        console.log("Ops! " + error);
    }
}
function ejecutaFavoritos() {
 // ctnFavoritos.innerHTML = '';
    let allId = JSON.parse(localStorage.getItem('IDs'));
    allId.forEach(e => {
        console.log(e);
    });
}
async function traerFavoritos(id) {
    try {
        let request = await (fetch(`https://api.giphy.com/v1/gifs/${id}?api_key=${apiKey}`));
        let response = await request.json();
        mostrarFavoritos(response.data);

    } catch (error) {
        console.error(error);
    }

}
function mostrarFavoritos(object) {
    ctnFavoritos.innerHTML += `
    <div class="gif" onclick="expandGifMobile('${object.images.downsized.url}','${object.id}','${object.username}','${object.title}')">
    <img class="imgGif" src="${object.images.downsized.url}" id="gif-id-${object.id}" alt="${object.title}">
    <div class="filter"></div>
    <div class="btnGifs">
    <button class="ctnBtn favorite" onclick="addLocalStorage('${object.id}')"><i id="btnFavorite-${object.id}" class="far fa-heart"></i></button>
    <button class="ctnBtn download" onclick="activeDownload('${object.images.downsized.url}', '${object.title}')"><i class="fas fa-download" id="btnDownload"></i></button>
    <button class="ctnBtn expand" onclick="expandGifDesktop('${object.images.downsized.url}','${object.id}','${object.username}','${object.title}')"><i class="fas fa-expand-alt" id="btnExpand"></i></button>
    </div>
    <div class="namesGifs"><span class="userName">${object.username}</span><h5 class="titleGif">${object.title}</h5></div></div>`

};
async function traerTrending() {
    try {
        let request = await (fetch(`https://api.giphy.com/v1/trending/searches?&api_key=${apiKey}`));
        let response = await request.json();
        let data = response.data;
    // Trends(data[0]);
        trendsCont.innerHTML += `
        <span class="trendText">${data[0]}</span>, <span class="trendText">${data[1]}</span>, <span class="trendText">${data[2]}</span>, <span class="trendText">${data[3]}</span>, <span class="trendText">${data[4]}</span>
        `
        let allTopics = document.getElementsByClassName("trendText");
        for (let i = 0; i < allTopics.length; i++) {
            allTopics[i].addEventListener("click", () => {
                buscadorTrends(data[i]);
            });
        }
    } catch (error) {
        console.log("Error:", error);
    }
}
async function traerTrendingGifos() {
    try {
        let request = await (fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=16&rating=g`));
        let response = await request.json();
        mostrarTrendingGifos.innerHTML = '';
        for (let i = 0; i < response.data.length; i++) {
            mostrarTrendingGifos(response.data[i]);
        }
    } catch (error) {
        console.log("Error:", error);
    }

}
async function activeDownload(url, name) {
//create new a element
    let a = document.createElement('a');
// get image as blob
    let response = await fetch(url);
    let file = await response.blob();
    a.download = name;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
};
function cerrarModalCtn() {
    modalCtn.style.display = "none";
}
function expandGifDesktop(image, id, userName, title) {
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
                <button class="button-download-favorite" onclick="addLocalStorage('${id}')"><i id="btnFavorite-${id}" class="far fa-heart"></i></button>
                <button class="button-download-favorite" onclick="activeDownload('${image}', '${title}')"><i class="fas fa-download" id="btnDownload"></i></button>
            </div>
        </div>
        `
        modalCtn.classList.add("expandActive");
        document.body.appendChild(modalCtn);
    }
}
function expandGifMobile(image, id, userName, title) {
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
                <button class="button-download-favorite" onclick="addLocalStorage('${id}', '${image}', '${title}', '${userName}')"><i id="btnFavorite-${id}" class="far fa-heart"></i></button>
                <button class="button-download-favorite" onclick="activeDownload('${image}', '${title}')"><i class="fas fa-download" id="btnDownload"></i></button>
            </div>
        </div>
        `
        modalCtn.classList.add("expandActive");
        document.body.appendChild(modalCtn);
    }
}
function mostrarTrendingGifos(object) {
    trendingCont.innerHTML += `
    <div class="gif" onclick="expandGifMobile('${object.images.downsized.url}','${object.id}','${object.username}','${object.title}')">
    <img class="imgGif" src="${object.images.downsized.url}" id="gif-id-${object.id}" alt="${object.title}">
    <div class="filter"></div>
    <div class="btnGifs">
    <button class="ctnBtn favorite" onclick="addLocalStorage('${object.id}')"><i id="btnFavorite-${object.id}" class="far fa-heart"></i></button>
    <button class="ctnBtn download" onclick="activeDownload('${object.images.downsized.url}', '${object.title}')"><i class="fas fa-download" id="btnDownload"></i></button>
    <button class="ctnBtn expand" onclick="expandGifDesktop('${object.images.downsized.url}','${object.id}','${object.username}','${object.title}')"><i class="fas fa-expand-alt" id="btnExpand"></i></button>
    </div>
    <div class="namesGifs"><span class="userName">${object.username}</span><h5 class="titleGif">${object.title}</h5></div></div>`
};