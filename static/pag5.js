let highestZ = 1;

// abrir janela
function openWindow(id){

const windowElement = document.getElementById(id);

windowElement.style.display = "block";

highestZ++;
windowElement.style.zIndex = highestZ;

}

// fechar janela
function closeWindow(button){

const windowElement = button.closest(".window");

windowElement.style.display = "none";

}

// minimizar
function minimize(button){

const windowElement = button.closest(".window");

const content = windowElement.querySelector(".content");

if(content.style.display === "none"){

content.style.display = "block";

}else{

content.style.display = "none";

}

}

// DRAG SYSTEM

const windows = document.querySelectorAll(".window");

windows.forEach(windowElement => {

const titleBar = windowElement.querySelector(".title-bar");

let offsetX = 0;
let offsetY = 0;
let isDragging = false;

// clicar na janela = trazer pra frente

windowElement.addEventListener("mousedown", () => {

highestZ++;
windowElement.style.zIndex = highestZ;

});

// iniciar drag

titleBar.addEventListener("mousedown", (e) => {

isDragging = true;

offsetX = e.clientX - windowElement.offsetLeft;
offsetY = e.clientY - windowElement.offsetTop;

});

// mover

document.addEventListener("mousemove", (e) => {

if(!isDragging) return;

windowElement.style.left = (e.clientX - offsetX) + "px";

windowElement.style.top = (e.clientY - offsetY) + "px";

});

// parar drag

document.addEventListener("mouseup", () => {

isDragging = false;

});

});
const icons = document.querySelectorAll(".icon");

icons.forEach(icon => {

let isDragging = false;

let offsetX, offsetY;

icon.addEventListener("mousedown", (e) => {

isDragging = true;

offsetX = e.clientX - icon.offsetLeft;
offsetY = e.clientY - icon.offsetTop;

});

document.addEventListener("mousemove", (e) => {

if(!isDragging) return;

icon.style.left = (e.clientX - offsetX) + "px";

icon.style.top = (e.clientY - offsetY) + "px";

});

document.addEventListener("mouseup", () => {

isDragging = false;

});

});