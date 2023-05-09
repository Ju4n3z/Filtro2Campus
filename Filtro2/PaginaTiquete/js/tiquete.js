let cliente = {}
let validacion = 0;
let port = 4444;
let myForm = document.querySelector("#form");
let buscar = document.querySelector("#buscar"); //Función para obtener los datos del formulario
myForm.addEventListener("submit", (e)=>{ 
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    opc[e.submitter.dataset.accion](data)    
})

let myForm2 = document.querySelector("#form2");  //Función para obtener los datos del segundo formulario
myForm2.addEventListener("submit", (e)=>{
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    data.identificacion = cliente.identificacion
    data.nombres = cliente.nombres
    data.apellidos = cliente.apellidos
    data.correo = cliente.correo
    opc[e.submitter.dataset.accion](data)    
})

let myForm3 = document.querySelector("#form3");  //Función para obtener los datos del tercer formulario
myForm3.addEventListener("submit", (e)=>{
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    cliente.origen = data.origen;
    cliente.destino = data.destino;
    opc[e.submitter.dataset.accion](data)    
})

const opc = {
    "GET": () => getUser(),
    "PUT": (data) => putUser(data),
    "DELETE": (data) => deleteUser(data),
    "SEARCH": (data) => searchUser(data),
    "POST": (cliente) => postUserCliente(cliente),
    "POSTN": (data) => postUserNuevo(data)
}

let config = {
    headers:new Headers({
        "Content-Type": "application/json"
    }), 
};

const getUser = async()=>{ //Función para obtener todos los clientes
    config.method = "GET";
    let res = await ( await fetch(`http://localhost:${port}/clientes`,config)).json();
}


const searchUser = async(data)=>{ //Función para buscar un cliente con la identificación y si no está registrado, se registra
    config.method = "GET";
    let res = await ( await fetch(`http://localhost:${port}/clientes?q=${Object.values(data).join("")}`,config)).json();
    if(res.length !=0){
        res.forEach(element => {
            if (element.identificacion == data.identificacion){
                cliente.identificacion = element.identificacion
                cliente.nombres = element.nombres
                cliente.apellidos = element.apellidos
                cliente.correo = element.correo
                validacion = 1;
            }
        })
        if (validacion == 1){
        myForm.setAttribute("style", "display: none");
        let myForm2 = document.querySelector("#form2");
        myForm2.removeAttribute("style");
        } else {
            alert("El usuario no existe")
            myForm.setAttribute("style", "display: none");
            let myForm3 = document.querySelector("#form3");
            myForm3.removeAttribute("style");
        }
    }
}


const getUserAll = (async()=>{ //Función para mostrar todas las rutas
    let tablaHTML = document.querySelector("#tablaruta");
    let tbody = document.querySelector("#tbodyrutas");
    config.method = "GET";
    let i = 0;
    let res = await ( await fetch(`http://localhost:${port}/rutas`,config)).json();
    if(res.length !=0){
        tablaHTML.removeAttribute("style");
        res.forEach(element => {
            tabla = `
            <tr>
                <th scope="row">${i+1}</th>
                <td>${element.id}</td>
                <td>${element.nombre}</td>
                <td id="${i+1}o">${element.origen}</td>
                <td id="${i+1}d">${element.destino}</td>
                <td>${element.total}</td>
                <td>${element.valor}</td>
                <td id="pagar">${(parseInt(element.total)*parseInt(element.valor)+(parseInt(element.total)*parseInt(element.valor)*0.05)*1.16)}</td>
            </tr>      
            `
            tbody.insertAdjacentHTML("beforeend",tabla);
            i++;
        });
    } 
})()

const getUserAlltiquetes = (async()=>{ //Función para mostrar todos los tiquetes
    let tablaHTML = document.querySelector("#tabla");
    let tbody = document.querySelector("#tbody");
    config.method = "GET";
    let i = 0;
    let res = await ( await fetch(`http://localhost:${port}/tiquete`,config)).json();
    let res2 = await ( await fetch(`http://localhost:${port}/rutas`,config)).json();
    if(res.length !=0){
        tablaHTML.removeAttribute("style");
        res.forEach(element => {
            res2.forEach(element2 => {
                if (element.origen == element2.origen && element.destino == element2.destino){
                    tabla = `
            <tr>
                <th scope="row">${i+1}</th>
                <td>${element.identificacion}</td>
                <td>${element.nombres}</td>
                <td>${element.apellidos}</td>
                <td>${element.origen}</td>
                <td>${element.destino}</td>
                <td>${(parseInt(element2.total)*parseInt(element2.valor)+(parseInt(element2.total)*parseInt(element2.valor)*0.05)*1.16)}</td>
                <td><button onclick="deleteUser(${element.id})" class="btn btn-primary mb-3">-</button></td>
            </tr>      
            `
            tbody.insertAdjacentHTML("beforeend",tabla);
            i++;
                }
            });

        });
    } 
})()

const postUserCliente = async(cliente)=>{ //Función para crear un tiquete estando registrado en los clientes
    config.method = "POST";
    config.body = JSON.stringify(cliente);
    let res = await ( await fetch(`http://localhost:${port}/tiquete`,config)).json();
    console.log(res);
}

const postUserNuevo = async(data)=>{ //Función para crear un tiquete sin estar registrado en los clientes
    config.method = "POSTN";
    config.body = JSON.stringify(data);
    let res = await ( await fetch(`http://localhost:${port}/tiquete`,config)).json();
    console.log(res);
}

const deleteUser = async(id)=>{ //Función para eliminar un tiquete
    config.method = "DELETE";
    let res = await ( await fetch(`http://localhost:${port}/tiquete/${id}`,config)).json();
    console.log(res);
}
