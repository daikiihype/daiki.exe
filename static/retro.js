
const items = document.querySelectorAll(".item")
const dialogBox = document.getElementById("dialogBox")
const dialogText = document.getElementById("dialogText")

const c1 = document.getElementById("choice1")
const c2 = document.getElementById("choice2")
const c3 = document.getElementById("choice3")


items.forEach(item => {

item.addEventListener("click", () => {

const tipo = item.dataset.item

openDialog(tipo)

})

})


function openDialog(tipo){

dialogBox.classList.remove("hidden")


if(tipo === "controle"){

dialogText.innerText = "Seu controle favorito. Muitas madrugadas foram gastas jogando."

c1.innerText = "Jogar um pouco"
c2.innerText = "Guardar controle"
c3.innerText = "Lembrar de jogos antigos"

}


if(tipo === "manga"){

dialogText.innerText = "Um mangá que você ainda não terminou."

c1.innerText = "Ler capítulo"
c2.innerText = "Fechar mangá"
c3.innerText = "Levar com você"

}


if(tipo === "bombinha"){

dialogText.innerText = "Sua bombinha de asma. Melhor não esquecer dela."

c1.innerText = "Guardar no bolso"
c2.innerText = "Usar"
c3.innerText = "Deixar aí"

}


if(tipo === "poster"){

dialogText.innerText = "Um poster estiloso na parede."

c1.innerText = "Olhar detalhes"
c2.innerText = "Ignorar"
c3.innerText = "Tirar foto"

}


if(tipo === "notebook"){

dialogText.innerText = "Seu notebook prata está ligado."

c1.innerText = "Ver internet"
c2.innerText = "Fechar notebook"
c3.innerText = "Pesquisar console novo"

}

}