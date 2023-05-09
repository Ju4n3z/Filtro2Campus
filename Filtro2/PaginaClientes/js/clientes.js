let port = 4444;
let myForm = document.querySelector("#form"); //Obtener el formulario
let buscar = document.querySelector("#buscar"); //Obtener el segundo formulario
myForm.addEventListener("submit", (e)=>{ //Función para obtener los datos del formulario
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    opc[e.submitter.dataset.accion](data)    
})

buscar.addEventListener("submit", (e)=>{ //Función para obtener los datos del segundo formulario
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    opc[e.submitter.dataset.accion](data)    
})

const opc = { //Determinar que función hacer de acuerdo con el botón que se presione
    "GET": () => getUserAll(),
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

const getUserAll = (async()=>{ //Función que devuelve la tabla con todos los clientes
    let tablaHTML = document.querySelector("#tabla");
    let tbody = document.querySelector("#tbody");
    let cantidad = document.querySelector("#cantidad");
    let i=0;
    config.method = "GET";
    let res = await ( await fetch(`http://localhost:${port}/clientes`,config)).json();
    if(res.length !=0){
        tablaHTML.removeAttribute("style");
        res.forEach(element => {
            tabla = `
            <tr>
                <th scope="row">${i+1}</th>
                <td>${element.identificacion}</td>
                <td>${element.nombres}</td>
                <td>${element.apellidos}</td>
                <td>${element.telefono}</td>
                <td>${element.fecha}</td>
                <td>${element.ciudad}</td>
                <td>${element.pais}</td>
                <td>${element.correo}</td>
                <td><button onclick="deleteUser(${element.id})" class="btn btn-primary mb-3">-</button></td>
            </tr>      
            `
            numero = `Cantidad de clientes = ${i+1}`
            cantidad.innerHTML = numero;
            tbody.insertAdjacentHTML("beforeend",tabla);
            i++;
        });
    } else {
        numero = `Cantidad de clientes = ${i}`
        cantidad.innerHTML = numero;
    }
})()

const postUser = async(data)=>{ //Función que crea un nuevo cliente
    config.method = "POST";
    config.body = JSON.stringify(data);
    let res = await ( await fetch(`http://localhost:${port}/clientes`,config)).json();
    console.log(res);
}

const deleteUser = async(id)=>{ //Función que elimina un cliente
    config.method = "DELETE";
    let res = await ( await fetch(`http://localhost:${port}/clientes/${id}`,config)).json();
    console.log(res);
}


const searchUser = async(data)=>{ //Función que busca por identificación y devuelve la tabla con los datos del cliente
    let tablaHTML = document.querySelector("#tabla");
    let tablaHTML2 = document.querySelector("#tabla2");
    config.method = "GET";
    let res = await ( await fetch(`http://localhost:${port}/clientes?q=${Object.values(data).join("")}`,config)).json();
    if(res.length !=0){
        tablaHTML.setAttribute("style", "display: none");
        res.forEach(element => {
            if (element.identificacion == data.identificacion){
                tablaHTML2.removeAttribute("style");
                tabla = `
                <tr>
                    <th scope="row">1</th>
                    <td>${element.identificacion}</td>
                    <td>${element.nombres}</td>
                    <td>${element.apellidos}</td>
                    <td>${element.telefono}</td>
                    <td>${element.fecha}</td>
                    <td>${element.ciudad}</td>
                    <td>${element.pais}</td>
                    <td>${element.correo}</td>
                </tr>      
                `
                tablaHTML2.insertAdjacentHTML("beforeend",tabla);
            }    
            });
        
    }
}





