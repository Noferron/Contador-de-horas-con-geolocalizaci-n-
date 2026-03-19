
let segundos= 0;
let minutos= 0;
let horas= 0; 
let dias= 0;
let intervalo=null;
const contador=document.getElementById("contador");

contador.addEventListener("click",()=>{
    let fechaInicio= new Date().toLocaleString();
    if(intervalo!==null){
        clearInterval(intervalo);
        intervalo=null;
        contador.textContent="Comenzar";
        
        // --- NUEVA LÓGICA DE GUARDADO ---
        const datosSesion = {
            fechaInicio: fechaInicio,
            fecha: new Date().toLocaleDateString(),
            hora: new Date().toLocaleTimeString(),
            tiempoTotal: ` ${dias}d ${horas}h ${minutos}m ${segundos}s`,
            ubicacion: document.getElementById("localizacion").textContent,
            timestamp: Date.now()
            
        };
        
        // Guardamos en LocalStorage (convertido a texto JSON)
        localStorage.setItem("ultimaSesion", JSON.stringify(datosSesion));
        //descargarDatos(datosSesion);
        //location.reload();

        let historial = JSON.parse(localStorage.getItem("historialTrabajo"))||[];

        historial.push(datosSesion);

        localStorage.setItem("historialTrabajo", JSON.stringify(historial));

        //descargarExcelCompleto(listaSesiones);
        alert("Sesión añadida al historial");

        segundos= 0;
        minutos= 0;
        horas= 0; 
        dias= 0;
        alert("¡Sesión guardada con éxito!");
        return;
       
    }

    contador.textContent="Finalizar";

    intervalo= setInterval(()=>{
    //Coversor de tiempo y formato
    segundos++;
        if(segundos===60){
            minutos+=1;
            segundos=0;
        }
        if(minutos===60){
            horas+=1;
            minutos=0;
        }
        if(horas===24){
            dias+=1;
            horas=0;
        }

        if(segundos>1){
            time.textContent= "Llevas trabajado: " + ` segundos: ${segundos}`;
        }
        if(minutos>1){
            time.textContent= "Llevas trabajado: " + ` minutos: ${minutos}`+` segundos: ${segundos}`;
        }
        if(horas>1){
            time.textContent= "Llevas trabajado: " +` horas: ${horas}`+ ` minutos: ${minutos}`+` segundos: ${segundos}`;
        }
        if(dias>1){
            time.textContent= "Llevas trabajado: "+ ` dias: ${dias}`+` horas: ${horas}`+` minutos: ${minutos}`+` segundos: ${segundos}`;
        }
       

       obtenerUbicacion();
       mostrarHistorial();

        contador.textContent="Finalizar";     
    },1000);
});


function obtenerUbicacion (){
     //Obtención de geolocalización a intervalos de un segundo
        const localizacion=document.getElementById("localizacion");

        const successCallback = (position) => {
            const {latitude,longitude}=position.coords;
        localizacion.textContent=` Latitud ${latitude}, Longitud ${longitude}`;
        };

        const errorCallback = (error) => {
            console.error("Error al obtener la ubicación:", error.message);
        };

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

// function descargarDatos(datos) {
//    /* const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `sesion_trabajo_${Date.now()}.json`;
//     a.click();*/

//     const encabezados = "ID_Sesion, Fecha Inicio, Fecha, d, h, m, s, Latitud, coordenadas, Longitud, Coordenadas\n";
//     const fila = `${datos.timestamp}, ${datos.fechaInicio}, ${datos.fecha},${datos.tiempoTotal},"${datos.ubicacion}"\n`;
    
//     // Creamos el contenido con un marcador de orden de bytes (BOM) para que Excel reconozca los acentos (UTF-8)
//     const contenido = "\uFEFF" + encabezados + fila;
    
//     const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
    
//     a.href = url;
//     a.download = `Registro_Trabajo_${datos.fecha.replace(/\//g, '-')}.csv`;
//     a.click();

//     // Limpieza de memoria
//     URL.revokeObjectURL(url);
// }

const historial= document.getElementById("historial");

historial.addEventListener("click",()=>{
    const historialCompleto = JSON.parse(localStorage.getItem("historialTrabajo"));
    descargarExcelCompleto(historialCompleto);
})

function descargarExcelCompleto(listaSesiones){
    const encabezados = "ID_Sesion, Fecha, Hora,  d, h, m, s, Coordenadas\n";

    if(!listaSesiones||listaSesiones.length===0){
        alert ("No hay sesiones en el historial para descargar");
        return;
    }
    let filas = "";
    listaSesiones.forEach(sesion=>{
        filas+=`${sesion.timestamp};${sesion.fechaInicio};${sesion.tiempoTotal};"${sesion.ubicacion}"\n`;
    })
    const contenido = "\uFEFF" + encabezados + filas;

    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.href = url;
    a.download = `Historial_de_trabajo.csv`;
    a.click();

    // Limpieza de memoria
    URL.revokeObjectURL(url);
}

const borrarHistorial= document.getElementById("borrarHistorial");

borrarHistorial.addEventListener("click",()=>{
    borrarTodo();
})

const borrarSesion= document.getElementById("borrarSesion");

borrarSesion.addEventListener("click",()=>{
    borrarUltimaSesion();
})


const borrarUltimaSesion = () => {
    if(confirm("¿Estás seguro que quieres borrar la última sesión de trabajo?")) {
        localStorage.removeItem("ultimaSesion");
        alert("Última sesión borrada");
    }
}

const borrarTodo= () => {
    if(confirm("¿Estás seguro de que quieres borrar todas las sesiones guardadas?")){
        localStorage.removeItem("historialTrabajo");
        alert("Historial borrado");
    }
}

const verHistorial = document.getElementById("verHistorial");
function mostrarHistorial(){
    const historialCompleto = JSON.parse(localStorage.getItem("historialTrabajo"));
   
    let historial=[];
    
    verHistorial.innerHTML = "";
    historialCompleto.forEach(h=>{
       verHistorial.innerHTML += `
            <div class="sesion">
                <span class="fecha">📅 ${h.fecha || 'Sin fecha'}</span>
                <span class="hora-inicio">🕒 Inicio: ${h.fechaInicio}</span>
                <span class="tiempo-total">⌛ Duración: ${h.tiempoTotal}</span>
                <p class="ubicacion">📍 ${h.ubicacion}</p>
                <small class="id-sesion">ID: ${h.timestamp}</small>
            </div>
        `;
    });
    
}

