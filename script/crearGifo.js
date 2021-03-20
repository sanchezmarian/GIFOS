'use strict';

const apiKey = "AJ1WyhjI14o15atjhc2DsRdtOvJHm6aV";
const b = document.getElementById('crearGifo');
const video = document.getElementById('video');
const start = document.getElementById('start');
const record = document.getElementById('record');
const finish = document.getElementById('finish');
const upload = document.getElementById('upload');
const accessCtn = document.createElement("div");
const videoCtn = document.getElementById("videoCtn");
const introVideo = document.getElementById("introVideo");
const crearGifoArticle = document.getElementById('crearGifoArticle');
const s1 = document.getElementById('step-1');
const s2 = document.getElementById('step-2');
const s3 = document.getElementById('step-3');
start.addEventListener('click', step1);
record.addEventListener('click', step3);
finish.addEventListener('click', step4);
upload.addEventListener('click', step5);
let counter = document.getElementById("counter");
let recorder;
let gif;
let timer = 0;
let c = 0;
let stop = false;
let timerSet = 0;
let gifBlob = null;
let loadingModal = document.createElement('div');
function step1() {
    accessCtn.innerHTML = `<h1>¿Nos das acceso <br> a tu cámara?</h1><p> El acceso a tu camara será válido sólo <br> por el tiempo en el que estés creando el GIFO. </p>`;
    accessCtn.className = "accessCtn";
    crearGifoArticle.appendChild(accessCtn);
    introVideo.style.display = "none";
    start.style.display = "none";
    record.style.display = "initial";
    s1.style.backgroundColor = "#572EE5";
    s1.style.color = "#ffffff";
    video.style.display = "initial";
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    navigator.getUserMedia({
            video: true,
            audio: false
        },
// successCallback
        function(localMediaStream) {
            video.srcObject = localMediaStream;
            step2();
        },
// errorCallback
        function(err) {
            alert("Se necesitan permisos para utilizar la cámara");
            console.log("Ops! " + err);
        });
    console.log(timer);
}
function step2() {
    record.style.display = "initial";
    s1.style.backgroundColor = "#ffffff";
    s1.style.color = "#572EE5";
    s2.style.backgroundColor = "#572EE5";
    s2.style.color = "#ffffff";
    accessCtn.innerHTML = "";
    accessCtn.style.display = "none";
}
function step3() {
    s2.style.backgroundColor = "#ffffff";
    s2.style.color = "#572EE5";
    s3.style.backgroundColor = "#572EE5";
    s3.style.color = "#ffffff";
    finish.style.display = "initial";
    record.style.display = "none";
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(async function(stream) {
        recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 460,
            hidden: 380,
            onGifRecordingStarted: function() {
                console.log('started');
            }
        });
        recorder.startRecording();
        stop = false;
        timerSet = setInterval(setTimer, 1000);
    });
}
function step4() {
    recorder.stopRecording(onStop);
    counter.addEventListener('click', cleanAll);
    counter.innerText = "REPETIR CAPTURA";
    counter.style.fontSize = "16px";
    counter.style.width = "160px";
    counter.style.left = "490px";
    upload.style.display = "initial";
    finish.style.display = "none";
}
async function step5() {
    loadingModal.innerHTML = `<div id="loadingModal" class="loadingModal">
<img src="images/loader.svg" alt="loader" class="loader" id="loader">
<p class="white-p">Estamos subiendo tu GIFO</p></div>`;
    videoCtn.appendChild(loadingModal);
    upload.style.display = "none";
    counter.textContent = "";
    gif = recorder.getBlob();
    gifBlob = gif;
    let form = new FormData();
    form.append('file', gif, 'newGif.gif');
    let resp = await fetch(`https://upload.giphy.com/v1/gifs?=${form}&api_key=${apiKey}`, {
        method: 'POST',
        body: form,
        json: true
    });
    let data = await resp.json();
    console.log(resp);
    let myGifosArray = new Array;
    myGifosArray = localStorage.getItem("myGifos");
    if (myGifosArray === null) {
        myGifosArray = [];
        console.log("aqui: " + myGifosArray);
    } else if (myGifosArray !== null) {
        myGifosArray = localStorage.getItem("myGifos").split(",");
    }
    myGifosArray.push(data.data.id);
    localStorage.setItem('myGifos', myGifosArray);
    loadingModal.innerHTML = `<div id="loadingModal" class="loadingModal">
    <img src="images/ok.svg" alt="loader" class="loader" id="loader">
    <p class="white-p">GIFO subido con éxito</p></div>`;
    setTimeout(() => {
        cleanAll();
    }, 3000);
}
function onStop() {
    stop = true;
}
function setTimer() {
    if (stop == true) {
        clearInterval(timerSet);
        c = 0;
    } else {
        let timeValue = new Date(c * 1000).toISOString().substr(11, 8);
        counter.textContent = timeValue;
        c++;
    }
};
function cleanAll() {
    s3.style.backgroundColor = "#ffffff";
    s3.style.color = "#572EE5";
    upload.style.display = "none";
    finish.style.display = "none";
    start.style.display = "initial";
    loadingModal.innerHTML = "";
    introVideo.style.display = 'initial';
    video.style.display = "none";
    counter.innerText = "";
    counter.style.left = "540px";
    counter.style.fontSize = "1rem";
    counter.style.width = "110px";
    videoCtn.removeChild(loadingModal);
}