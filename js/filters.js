export function searchPokemon(){

const search = document.getElementById("search")
const genChecks = document.querySelectorAll(".gen")
const typeChecks = document.querySelectorAll(".type")

function applyFilters(){

const text = search.value.toLowerCase()

const gens = [...genChecks]
.filter(c=>c.checked)
.map(c=>parseInt(c.value))

const types = [...typeChecks]
.filter(c=>c.checked)
.map(c=>c.value)

const pokes = document.querySelectorAll(".poke")

pokes.forEach(p=>{

const name = p.dataset.name
const id = parseInt(p.dataset.id)

let show = true

/* BUSCADOR */

if(text && !name.includes(text) && !String(id).includes(text)){
show=false
}

/* GENERACIONES */

if(gens.length){

const genRanges=[
[1,151],
[152,251],
[252,386],
[387,493],
[494,649],
[650,721],
[722,809],
[810,905],
[906,1025]
]

let inGen=false

gens.forEach(g=>{
const [min,max]=genRanges[g-1]
if(id>=min && id<=max) inGen=true
})

if(!inGen) show=false

}

/* TIPOS */

if(types.length){

const pokeTypes = (p.dataset.type || "").split(",")

const match = types.every(t => pokeTypes.includes(t))

if(!match) show=false

}

p.style.display = show ? "block" : "none"

})

}

search.addEventListener("input",applyFilters)

genChecks.forEach(c=>c.addEventListener("change",applyFilters))
typeChecks.forEach(c=>c.addEventListener("change",applyFilters))

}