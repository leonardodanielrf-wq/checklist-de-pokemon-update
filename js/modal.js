let currentPokemonId = null;
const pokemonCache = {};
const evolutionCache = {};

/* ABRIR MODAL */
export async function openPokemon(id) {

  currentPokemonId = id;

  const modal = document.getElementById("modal");
  modal.style.display = "flex";

  const nameEl = document.getElementById("pokeName");
  const imgEl = document.getElementById("pokeImg");
  const typesEl = document.getElementById("pokeTypes");
  const infoEl = document.getElementById("pokeInfo");
  const statsEl = document.getElementById("pokeStats");
  const evoEl = document.getElementById("pokeEvo");
  const canvas = document.getElementById("statsChart");

  /* LIMPIAR CONTENIDO */
  nameEl.textContent = "Cargando...";
  imgEl.src = "";
  typesEl.innerHTML = "";
  infoEl.innerHTML = "";
  statsEl.innerHTML = "";
  evoEl.innerHTML = "";

  /* LIMPIAR GRAFICO */
  if (window.chart) {
    window.chart.destroy();
    window.chart = null;
  }

  try {

    /* FETCH POKEMON (CACHE) */
    const p = pokemonCache[id] ?? await fetchPokemon(id);
    pokemonCache[id] = p;

    if (id !== currentPokemonId) return;

    renderPokemon(p, canvas);

    /* FETCH EVOLUCIONES (CACHE) */
    const evoList = evolutionCache[id] ?? await fetchEvolutions(p);
    evolutionCache[id] = evoList;

    if (id !== currentPokemonId) return;

    evoEl.innerHTML =
      "<h3>Evoluciones</h3>" + evoList.join(" → ");

  } catch (err) {

    console.error("Error cargando Pokémon:", err);
    nameEl.textContent = "Error al cargar";

  }
}


/* CERRAR MODAL */
export function closeModal() {

  document.getElementById("modal").style.display = "none";

  /* reset para poder abrir el mismo pokemon otra vez */
  currentPokemonId = null;

}


/* ========================= */
/* FUNCIONES AUXILIARES */
/* ========================= */

async function fetchPokemon(id) {

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return res.json();

}


async function fetchEvolutions(pokemon) {

  const speciesRes = await fetch(pokemon.species.url);
  const species = await speciesRes.json();

  const evoRes = await fetch(species.evolution_chain.url);
  const evoData = await evoRes.json();

  const evoList = [];

  let chain = evoData.chain;

  while (chain) {

    evoList.push(chain.species.name);

    chain = chain.evolves_to[0];

  }

  return evoList;

}


/* ========================= */
/* RENDER POKEMON */
/* ========================= */

function renderPokemon(p, canvas) {

  const nameEl = document.getElementById("pokeName");
  const imgEl = document.getElementById("pokeImg");
  const typesEl = document.getElementById("pokeTypes");
  const infoEl = document.getElementById("pokeInfo");
  const statsEl = document.getElementById("pokeStats");

  /* NOMBRE */

  nameEl.textContent = "#" + p.id + " " + p.name;


  /* IMAGEN */

  imgEl.src =
    p.sprites.other["official-artwork"].front_default;


  /* TIPOS */

  const tiposES = {

    grass:"Planta",
    fire:"Fuego",
    water:"Agua",
    electric:"Eléctrico",
    ice:"Hielo",
    fighting:"Lucha",
    poison:"Veneno",
    ground:"Tierra",
    flying:"Volador",
    psychic:"Psíquico",
    bug:"Bicho",
    rock:"Roca",
    ghost:"Fantasma",
    dragon:"Dragón",
    dark:"Siniestro",
    steel:"Acero",
    fairy:"Hada",
    normal:"Normal"

  };

  const types =
    p.types
    .map(t => tiposES[t.type.name] || t.type.name)
    .join(", ");

  typesEl.innerHTML = "<b>Tipo:</b> " + types;


  /* ALTURA Y PESO */

  infoEl.innerHTML =
    `Altura: ${p.height/10} m<br>Peso: ${p.weight/10} kg`;


  /* STATS TEXTO */

  const statsES = {

    hp:"PS",
    attack:"Ataque",
    defense:"Defensa",
    "special-attack":"Ataque Esp.",
    "special-defense":"Defensa Esp.",
    speed:"Velocidad"

  };

  let statsHTML = "";

  p.stats.forEach(s => {

    const nombre = statsES[s.stat.name] || s.stat.name;

    statsHTML +=
    `<div class="stat">
      <span>${nombre}</span>
      <span>${s.base_stat}</span>
    </div>`;

  });

  statsEl.innerHTML = "<h3>Stats</h3>" + statsHTML;


  /* ========================= */
  /* GRAFICO RADAR */
  /* ========================= */

  const stats = p.stats.map(s => s.base_stat);

  const ctx = canvas.getContext("2d");

  window.chart = new Chart(ctx, {

    type: "radar",

    data: {

      labels:[
        "PS",
        "Ataque",
        "Defensa",
        "Ataque Esp",
        "Defensa Esp",
        "Velocidad"
      ],

      datasets:[{

        data:stats,
        backgroundColor:"rgba(0,255,213,0.25)",
        borderColor:"#00ffd5",
        borderWidth:2,
        pointBackgroundColor:"#00ffd5"

      }]

    },

    options:{

      responsive:true,
      maintainAspectRatio:false,

      plugins:{
        legend:{display:false}
      },

      scales:{

        r:{

          beginAtZero:true,
          suggestedMax:150,

          ticks:{
            display:false
          },

          grid:{
            color:"#555"
          },

          angleLines:{
            color:"#555"
          },

          pointLabels:{
            color:"white",
            font:{size:12}
          }

        }

      }

    }

  });

}