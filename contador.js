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
            tiempoTotal: `${dias}d ${horas}h ${minutos}m ${segundos}s`,
            ubicacion: document.getElementById("localizacion").textContent,
            timestamp: Date.now()
            
        };
        
        // Guardamos en LocalStorage (convertido a texto JSON)
        localStorage.setItem("ultimaSesion", JSON.stringify(datosSesion));
        descargarDatos(datosSesion);
        location.reload();
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
        time.textContent= "Llevas trabajado: "+ ` dias: ${dias}`+` horas: ${horas}`+` minutos: ${minutos}`+` segundos: ${segundos}`;

       obtenerUbicacion();
      

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

function descargarDatos(datos) {
   /* const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sesion_trabajo_${Date.now()}.json`;
    a.click();*/

    const encabezados = "ID_Sesion, Fecha Inicio, Fecha, Hora, d, h, m, s, Latitud, coordenadas, Longitud, Coordenadas\n";
    const fila = `${datos.timestamp}, ${datos.fechaInicio}, ${datos.fecha},${datos.dias}, ${datos.hora},"${datos.tiempoTotal}","${datos.ubicacion}"\n`;
    
    // Creamos el contenido con un marcador de orden de bytes (BOM) para que Excel reconozca los acentos (UTF-8)
    const contenido = "\uFEFF" + encabezados + fila;
    
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.href = url;
    a.download = `Registro_Trabajo_${datos.fecha.replace(/\//g, '-')}.csv`;
    a.click();

    // Limpieza de memoria
    URL.revokeObjectURL(url);
}