let pasajero = {}
let validacion = 0;
let port = 4444;
let myForm = document.querySelector("#form");

myForm.addEventListener("submit", (e)=>{ //Función para obtener los datos del formulario
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    opc[e.submitter.dataset.accion](data)    
})

let myForm2 = document.querySelector("#form2"); 
myForm2.addEventListener("submit", (e)=>{ //Función para obtener los datos del segundo formulario
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target));
    data.identificacion = pasajero.identificacion
    opc[e.submitter.dataset.accion](data)    
})

const opc = { //Determinar que función hacer de acuerdo con el botón que se presione
    "GET": () => getUser(),
    "PUT": (data) => putUser(data),
    "DELETE": (data) => deleteUser(data),
    "SEARCH": (data) => searchUser(data),
    "POST": (pasajero) => postUserPasajero(pasajero),
    "POSTN": (data) => postUserNuevo(data)
}

let config = {
    headers:new Headers({
        "Content-Type": "application/json"
    }), 
};

const getUser = async()=>{ //Función para obtener todos los pasajeros
    config.method = "GET";
    let res = await ( await fetch(`http://localhost:${port}/pasajeros`,config)).json();
}


const searchUser = async(data)=>{ //Función para buscar un pasajero con la identificación
    config.method = "GET";
    let res = await ( await fetch(`http://localhost:${port}/tiquete?q=${Object.values(data).join("")}`,config)).json();
    if(res.length != 0){
        res.forEach(element => {
            if (data.identificacion !== element.identificacion){
                validacion = 0;
            }else{
                pasajero.identificacion = element.identificacion;
                validacion = 1;
            }
        })
        if (validacion != 1){
            alert("El usuario no existe")
        } else {
            myForm.setAttribute("style", "display: none");
            let myForm2 = document.querySelector("#form2");
            myForm2.removeAttribute("style");
        }
    }
}


const getUserAlltiquetes = (async()=>{ //Función para obtener todos los tiquetes y ponerlos en una tabla
    let tablaHTML = document.querySelector("#tabla");
    let tbody = document.querySelector("#tbody");
    config.method = "GET";
    let i = 0;
    let res = await ( await fetch(`http://localhost:${port}/embarque`,config)).json();
    if(res.length !=0){
        tablaHTML.removeAttribute("style");
        res.forEach(element => {
            tabla = `
            <tr>
                <th scope="row">${i+1}</th>
                <td>${element.identificacion}</td>
                <td>${element.fecha}</td>
            </tr>      
            `
            tbody.insertAdjacentHTML("beforeend",tabla);
            i++;
                })
            };
})()

const postUserPasajero = async(pasajero)=>{ //Función para crear un nuevo pasajero
    config.method = "POST";
    config.body = JSON.stringify(pasajero);
    let res = await ( await fetch(`http://localhost:${port}/embarque`,config)).json();
    console.log(res);
}

const deleteUser = async(id)=>{ //Función para eliminar un pasajero
    config.method = "DELETE";
    let res = await ( await fetch(`http://localhost:${port}/embarque/${id}`,config)).json();
    console.log(res);
}
