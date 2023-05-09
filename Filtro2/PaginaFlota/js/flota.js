let port = 4444;
let myForm = document.querySelector("#form");
let buscar = document.querySelector("#buscar"); 
myForm.addEventListener("submit", (e)=>{ //Función para obtener los datos del formulario
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    opc[e.submitter.dataset.accion](data)    
})

const opc = { //Determinar que función hacer de acuerdo con el botón que se presione
    "GET": () => getUserAll(),
    "GETB": () => getUserBuscar(),
    "PUT": (data) => putUser(data),
    "DELETE": (data) => deleteUser(data),
    "SEARCH": (data) => searchUser(data),
    "POST": (data) => postUser(data)
}

let config = {
    headers:new Headers({
        "Content-Type": "application/json"
    }), 
};

const getUserAll = (async()=>{ //Función para obtener todos los aviones y ponerlos en la tabla de la página
    let tablaHTML = document.querySelector("#tabla");
    let tbody = document.querySelector("#tbody");
    let cantidad = document.querySelector("#cantidad");
    let i=0;
    config.method = "GET";
    let res = await ( await fetch(`http://localhost:${port}/flota`,config)).json();
    if(res.length !=0){
        tablaHTML.removeAttribute("style");
        res.forEach(element => {
            tabla = `
            <tr>
                <th scope="row">${i+1}</th>
                <td>${element.numero}</td>
                <td>${element.cantidad}</td>
                <td>${element.fecha}</td>
                <td>${element.valor}</td>
                <td>${element.matricula}</td>
                <td><button onclick="deleteUser(${element.id})" class="btn btn-primary mb-3">-</button></td>
            </tr>      
            `
            numero = `Cantidad de aviones = ${i+1}`
            cantidad.innerHTML = numero;
            tbody.insertAdjacentHTML("beforeend",tabla);
            i++;
        });
    } else {
        numero = `Cantidad de aviones = ${i}`
        cantidad.innerHTML = numero;
    }
})()

const postUser = async(data)=>{ //Función para registrar un nuevo avión
    config.method = "POST";
    config.body = JSON.stringify(data);
    let res = await ( await fetch(`http://localhost:${port}/flota`,config)).json();
    console.log(res);
}

const deleteUser = async(id)=>{ //Función para eliminar un avión
    config.method = "DELETE";
    let res = await ( await fetch(`http://localhost:${port}/flota/${id}`,config)).json();
    console.log(res);
}
