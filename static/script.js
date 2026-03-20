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