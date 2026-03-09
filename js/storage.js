export function loadDex(){
return JSON.parse(localStorage.getItem("dex")) || {}
}

export function saveDex(data){
localStorage.setItem("dex", JSON.stringify(data))
}

export function resetDex(){
localStorage.removeItem("dex")
}