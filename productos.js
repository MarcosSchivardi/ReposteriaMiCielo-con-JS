const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const  templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
let carrito = {}


document.addEventListener("DOMContentLoaded", () => {
    fetchData ()
    if(localStorage.getItem("carrito")){
      carrito = JSON.parse(localStorage.getItem("carrito"))
      pintarCarrito()
    }
  })
  cards.addEventListener("click", e => {
    addCarrito(e)
  })  
  
  items.addEventListener("click", e => {
    btnAccion(e)
  })
  const fetchData = async () => {
    try{
      const res = await fetch("items.json")
      const data = await res.json()
      pintarCards(data)
    } catch (error) {
      console.assert.log(error)
    }
  }




  const divContainer = document.createElement("div");
  divContainer.classList.add("container")


  const pintarCards = data => {
    data.forEach(producto => {
        const divCard = document.createElement("div")
        divCard.classList.add("card")
        // console.log(producto)
        templateCard.querySelector("h5").textContent = producto.titulo
        templateCard.querySelector("p").textContent = producto.precio
        templateCard.querySelector("img").setAttribute("src",producto.imagen)
        templateCard.querySelector(".btn-dark").dataset.id = producto.id
        templateCard.querySelector(".descripcion-producto").textContent = producto.descripcion
        
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
    
  }


  const addCarrito = e => {
    // console.log(e.target.classList.contains("btn-dark"));
    if (e.target.classList.contains("btn-dark")){
        setcarrito(e.target.parentElement)
    
    }



    e.stopPropagation()
  }

  const setcarrito = objeto => {
    const producto ={
        id: objeto.querySelector(".btn-dark").dataset.id,
        titulo: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        unidades:1
    }
    
    if (carrito.hasOwnProperty(producto.id)) {
        producto.unidades = carrito [producto.id].unidades + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
  }

  const pintarCarrito = () => {
    // console.log(carrito);
    items.innerHTML = ""
   
    Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector("th").textContent = producto.id
    templateCarrito.querySelectorAll("td")[0].textContent = producto.titulo
    templateCarrito.querySelectorAll("td")[1].textContent = producto.unidades
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
    templateCarrito.querySelector("span").textContent = producto.unidades * producto.precio



    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)


   })
   items.appendChild(fragment)

   pintarFooter()

   localStorage.setItem("carrito", JSON.stringify(carrito))
  }

  const pintarFooter = () => {
    footer.innerHTML= ""
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const numeroDeUnidades = Object.values(carrito).reduce((acc, {unidades}) => acc + unidades,0)
    const numeroDePrecios = Object.values(carrito).reduce ((acc, {unidades, precio}) => acc + unidades * precio, 0)
    // console.log(numeroDeUnidades, numeroDePrecios);

    templateFooter.querySelectorAll("td")[0].textContent = numeroDeUnidades
    templateFooter.querySelector("span").textContent = numeroDePrecios

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciarCarrito = document.getElementById("vaciar-carrito")
    btnVaciarCarrito.addEventListener("click", () => {
        carrito ={}
        pintarCarrito()
    })



  }

  const btnAccion = e => {
    if(e.target.classList.contains("btn-info")){
        const producto= carrito[e.target.dataset.id]
        producto.unidades++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains("btn-danger")){
        const producto= carrito[e.target.dataset.id]
        producto.unidades--
        if(producto.unidades === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
  }
  e.stopPropagation
}

