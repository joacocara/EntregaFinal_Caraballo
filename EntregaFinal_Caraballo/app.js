class Producto {
  constructor(id, nombre, precio, stock, img, descripcion, alt){
    this.id = id;
    this.nombre = nombre;
    this.cantidad = 1;
    this.precio = precio;
    this.stock = stock;
    this.img = img;
    this.descripcion = descripcion;
    this.alt = alt;
  }
}

class ProductoController {
  constructor() {
    this.ListaProductos = []
    this.contenedor_productos = document.getElementById("contenedor_productos")
  }
  async levantar_y_mostrar(controladorCarrito){
    const resp = await fetch("producto.json")
    this.ListaProductos = await resp.json()

    this.mostrarEnDOM()
    this.darEventoClickAProductos(controladorCarrito)
  }
  LevantarProductos(){
    this.ListaProductos = [
      new Producto(1, "Ryzen 3", 50000, 10, "/r3p.jpg", "Procesador de 4 GHz", "microprocesador ryzen 3"),
      new Producto(2, "Ryzen 5", 70000, 10, "/r5.png", "Procesador de 4.8 GHz","microprocesador ryzen 5"),
      new Producto(3, "Intel i5", 65000, 10, "/i5p.png", "Procesador de  4.2 GHz","microprocesador intel i5"),
      new Producto(4, "Intel i7", 85000, 10, "/i7p.jpg", "Procesador de 5 GHz", "microprocesador intel i7"),
    ]
  }
  mostrarEnDOM(){
    //Mostramos los productos en DOM de manera dinámica
    this.ListaProductos.forEach(producto => {
      this.contenedor_productos.innerHTML += `
    <div class="card" style="width: 18rem;">
      <img src="${producto.img}" class="card-img-top" alt="${producto.alt}">
      <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <p class="card-text">${producto.descripcion}</p>
        <p class="card-text">Precio: $${producto.precio}</p>
        <a href="#" id="cpu-${producto.id}" class="btn btn-primary">Añadir al carrito</a>
      </div>
    </div>`
    })
  }
  darEventoClickAProductos(controladorCarrito){
    this.ListaProductos.forEach(producto => {
      const btnAP = document.getElementById(`cpu-${producto.id}`)
      btnAP.addEventListener("click", () => {
    
        controladorCarrito.agregar(producto)
        controladorCarrito.guardarEnSTORAGE()
        //TODO: que solo añada 1 producto al DOM. Que no recorra toda la lista
        controladorCarrito.mostrarEnDOM(contenedor_carrito)
      })
    })
  }
}



class CarritoController{
  constructor(){
    this.ListaCarrito = []
    this.contenedor_carrito = document.getElementById("contenedor_carrito")
    this.total = document.getElementById("total")
  }
  calcularTotalYmostrarEnDOM(){
    let total = 0;
    total = this.ListaCarrito.reduce((total, producto)=> total + producto.cantidad * producto.precio, 0)
    this.total.innerHTML = `total a pagar: $${total}`; 
}
  comprobarExistenciaDeProducto(producto){
    return this.ListaCarrito.find((elproducto)=>elproducto.id == producto.id)
  }
  agregar(producto){

    let flag = true;

    for(let i = 0; i < this.ListaCarrito.length; i++) {
      if(this.ListaCarrito[i].id == producto.id){
        this.ListaCarrito[i].cantidad += 1;
        flag = false
      }
    }
      if(flag == true){
        this.ListaCarrito.push(producto)
      }
  }
  limpiarCarritoEnSTORAGE(){
    localStorage.removeItem("listaCarrito")
  }
  guardarEnSTORAGE(){
      let ListaCarritoJSON = JSON.stringify(this.ListaCarrito)
      localStorage.setItem("listaCarrito",ListaCarritoJSON)
  }
  VerificarExistenciaEnSTORAGE(){
    this.ListaCarrito = JSON.parse(localStorage.getItem('listaCarrito')) || []
    if(this.ListaCarrito.length > 0){
      this.mostrarEnDOM()
    }
  }
  limpiarContenedorCarrito(){
     //limpio el contenedor para recorrer todo el arreglo y no se repita sin querer los productos.
     this.contenedor_carrito.innerHTML = ""
  }
  borrar(producto){
    let posicion = this.ListaCarrito.findIndex(miProducto => producto.id == miProducto.id)

    if( !(posicion == -1) ){
      this.ListaCarrito.splice(posicion,1)
    }
  }
  mostrarEnDOM(){
    this.limpiarContenedorCarrito()
    this.ListaCarrito.forEach(producto => {
      this.contenedor_carrito.innerHTML +=
      `<div class="card" style="width: 18rem;">
        <img src="${producto.img}" class="card-img-top" alt="${producto.alt}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">${producto.descripcion}</p>
          <p class="card-text">Cantidad: ${producto.cantidad}</p>
          <p class="card-text">Precio: $${producto.precio}</p>
          <button class="btn btn-danger" id="borrar-${producto.id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`
    })
    this.ListaCarrito.forEach(producto => {
      const btnBorrar = document.getElementById(`borrar-${producto.id}`)
      
      btnBorrar.addEventListener("click", ()=>{
        this.borrar(producto)
        this.guardarEnSTORAGE()
        this.mostrarEnDOM()
      })
    })
    this.calcularTotalYmostrarEnDOM()
  }
}
  
//controllers
const controladorProductos = new ProductoController()
const controladorCarrito = new CarritoController()

controladorProductos.levantar_y_mostrar(controladorCarrito)
//Carrito erifica en Storage y muestra en DOM si hay algo.
controladorCarrito.VerificarExistenciaEnSTORAGE()


//EVENTOS
//controladorProductos.darEventoClickAProductos(controladorCarrito)

const finalizar_compra = document.getElementById("finalizar_compra")

finalizar_compra.addEventListener("click", () => {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Tu compra fue aceptada',
    showConfirmButton: false,
    timer: 1500
  })

    //está en DOM
    controladorCarrito.limpiarContenedorCarrito()
    //está en localStorage
    controladorCarrito.limpiarCarritoEnSTORAGE()
    //está en listaCarrito
    controladorCarrito.ListaCarrito = []
})
