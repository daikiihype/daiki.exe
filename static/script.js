document.addEventListener("DOMContentLoaded", () => {

document.body.classList.add("page-visible")

const links = document.querySelectorAll("a")

links.forEach(link => {

link.addEventListener("click", function(e){

const url = this.href

if(url && !url.includes("#")){

e.preventDefault()

document.body.classList.remove("page-visible")

setTimeout(()=>{
window.location.href = url
},500)

}

})

})

})
setTimeout(() => {

document.getElementById("boot-screen").style.display = "none";

}, 4500);

function addMessage(){

const input = document.getElementById("visitorInput");

const messages = document.getElementById("messages");

if(input.value.trim() === "") return;

const msg = document.createElement("div");

msg.classList.add("message");

msg.textContent = "> " + input.value;

messages.appendChild(msg);

input.value = "";

}
const cards = document.querySelectorAll(".hobby-card");

cards.forEach(card => {

card.addEventListener("mousemove", (e) => {

const rect = card.getBoundingClientRect();

const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

const centerX = rect.width / 2;
const centerY = rect.height / 2;

const rotateX = (y - centerY) / 8;
const rotateY = (centerX - x) / 8;

card.style.transform =
`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

});

card.addEventListener("mouseleave", () => {

card.style.transform = "rotateX(0) rotateY(0)";

});

});
let travado = false;

function ativarMemoria() {
    if (travado) return;

    const img = document.getElementById("mainImg");
    const btn = document.getElementById("actionBtn");

    // troca imagem
    img.src = "../static/Imagens/waifu2.jpg";

    // trava botão
    btn.disabled = true;
    travado = true;

    // volta depois de 10s
    setTimeout(() => {
        img.src = "../static/Imagens/waifu3.jpg";
        btn.disabled = false;
        travado = false;
    }, 5000);
}


// SCROLL DA GALERIA
function scrollGallery(direction) {
    const gallery = document.getElementById("gallery");
    gallery.scrollBy({
        left: 120 * direction,
        behavior: "smooth"
    });
}
window.addEventListener("load", () => {

setTimeout(() => {

document.getElementById("boot-screen").style.opacity = "0";

setTimeout(() => {

document.getElementById("boot-screen").style.display = "none";

},1000);

},5000);

});

const symbols = document.querySelectorAll(".symbols span");

symbols.forEach(symbol => {

symbol.style.left = Math.random() * 100 + "vw";

symbol.style.top = 100 + Math.random() * 50 + "vh";

symbol.style.animationDuration =
10 + Math.random() * 20 + "s";

symbol.style.animationDelay =
Math.random() * 15 + "s";

symbol.style.fontSize =
12 + Math.random() * 25 + "px";

});