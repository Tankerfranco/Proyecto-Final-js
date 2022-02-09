// variables globales
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaComida = document.querySelector('#listaComida');
let articulosCarrito = [];

  
cargarEventListeners();
function cargarEventListeners() {
    // Agregamos una comida presionando "Agregar al Carrito"   
    listaComida.addEventListener('click', agregarComida); 

    // Elimina comida del carrito
    carrito.addEventListener('click', eliminarComida);
 
    // Muestra las comida de Local Storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoHTML();
    })

    // Vaciar el carrito
    $("#vaciar-carrito").click(function(){
        articulosCarrito = [];
        localStorage.clear();
        limpiarHTML();
    });

    vaciarCarritoBtn.addEventListener('click', () => {
        
        articulosCarrito = []; // reseteamos el arreglo
        
        limpiarHTML(); // Eliminamos todo el  HTML
    });
}

// Funciones
function agregarComida(e) {
    e.preventDefault();
    // console.log(e.target.parentElement);

    if (e.target.classList.contains('agregar-carrito')) {
        const comidaSelecionada = e.target.parentElement;
        leerDatosComida(comidaSelecionada);
    }
}

// Elimina un curso del carrito
function eliminarComida(e) {
    // console.log(e.target.classList);
    if (e.target.classList.contains('borrar-comida')) {
        // console.log(e.target.getAttribute('data-id'));
        const comidaId = e.target.getAttribute('data-id');

        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( comida => comida.id !== comidaId);
        // console.log(articulosCarrito); // Muestra el arreglo actualizado. Sin la comida que fue eliminada
        carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
    }
}

function leerDatosComida(comida) {
    // console.log(comida);    
    const infoComida = {
        imagen: comida.querySelector('img').src,
        titulo: comida.querySelector('h3').textContent,
        precio: comida.querySelector('.precio').textContent,
        id: comida.querySelector('button').getAttribute('data-id'),
        cantidad: 1
    }

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( comida => comida.id === infoComida.id );
    if (existe) {
        // Actualizamos la cantidad
        const comida = articulosCarrito.map( comida => {
            if (comida.id === infoComida.id) {
                comida.cantidad++;
                return comida; // retorna el objeto actualizado incrementando la cantidad
            } else {
                return comida; // retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [...comida];
    } else {
        // Agrega elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoComida];
    }

    console.log(articulosCarrito);

    carritoHTML();
}

// Muestra el Carrito de compras en el HTML
function carritoHTML() {

    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( comida => {
        const { imagen, titulo, precio, cantidad, id } = comida;
        const cont__carta = document.createElement('tr');
        cont__carta.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-comida" data-id="${id}"> X </a>
            </td>
        `;

        // Agregamos el HTML del carrito en el tbody
        contenedorCarrito.appendChild(cont__carta);
    });

    // Agregar el carrito de compras al storage
    sincronizarStorage();

}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina la comida de la tabla
function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

// Pop up

$(document).ready(function(){
    $("#abrir").on("click", function(){
        $("#popUp").fadeIn("slow");
    });
})

$(document).ready(function(){
    $("#close").on("click", function(){
        $("#popUp").fadeOut("slow");
        articulosCarrito = [];
        localStorage.clear();
        limpiarHTML();
    });
})

// Filtro de busqueda

function searchFilters(input, selector){
    document.addEventListener("keyup",(e)=>{
        if(e.target.matches(input)){
            document.querySelectorAll(selector).forEach(el => el.textContent.toLowerCase().includes(e.target.value)
                ?el.classList.remove("filter")
                :el.classList.add("filter"));
        }
    });

}

searchFilters(".filtroComida", ".cont__carta");