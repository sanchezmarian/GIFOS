'use strict';
//Creamos nuestras variables.
let resultadoFinal = document.getElementById('resultadoFinal');
let resultadoBusqueda = document.getElementById('resultadoGifos');
let searchInput = document.getElementById('search');
let searchCont = document.getElementById('search-cont');
let offSet = 0;
let contBusqueda = document.getElementById('busqueda');
let lupaVioleta = document.getElementById('lupa-violeta');
let cerrar = document.getElementById('cerrar');
let lupaGris = document.getElementById('lupa-gris');
let ctnSugerencias = document.getElementById('contAllSugerencias')
let sugerencia = document.getElementById('sugerenciaCtn');
let buscadorSugerencia = document.getElementById('buscadorSugerencia');
let hrInput = document.getElementById('hrInput');
let tituloBusqueda = document.getElementById('titulo-busqueda');
let verMasBtn = document.getElementById('verMas');
let gifosCont = document.getElementById('gifos');
let ctnLimpiarGifs = document.getElementById("limpiar-gifs");
searchInput.addEventListener('keyup', buscador);
searchInput.addEventListener('input', mostrarLupaX);
searchInput.addEventListener('click', mostrarLupaX);
cerrar.addEventListener('click', limpiarInput);
lupaGris.addEventListener('click', buscador);
verMasBtn.addEventListener('click', verMas);


function limpiarInput() {
    searchInput.value = "";
    lupaGris.style.display = 'none';
    cerrar.style.display = 'none';
    lupaVioleta.style.display = 'initial';
    hrInput.style.display = 'none';
    buscadorSugerencia.innerHTML = '';
}
function limpiarSugerencias() {
    lupaGris.style.display = 'none';
    cerrar.style.display = 'none';
    lupaVioleta.style.display = 'initial';
    hrInput.style.display = 'none';
    buscadorSugerencia.innerHTML = '';
}
function mostrarLupaX() {
    lupaVioleta.style.display = 'none';
    cerrar.style.display = 'initial';
    lupaGris.style.display = 'initial';
}
function buscador(e) {
    e.preventDefault();
    let busqueda = searchInput.value;
    offSet = 0;
    if (busqueda.length >= 1) {
        fetch(`https://api.giphy.com/v1/tags/related/${busqueda}?=&api_key=${apiKey}&lang=es`)
            .then(response => response.json())
            .then(request => sugerenciasData(request))
            .catch(error => console.error("Fallo: ", error));
    } else if (busqueda == "" || busqueda == null) {
        verMasBtn.style.display = 'none';
        limpiarInput();
    }
}
function buscadorTrends(e) {
    searchInput.value = e;
    offSet = 0;
    mostrar();
}
function onKeyUp(event) {
    event.preventDefault();
    const keycode = event.keyCode;
    offSet = 0;
    if (keycode == '13') {
        if (searchInput.value === "" || searchInput.value === null) {
            verMasBtn.style.display = 'none';
            limpiarSugerencias();
        } else {
            mostrar();
        }
    }
}
function sugerenciasData(objeto) {
    let sugerencia = objeto.data;
    buscadorSugerencia.innerHTML = "";
    for (let i = 0; i < sugerencia.length; i++) {
        traerSugerencias(sugerencia[i].name);
    }
}
function traerSugerencias(sug) {
    try {
        hrInput.style.display = 'initial';
        let div = document.createElement('div');
        let p = document.createElement('p');
        let image = document.createElement('img');
        div.className = 'sugerenciaCtn';
        image.setAttribute('src', '/images/icon-search-active.svg');
        p.textContent = sug;
        div.appendChild(image);
        div.appendChild(p);
        buscadorSugerencia.appendChild(div);
        div.addEventListener('mouseup', () => {
            searchInput.value = sug;
            offSet = 0;
            mostrar();
        });
    } catch (error) {
        console.log('FALLO, ', error);
    }
}
function mostrar() {
    buscadorSugerencia.innerHTML = '';
    let urlBusqueda = (`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&limit=12&offset=${offSet}&rating=g&lang=es&q=`);
    let strBusqueda = searchInput.value.trim();
    urlBusqueda = urlBusqueda.concat(strBusqueda);
    fetch(urlBusqueda)
        .then(response => response.json())
        .then(content => {
            console.log("OffSet: " + offSet);
            if (offSet === 0) {
                verMasBtn.style.display = 'initial';
                resultadoBusqueda.innerHTML = '';
                let contFinal = document.getElementById('resultadoGifos');
                tituloBusqueda.style.display = 'initial';
                tituloBusqueda.textContent = searchInput.value;
                contFinal.appendChild(tituloBusqueda);
            }
            let obj = content.data;
            if (obj == 0 || obj == "" || obj == null || obj == undefined) {
                verMasBtn.style.display = 'none';
                ctnLimpiarGifs.innerHTML = `<img src="/images/icon-busqueda-sin-resultado.svg"><p class="unlucky">Intenta con otra búsqueda</p>`
            } else {
                for (let i = 0; i < obj.length; i++) {
                    traerGifs(obj[i]);
                }
            }
            limpiarSugerencias();
        }).catch(error => console.error("Fallo:", error));
}
function traerGifs(object) {
    console.log(object);
    resultadoBusqueda.innerHTML += `
    <div class="gif" onclick="expandGifMobile('${object.images.downsized.url}','${object.id}','${object.username}','${object.title}')">
    <img class="imgGif" src="${object.images.downsized.url}" id="gif-id-${object.id}" alt="${object.title}">
    <div class="filter"></div>
    <div class="btnGifs">
    <button class="ctnBtn favorite" onclick="addLocalStorage('${object.id}')"><i id="btnFavorite-${object.id}" class="far fa-heart"></i></button>
    <button class="ctnBtn download" onclick="activeDownload('${object.images.downsized.url}', '${object.title}')"><i class="fas fa-download" id="btnDownload"></i></button>
    <button class="ctnBtn expand" onclick="expandGifDesktop('${object.images.downsized.url}','${object.id}','${object.username}','${object.title}')"><i class="fas fa-expand-alt" id="btnExpand"></i></button>
    </div>
    <div class="namesGifs"><span class="userName">${object.username}</span><h5 class="titleGif">${object.title}</h5></div></div>`
}
function verMas() {
    offSet += 12;
    mostrar();
}