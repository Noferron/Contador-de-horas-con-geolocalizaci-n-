let verId=null;
let map=null;
let marker=null;

const inicializarMap=(latitude,longitude)=>{
    if(!map){
        map=L.map("map").setView([latitude,longitude],13);
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: "&copy; OpenStreetMap contributors",
            }
        ).addTo(map);
    }
    if(marker){
        marker.setLatLng([latitude,longitude]);
        map.setView([latitude,longitude]);
    }else{
        marker=L.marker([latitude,longitude]).addTo(map);
    }
}

const successCallback=(position)=>{
    const{latitude,longitude}=position.coords;
    document.getElementById("status").innerText= 
    `Ubicación: Latitud ${latitude}, Longitud ${longitude}`;
    inicializarMap(latitude,longitude);
}

const errorCallback = (error)=>{
    document.getElementById("status").innerText =
    `Error: ${error.message}`;
}

const startTracking = ()=>{
    verId= navigator.geolocation.watchPosition(
        successCallback,
        errorCallback,
        {
            enableHighAccuracy:true,
            timeout:10000,
        }
    );
    document.getElementById("stopButton").disabled=false;
}

const stopTraking = ()=>{
    if(verId!==null){
        navigator.geolocation.clearWatch(verId);
        document.getElementById("status").innerText=
        `Rastreo detenido`;
        document.getElementById("stopButton").disabled =true;
    }
}

document
    .getElementById("contador")
    .addEventListener("click",startTracking);
document
.getElementById("stopButton")
.addEventListener("click", stopTraking);

