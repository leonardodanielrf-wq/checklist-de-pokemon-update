import { saveDex } from "./storage.js"
import { openPokemon } from "./modal.js"
import { nombres } from "../data/names.js"
import { tipos } from "../data/types.js"
export function createPokedex(total, data, grid, updateCounter){

const frag = document.createDocumentFragment()

for(let i=1;i<=total;i++){

const div = document.createElement("div")

div.className = "poke"+(data[i]?" active":"")
div.dataset.id = i
div.dataset.name = nombres[i-1].toLowerCase()   // ← IMPORTANTE PARA BUSCADOR
div.dataset.type = (tipos[i] || []).join(",")
div.innerHTML = `
<img loading="lazy"
src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png">

<div class="name">#${i} ${nombres[i-1]}</div>
`

div.onclick = () => openPokemon(i)

div.oncontextmenu = (e)=>{

e.preventDefault()

const active = div.classList.toggle("active")

data[i] = active

saveDex(data)

updateCounter()

}

frag.appendChild(div)

}

grid.appendChild(frag)

}