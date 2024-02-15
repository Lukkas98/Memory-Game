//menu
let menuPrincipal = document.querySelector(".menu-principal")
let btnJugar = document.querySelector("#btn-jugar");
let btnOpciones = document.querySelector("#btn-opciones");
let btnVerCambios = document.querySelector("#btn-salir");

let menuOpciones = document.querySelector(".menu-opciones");

let pantallaJuego = document.querySelector(".contenedor");

let btnPausa = document.querySelector(".btn-pausa");
// let pausa = false;

let efectosSonoros = true; //efectos de sonido
let sonarFondo = false; //musica de fondo

btnJugar.addEventListener("click",()=>{
    menuPrincipal.classList.add("invisible");
    pantallaJuego.classList.remove("invisible");
    
    inicializar();
})


//menu opciones
btnOpciones.addEventListener("click",()=>{
    menuPrincipal.classList.add("invisible");
    menuOpciones.classList.remove("invisible");
})
let btnVolverOpciones = document.querySelector(".menu-opciones-volver")
btnVolverOpciones.addEventListener("click",()=>{
    menuOpciones.classList.add("invisible")
    menuPrincipal.classList.remove("invisible");
})
let btn2Opciones = document.querySelector(".btn-opciones2");
btn2Opciones.addEventListener("click",()=>{
    if (btn2Opciones.textContent === "Desactivar Música") {
        btn2Opciones.textContent = "Activar Música"
        sonarFondo = true;
        reproducirCancion();
    }else{
        btn2Opciones.textContent = "Desactivar Música"
        sonarFondo = false;
        reproducirCancion();
    }
})
let btn3Opciones = document.querySelector(".btn-opciones3");
btn3Opciones.addEventListener("click",()=>{
    if (btn3Opciones.textContent === "Desactivar Sonidos") {
        btn3Opciones.textContent = "Activar Sonidos"
        efectosSonoros = false;
        reproducirEfecto();
    }else{
        sonarFondo = true;
        reproducirEfecto();
        btn3Opciones.textContent = "Desactivar Sonidos"
    }
})

//cierra la ventana actual (intento)
btnVerCambios.addEventListener("click",()=> verificarLink("cambios"))


let cartasDetras = document.querySelectorAll(".img2");
let divsImagenes = document.querySelectorAll(".juego div");
let juego = document.querySelector(".juego");
let botonIniciar = document.querySelector(".btn");
let puntos = document.querySelector(".puntaje");
let fragmentosAgregados = [];

const dirImagenes = "imagenes/imagen/"
let imagenes = [`${dirImagenes}1.png`, `${dirImagenes}2.png`, `${dirImagenes}3.png`, `${dirImagenes}4.png`];
let cartaOculta = `${dirImagenes}0.png`;
let arrValor = [];
let vecesGanadas = 0, nivel = 0, segundero,minutero, vecesJugadas = 1;

//inicia el programa precargando los audios en memoria
const direccion = `sonidos/efectos/`;
let audios = [];

//una vez cargados todos los audios inicio el juego
const audiosCargados =()=> botonIniciar.classList.remove("invisible");
const precargarSonidos = (n, fncOK)=>{
    let cargados = 0;
    for (let i = 0; i < n; i++) {
        let audio = new Audio(direccion+(i+1)+".mp3");
        audio.addEventListener("canplaythrough", ()=>{
            cargados++;
            if (cargados >= n) {
                fncOK ? fncOK() : null;
            }
        });
        audios[i] = audio
    }
}
precargarSonidos( 4, audiosCargados());

const inicializar = () => {
    botonIniciar.addEventListener("click", function(){
        botonIniciar.classList.add("invisible");
        btnPausa.classList.remove("invisible");
        juego.classList.remove("invisible");
        puntos.classList.remove("invisible");
        puntos.textContent = `Puntaje: 0`;
        fragmentosAgregados = [];
        temporizador();
        inicio();
    })
}

//da un valor a las cartas al comienzo del juego y los guarda para su uso posterior
const inicio = () => {
    cartasDetras = document.querySelectorAll(".img2")
    divsImagenes = document.querySelectorAll(".juego div")
    arrValor = []
    let rutasImagenes = imagenes.concat(imagenes)
    let valoresImagenes = []
     
    while (valoresImagenes.length != rutasImagenes.length ){
        let num = Math.floor(Math.random() * rutasImagenes.length/2)
        num = num.toString()
        if (valoresImagenes.indexOf(num) === valoresImagenes.lastIndexOf(num)) valoresImagenes.push(num)
    }
    cartasDetras.forEach((carta, i) => carta.setAttribute("src", rutasImagenes[valoresImagenes[i]]))
    divsImagenes.forEach(div => div.addEventListener("click", seleccionarCartas, true))
}
function seleccionarCartas() {
    arrValor.push(this)
    this.classList.add("voltear")
    //desactivar el efecto para que no ocurra bug (Tocar la misma imagen)
    arrValor[0].removeEventListener("click", seleccionarCartas, true)

    if (arrValor.length === 2) {
        compararCartas(arrValor)
    }
}
const compararCartas = (arr)=> {
    if (arr[0].children[1].currentSrc != arr[1].children[1].currentSrc) {
        setTimeout(()=>{arr.forEach(carta => carta.classList.remove("voltear"));},400);
        //Al ser las cartas distintas habilito de nuevo el efecto
        arr[0].addEventListener("click", seleccionarCartas, true);

    }else if(arr[0].children[1].currentSrc === arr[1].children[1].currentSrc){
        arr.forEach(carta => {
            carta.removeEventListener("click", seleccionarCartas, true);
            carta.classList.add("voltear");
        })
        vecesGanadas++;
        puntaje(vecesGanadas);
        reproducirEfecto(audios[0].currentSrc);

        let cartas = [];
        divsImagenes.forEach(div =>{
            if(div.className.includes("voltear")) cartas.push(div);
            if (cartas.length === divsImagenes.length) {
                cartas = [];
                nivel++
                setTimeout(()=>{subirLevel(nivel)}, 500);
            };
        })
    }
    arrValor = []
}
const subirLevel = (nivel)=>{
    if (nivel === 1 || nivel === 2) {
        if (nivel === 1) crearImagenes(5, 6)
        else crearImagenes(7, 8)
        crearDivs(4, 1)
        segundero += 10
    }else if(nivel === 4){
        crearImagenes(9, 12)
        crearDivs(8, 2)
        segundero += 20
    }else if(nivel === 6){
        crearImagenes(13, 18)
        crearDivs(12, 2)
        segundero += 40
    }else{
        if(nivel === 3) segundero += 15
        else if(nivel === 5) segundero += 25
        else segundero += 45
        divsImagenes.forEach(carta => carta.classList.remove("voltear"))
        inicio()
    }
}
const crearImagenes = (inicio, total) => {for (let i = inicio; i <= total; i++) imagenes.push(`${dirImagenes}${i}.png`)}

const crearDivs = (cantidad, nivel) =>{
    divsImagenes.forEach(carta => carta.classList.remove("voltear"))
    // reproducirEfecto(audios[3].currentSrc)
    let fragmento = document.createDocumentFragment()
    let imagenes = document.createDocumentFragment()

    for (let i = 0; i < cantidad; i++) {
        let crearDiv = document.createElement("div")
        crearDiv.classList.add("cuadrado-azul")
        crearDiv.classList.add("img-comun")
        crearDiv.classList.add("carta")

        for (let i = 0; i < 2; i++) {
            let crearImagen = document.createElement("img")
            if (i <= 1) {
                if (i === 0) {
                    crearImagen.classList.add("img1")
                    crearImagen.classList.add("frente")
                    crearImagen.setAttribute("src", cartaOculta)
                }else if(i === 1){
                    crearImagen.classList.add("img2")
                    crearImagen.classList.add("detras")
                }
                imagenes.appendChild(crearImagen)
            }
        }
        if (nivel !== 1) {
            crearDiv.classList.remove("img-comun")
            crearDiv.classList.add("img-disminuida")
            if (i === 0) {
                divsImagenes.forEach(div => {
                    div.classList.remove("img-comun")
                    div.classList.add("img-disminuida")
                })                
            }
        }
        crearDiv.appendChild(imagenes)

        fragmento.appendChild(crearDiv)
        fragmentosAgregados.push(crearDiv)
    }
    juego.appendChild(fragmento)
    document.getElementById("final").scrollIntoView(true)
    inicio()
}
let tempo = document.querySelector(".contador")

//boton pausa
let reloj

let onOFF = true
btnPausa.addEventListener("click", verificarPausa)

//Boton menu
btnMenu = document.querySelector("#btnMenu")
btnMenu.addEventListener("click", ()=>{
    menuPrincipal.classList.remove("invisible");
    pantallaJuego.classList.add("invisible");

})

function verificarPausa(){
    if (onOFF == true) {
        clearInterval(reloj)
        btnPausa.textContent = "Reanudar"
        juego.classList.add("bloquear")
        onOFF = false
    }else{
        reloj = setInterval(contador, 1000)
        btnPausa.textContent = "Pausar"
        juego.classList.remove("bloquear")
        onOFF = true
    }
}



//para "optimizar" el temporizador
const numTempo = (seg, min)=>{
    if (seg.toString().length < 2){
        if (min === 0) {
            tempo.style.color = "#630808"
            reproducirEfecto(audios[2].currentSrc)
        }
        return `0${seg}`;
    }
    tempo.style.color = ""
    return seg;
}

function temporizador() {
    minutero = 1
    segundero = 19
    reloj = setInterval(contador, 1000)
}

function contador() {

    if (segundero > 60) {
        segundero -= 59
        minutero++
    }else if (segundero < 60 && minutero >= 0) {
            if (segundero === -1) {
                minutero--
                segundero = 59   
            }      
    }
    tempo.textContent = `${minutero}:${numTempo(segundero, minutero)}`
    //a partir de acá se realiza un "reseteo" (finaliza el tiempo del reloj)
    if(minutero === -1){
        tempo.style.color = ""
        reproducirEfecto(audios[3].currentSrc)
        clearInterval(reloj)
        tempo.textContent = `1:20`
        reset()
    }
    segundero--
}

const puntaje = (parejasEncontradas) => puntos.textContent = `Puntaje: ${parejasEncontradas * 150}`
    
const reset = () => {
    imagenes = [`${dirImagenes}1.png`, `${dirImagenes}2.png`, `${dirImagenes}3.png`, `${dirImagenes}4.png`];
    if (fragmentosAgregados.length !== 0) fragmentosAgregados.forEach(fragmento => juego.removeChild(fragmento))
    divsImagenes.forEach(div => {
        div.removeEventListener("click", seleccionarCartas, true)
        div.classList.remove("img-disminuida")
        div.classList.add("img-comun")
        div.classList.remove("voltear")
    })
    mostrarPuntaje()
    vecesGanadas = 0
    nivel = 0
    btnPausa.classList.add("invisible")
}
const mostrarPuntaje = ()=>{
    botonIniciar.classList.remove("invisible")
    puntos.classList.add("invisible")
    let btnPuntaje = document.querySelector("#btn-puntaje")
    btnPuntaje.classList.remove("invisible")

    let guardarPuntos = document.querySelector("#formulario")
    let puntosEchos = document.querySelector("#puntos")

    guardarPuntos.classList.remove("invisible")
    puntosEchos.value = `${vecesGanadas * 150}`
    puntosEchos.disabled = true

    verificarLink("mostrar-puntos")

    function ocultar(){
        guardarPuntos.classList.add("invisible")
        puntosEchos.removeAttribute("value")
    }

    let btnCerrar = document.querySelector("#btnCerrar")
    btnCerrar.addEventListener("click", ocultar, true)
}
const reproducirEfecto = (audio)=>{
    let a = new Audio(audio);
    if (efectosSonoros === true) {
        a.volume = "1"
        a.play();
    }else{
        a.pause();
    }
}
const canciones = ["Friends.ogg", "SolveThePuzzle.ogg", "clearday.mp3", "happiness.mp3"];//canciones de fondo
// let sonidoImg = document.querySelector("#sonido"); //imagen del parlante

//let sonarFondo = false;
let musica = new Audio(`sonidos/fondo/SolveThePuzzle.ogg`)

// sonidoImg.addEventListener("click", reproducirCancion); //cuando hago clic en el icono
function reproducirCancion(){     
    if (!sonarFondo) {
        let numero = Math.floor(Math.random()*(canciones.length));
        musica = new Audio(`sonidos/fondo/${canciones[numero]}`)
        reanudarMusica(musica)
    }else{
        pausarMusica(musica)
    };
};
const reanudarMusica = (audio)=>{
    if (!sonarFondo) {
        sonarFondo = true
        audio.volume = "0.5"
        audio.play()
        audio.addEventListener("ended", ()=>{
            sonarFondo = false;
            reproducirCancion();
        });
    }
}
const pausarMusica = (audio)=>{
    if (sonarFondo) {
        sonarFondo = false
        audio.pause()
    }
}
const verificarLink = (target)=>{
    let link = location.href
    if (location.href.indexOf("#") != -1){
        let indice = location.href.indexOf("#")
        let linkNuevo
        linkNuevo = link.slice(indice)
        location.href = `${linkNuevo}${target}`
    }else{
        location.href = `${link}#${target}`
    }
}