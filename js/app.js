import { createPokedex } from "./pokedex.js"
import { loadDex, resetDex } from "./storage.js"
import { searchPokemon } from "./filters.js"
import { closeModal } from "./modal.js"

const total = 1025

const grid = document.getElementById("grid")
const num = document.getElementById("num")
const resetBtn = document.getElementById("resetBtn")
const closeModalBtn = document.getElementById("closeModal")

// cargar progreso guardado
let data = loadDex()

// actualizar contador
function updateCounter(){

const count = Object.values(data).filter(v => v).length

num.textContent = count

}

// crear pokedex
createPokedex(total, data, grid, updateCounter)

searchPokemon()
// contador inicial
updateCounter()

// activar búsqueda
searchPokemon()

// botón reiniciar
resetBtn.onclick = () => {

if(confirm("Borrar progreso?")){

resetDex()
location.reload()

}

}

// cerrar modal
closeModalBtn.onclick = closeModal

// menú lateral
window.toggleMenu = function(){

document.getElementById("sidebar").classList.toggle("open")

}