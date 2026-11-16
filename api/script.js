async function comprobarConexion() {

    const estado = document.querySelector("#estadoConexion");

    try {

        const respuesta = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.6&longitude=-58.4&current=temperature_2m");

        if (respuesta.ok) {
            estado.textContent = "Conexión exitosa con la API";
            estado.className = "estado-conexion exito";
        } else {
            estado.textContent = "Error al conectar con la API";
            estado.className = "estado-conexion error";
        }

    } catch (error) {

        estado.textContent = "No se pudo conectar con la API";
        estado.className = "estado-conexion error";
        console.log(error);
    }
}

async function buscarClima() {

    const ciudad = document.querySelector("#ciudad").value.trim();

    if (ciudad === "") {
        document.querySelector("#resultado").textContent = "Ingresá una ciudad.";
        return;
    }

    try {

        const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es&format=json`;

        const responseGeo = await fetch(urlGeo);
        const datosGeo = await responseGeo.json();

        if (!datosGeo.results || datosGeo.results.length === 0) {
            document.querySelector("#resultado").textContent = "No se encontró la ciudad.";
            return;
        }

        const latitud = datosGeo.results[0].latitude;
        const longitud = datosGeo.results[0].longitude;

        const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;

        const codigoPais = datosGeo.results[0].country_code.toLowerCase();

        const responseClima = await fetch(urlClima);
        const datosClima = await responseClima.json();

        const clima = datosClima.current;

        const resultado = document.querySelector("#resultado");
        resultado.innerHTML = "";

        const titulo = document.createElement("h2");
        const bandera = document.createElement("img");
        const temperatura = document.createElement("h3");
        const humedad = document.createElement("p");
        const viento = document.createElement("p");

        titulo.textContent = datosGeo.results[0].name + ", " + datosGeo.results[0].country;
        bandera.src = `https://flagcdn.com/w80/${codigoPais}.png`;
        bandera.alt = "Bandera de " + datosGeo.results[0].country;
        temperatura.textContent = "Temperatura: " + clima.temperature_2m + " °C";
        humedad.textContent = "Humedad: " + clima.relative_humidity_2m + " %";
        viento.textContent = "Velocidad del viento: " + clima.wind_speed_10m + " km/h";

        resultado.appendChild(titulo);
        resultado.appendChild(bandera);
        resultado.appendChild(temperatura);
        resultado.appendChild(humedad);
        resultado.appendChild(viento);

    } catch (error) {

        document.querySelector("#resultado").textContent =
            "Error al conectar con la API. Revisá tu conexión a Internet.";
        console.log(error);
    }
}

comprobarConexion();
