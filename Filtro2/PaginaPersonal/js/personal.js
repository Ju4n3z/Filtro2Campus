let port = 4444;
let myForm = document.querySelector("#form");
let buscar = document.querySelector("#buscar");
myForm.addEventListener("submit", (e)=>{  //Función para obtener los datos del formulario
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

const getUserAll = (async()=>{ //Función para obtener todos los empleados
    let tablaHTML = document.querySelector("#tabla");
    let tbody = document.querySelector("#tbody");
    let cantidad = document.querySelector("#cantidad");
    let i=0;
    config.method = "GET";
    let res = await ( await fetch(`http://localhost:${port}/personal`,config)).json();
    if(res.length !=0){
        tablaHTML.removeAttribute("style");
        res.forEach(element => {
            tabla = `
            <tr>
                <th scope="row">${i+1}</th>
                <td>${element.numero}</td>
                <td>${element.nombres}</td>
                <td>${element.apellidos}</td>
                <td>${element.correo}</td>
                <td>${element.telefono}</td>
                <td>${element.profesion}</td>
                <td><button onclick="deleteUser(${element.id})" class="btn btn-primary mb-3">-</button></td>
            </tr>      
            `
            numero = `Cantidad de empleados = ${i+1}`
            cantidad.innerHTML = numero;
            tbody.insertAdjacentHTML("beforeend",tabla);
            i++;
        });
    } else {
        numero = `Cantidad de empleados = ${i}`
        cantidad.innerHTML = numero;
    }
})()

const postUser = async(data)=>{ //Función para agregar un empleado
    config.method = "POST";
    config.body = JSON.stringify(data);
    let res = await ( await fetch(`http://localhost:${port}/personal`,config)).json();
    console.log(res);
}

const deleteUser = async(id)=>{ //Función para eliminar un empleado
    config.method = "DELETE";
    let res = await ( await fetch(`http://localhost:${port}/personal/${id}`,config)).json();
    console.log(res);
}
