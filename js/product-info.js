/* // Variable que guarda la data del producto
let productoActual = {};

// Función para mostrar la data del producto
function mostrarInfoProduct(product) {
    // Título del producto
    document.querySelector(".product-title").textContent = product.name;

    // Categoría del producto
    document.querySelector(".category-name").textContent = `Categoría: ${product.category}`;

    // Unidades vendidas
    document.querySelector(".sold-count").textContent = `${product.soldCount} vendidos`;

    // Precio del producto
    document.querySelector(".product-price").textContent = `${product.currency} ${product.cost}`;

    // Descripción del producto
    document.querySelector(".product-description").textContent = product.description;

    // Imagen principal 
    document.querySelector(".main-image").src = product.images[0];

    // Por si hay imágenes adicionales
    let thumbnailsContainer = document.querySelector(".product-thumbnails");
    thumbnailsContainer.innerHTML = "";

    // Recorro este array de imágenes para mostrarlas
    for (let image of product.images) {
        let thumbDiv = document.createElement("div");
        thumbDiv.className = "col-2";

        let thumbnail = document.createElement("img");
        thumbnail.src = image;
        thumbnail.className = "img-thumbnail";
        thumbnail.alt = "Miniatura del producto";

        thumbDiv.appendChild(thumbnail);
        thumbnailsContainer.appendChild(thumbDiv);
    }
} */
// Paso 2,parte 2 Función para mostrar los comentarios
function mostrarComentarios(comentarios, clear = true) {
    const reviewsContainer = document.getElementById('reviews');

    // Solo limpiar el contenedor si es la primera vez (cuando clear = true)
    if (clear) {
        reviewsContainer.innerHTML = ''; // Limpiar contenido previo
    }

    if (!comentarios || comentarios.length === 0) {
        reviewsContainer.innerHTML = '<p>No hay comentarios disponibles.</p>';
        return;
    }

   
    /* Otra forma para las estrellas, Sofi */
    comentarios.forEach(comentario => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
    
        // Crear la calificación con las estrellas de la misma manera que en el formulario
        reviewElement.innerHTML = `
            <div class="review-header">
                <div class="review-rating rating">
                    ${[...Array(5)].map((_, i) => `
                        <label class="fa fa-star" style="color: ${i < comentario.score ? '#d4af37' : '#999'};"></label>
                    `).join('')}
                </div>
                <div class="review-user-date">
                    <span class="review-user">${comentario.user}</span>
                    <span class="review-date">${new Date(comentario.dateTime).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="review-comment">${comentario.description}</div>
        `;
    
        // Añadir cada comentario debajo de los existentes
        reviewsContainer.appendChild(reviewElement);
    });
    

} 

// Función para obtener los comentarios desde la API
function fetchProductComments(productId) {
    const commentsUrl = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;

    fetch(commentsUrl)
        .then(response => response.json())
        .then(comments => {
            mostrarComentarios(comments);  // Mostrar los comentarios obtenidos
        })
        .catch(error => console.error("Error al obtener los comentarios:", error));
}

// Paso 3 parte 2,Dentro de la función fetchProductInfo, se añadió la llamada a mostrarComentarios para pasar el array de comentarios del producto,
// Función que accede a la API para obtener la data del producto
function fetchProductInfo(productId) {
    const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            productoActual = data; // Guardar la data del producto
            mostrarInfoProduct(productoActual); // Mostrar la data del producto
            fetchProductComments(productId); // Obtener y mostrar comentarios
        })
        .catch(error => console.error("Error al obtener los datos del producto:", error));
}

// Función que se ejecuta cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
    let productId = localStorage.getItem("id");

   
    if (productId) {
        fetchProductInfo(productId); // Llamar a la función con el ID
    } else {
        console.warn("No se encontró un ID de producto en localStorage."); // Mensaje de advertencia
    }
});


// Función para guardar el ID del producto y redirigir
function guardarProductoId(id) {
    localStorage.setItem("id", id);
    window.location.href = "product-info.html"; // Redirigir a la página de detalles del producto
}

//desafiate Paso 2 guardar el nombre del usuario y usarlo al crear un nuevo comentario
document.getElementById("submit-review").addEventListener("click", function() {
    //primero, ver si el usuario esta logueado (si el sessionstorage esta como true)
    if (sessionStorage.getItem("sesion") !== "true") {
        alert("Debes iniciar sesión para dejar un comentario."); //si fuese false, no te deja poner un comentario.
        return; 
    }

    const puntaje = document.querySelector('input[name="rating"]:checked'); //obtener la calificacion (las estrellas) que puso el usurario
    const comentario = document.getElementById("comment").value; //lo mismo pero con el comentario

    //saco el username del sesssionstorage. Si no se encontrssr, ahí se usa en "Usuario Anónimo"
    const username = sessionStorage.getItem("nombreUsuario") || "Usuario Anónimo";

    if (puntaje && comentario) { //si el usuario puso una calificacion y un comentario
        const nuevoComentario = { //creo un const que tiene los datos del nuevo comentario
            score: parseInt(puntaje.value), //convierte las estrellas en un numero integer
            description: comentario, //el txt del comentario
            user: username, //user del sessionstorage
            dateTime: new Date().toISOString() //fecha y hora actual
        };

        if (!productoActual.comments) { //si no hay comentarios previos, hago un array vacio
            productoActual.comments = [];
        }

        //agrego el comentario al final del array de comentarios
        productoActual.comments.push(nuevoComentario);
        //llamo a la function mostrarcomentariospara que el array de los comentarios se muestre en la pagina y se actualice
        mostrarComentarios([nuevoComentario], false); // Mostrar el nuevo comentario en la página y lo pongo en false para que no borre los comentarios anteriores
        //limpio el formulario
        document.querySelector('input[name="rating"]:checked').checked = false; //limpio las estrellas
        document.getElementById("comment").value = ''; //limpio el comentario
    } else { //si no puso calificacion o comentario, le pide que lo haga con un cartel de alerta
        alert("Por favor, selecciona una calificación y escribe un comentario.");
    }
});

//Chiara
// Función para obtener los productos relacionados desde la API
function fetchRelatedProducts(productId) {
    const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const relatedProducts = data.relatedProducts; // Obtener los productos relacionados
            mostrarProductosRelacionados(relatedProducts);
        })
        .catch(error => console.error("Error al obtener los productos relacionados:", error));
}

// Función para mostrar los productos relacionados en el HTML
function mostrarProductosRelacionados(relatedProducts) {
    const barra = document.getElementById('barra-productos');
    barra.innerHTML = ''; // Limpiar contenido previo

    relatedProducts.forEach(product => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');
        divProducto.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 100px;">
            <h3>${product.name}</h3>
           
        `;
        
        // Evento clic para cargar el producto relacionado
        divProducto.addEventListener('click', () => {
            // Guardar el ID del producto en localStorage y redirigir a product-info.html
            localStorage.setItem('id', product.id);
            window.location.href = "product-info.html"; // Redirigir a la página de detalles del producto
        });

        barra.appendChild(divProducto);
    });
}

// Llamar a la función fetchRelatedProducts al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const productId = localStorage.getItem("id");
    if (productId) {
        fetchRelatedProducts(productId); // Obtener productos relacionados al cargar la página
    }
});

//que "bienvenido, miPerfil" sea un enlace a my-profile.html
const miPerfilBtn = document.getElementById('miPerfil');

//creo evento click
miPerfilBtn.addEventListener('click', function() {
  //lleva a pagina de tu perfil
  window.location.href = 'my-profile.html';
});

// Parte 4 Script para el modo día/noche
const toggleModo = document.getElementById('toggleModo');
const iconoModo = document.getElementById('iconoModo');

// Cargar el estado del modo noche desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const modoNocheActivo = localStorage.getItem('modoNoche') === 'true';
  toggleModo.checked = modoNocheActivo;
  if (modoNocheActivo) {
    iconoModo.classList.remove('bi-moon');
    iconoModo.classList.add('bi-sun');
    document.body.classList.add('modo-noche'); // Cambiar el tema
  }
});

toggleModo.addEventListener('change', () => {
  if (toggleModo.checked) {
    // Modo Noche
    iconoModo.classList.remove('bi-moon');
    iconoModo.classList.add('bi-sun');
    document.body.classList.add('modo-noche'); // Cambiar el tema
    localStorage.setItem('modoNoche', 'true'); // Guardar en localStorage
  } else {
    // Modo Día
    iconoModo.classList.remove('bi-sun');
    iconoModo.classList.add('bi-moon');
    document.body.classList.remove('modo-noche'); // Cambiar el tema
    localStorage.setItem('modoNoche', 'false'); // Guardar en localStorage
  }
});

/* // Manejo del clic en el botón "Comprar"
document.getElementById("buyButton").addEventListener("click", function() {
    const cantidad = document.getElementById("quantity").value; // Cantidad ingresada por el usuario
    const subtotal = productoActual.cost * cantidad; // Usar costo del producto actual

    // Crear objeto para almacenar en localStorage
    const compra = {
        nombre: productoActual.name,        
        costo: productoActual.cost,          
        moneda: productoActual.currency,     
        cantidad: cantidad,                  
        imagen: productoActual.images[0],    
        subtotal: subtotal                   
    };

    // Guardar en localStorage
    localStorage.setItem("compra", JSON.stringify(compra));

    // Navegar a cart.html
    window.location.href = "cart.html";
}); */

/* //Para la parte de carrito
// Simular datos del producto (ajusta según tu estructura real)
const producto = {
    nombre: "Producto X", // Reemplaza por el nombre dinámico del producto si es necesario.
    costo: 100,
    moneda: "USD",
    imagen: "url-de-la-imagen.jpg" // Reemplaza con la URL real de la imagen.
  };

  // Agregar evento al botón de compra
  document.getElementById('buyButton').addEventListener('click', function () {
    const cantidad = parseInt(document.getElementById('quantity').value);

    // Validar que la cantidad sea válida
    if (cantidad <= 0 || isNaN(cantidad)) {
      alert("Por favor, ingresa una cantidad válida.");
      return;
    }

    // Crear el producto con la cantidad seleccionada
    const productoConCantidad = { ...producto, cantidad };

    // Obtener el carrito del localStorage o inicializar uno nuevo
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Agregar el producto al carrito
    carrito.push(productoConCantidad);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Redirigir a la página del carrito
    window.location.href = 'cart.html';
  }); */


  let productoActual = {};

        function mostrarInfoProduct(product) {
            document.querySelector(".product-title").textContent = product.name;
            document.querySelector(".category-name").textContent = `Categoría: ${product.category}`;
            document.querySelector(".sold-count").textContent = `${product.soldCount} vendidos`;
            document.querySelector(".product-price").textContent = `${product.currency} ${product.cost}`;
            document.querySelector(".product-description").textContent = product.description;
            document.querySelector(".main-image").src = product.images[0];

            let thumbnailsContainer = document.querySelector(".product-thumbnails");
            thumbnailsContainer.innerHTML = "";
            for (let image of product.images) {
                let thumbDiv = document.createElement("div");
                thumbDiv.className = "col-2";

                let thumbnail = document.createElement("img");
                thumbnail.src = image;
                thumbnail.className = "img-thumbnail";
                thumbnail.alt = "Miniatura del producto";

                thumbDiv.appendChild(thumbnail);
                thumbnailsContainer.appendChild(thumbDiv);
            }
        }

        function fetchProductInfo(productId) {
            const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    productoActual = data;
                    mostrarInfoProduct(productoActual);
                })
                .catch(error => console.error("Error al obtener los datos del producto:", error));
        }

        // Agregar el producto al carrito con la cantidad indicada
function agregarAlCarrito(product, quantity) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Verificar si el producto ya está en el carrito
    let productoExistente = carrito.find(item => item.id === product.id);

    if (productoExistente) {
        productoExistente.quantity += quantity; // Sumar la cantidad seleccionada
    } else {
        carrito.push({
            id: product.id,
            name: product.name,
            price: product.cost,
            currency: product.currency,
            image: product.images[0],
            quantity: quantity
        });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto agregado al carrito.");
}
console.log(productoActual);


    


document.getElementById("buyButton").addEventListener("click", () => {
    const cantidad = parseInt(document.getElementById("quantity").value);
    console.log(productoActual, cantidad); // Verificar que no sean undefined

    agregarAlCarrito(productoActual, cantidad);
});


console.log(productoActual); // Verifica que tenga los datos correctos
console.log(localStorage.getItem("carrito")); // Verifica el contenido del carrito

/* Para Mi Carrito */
const miCarritoBtn = document.getElementById('miCarrito');

//creo evento click
miCarritoBtn.addEventListener('click', function() {
  //lleva a pagina de carrito
  window.location.href = 'cart.html';
});

