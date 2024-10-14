const $ = n => document.querySelector(n);

const $form = $('#formulario');
const $resultado = $('#resultado');
const $ciudad = $('#ciudad');
const $pais = $('#pais');
const $container = $('.container');

document.addEventListener('DOMContentLoaded', ()=> {
    $form.addEventListener('submit', validarForm);
})

function validarForm(e) {
    e.preventDefault();
    
    const ciudad = $ciudad.value.trim();
    const pais = $pais.value;

    if(!ciudad || !pais) {
        printError('Todos los campos son obligatorios');
        return;
    }
    consultarAPI(ciudad, pais);
}
function printError(send, error = true) {
    const confirm = $('.alert');

    if(!confirm) {
        const alerta = document.createElement('div');
        alerta.classList.add('text-white-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'alert');
        error ? alerta.classList.add('error') : alerta.classList.add('success');
        alerta.innerHTML = `
            <strong class="font-bold">${error ? '¡Error!': '¡Completado con Éxito!'}</strong>
            <span class="block">${send}</span>
        `;
        $container.appendChild(alerta);
        setTimeout(()=> {
            alerta.remove();
        }, 2000)
    }
}

function consultarAPI(ciudad, pais) {
    // Key de usuario para ingresar a la base de datos
    const appID = 'fa00fe36398e4c723ab828d0aa9fe3d8';
    // Agregamos los respectivos paramtros a la URL: ciudad, pais y la key para poder ingresar
    // URL antes: https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}
    // URL despúes
    const urlAPI = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;
    
    // Spinner, mientras cargan los datos
    Spinner();

    setTimeout(()=> {
        fetch(urlAPI)
        .then(response => response.json())
        .then(entries => {
            $resultado.innerHTML = '';
            if(entries.cod === '404') {
                printError('Ciudad o país no encontrado');
                return;
            }
            mostrarClima(entries);
            
        });
    }, 2000)
}

function mostrarClima(entries) {
    const {name, main: {temp, temp_min, temp_max}} = entries;
    const deKaC = parseInt(temp - 273.15);
    const min = parseInt(temp_min - 273.15);
    const max = parseInt(temp_max - 273.15);

    // Nombre de la ciudad
    const nameCity = document.createElement('p');
    nameCity.textContent = name;
    nameCity.classList.add('font-bold', 'text-2xl');

    // Temeperatura actual
    const tempActual = document.createElement('p');
    tempActual.innerHTML = `${deKaC} &#8451;`;
    tempActual.classList.add('font-bold', 'text-6xl');

    // Temperatura maxima
    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${max} &#8451;`;
    tempMax.classList.add('text-xl');

    // Temperatura minima
    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451;`;
    tempMin.classList.add('text-xl');

    // Contenedor de temeperatura
    const climaContent = document.createElement('div');
    climaContent.classList.add('text-center', 'text-white');

    climaContent.appendChild(nameCity);
    climaContent.appendChild(tempActual);
    climaContent.appendChild(tempMax);
    climaContent.appendChild(tempMin);

    $resultado.appendChild(climaContent);
}

function Spinner() {
    $resultado.innerHTML = '';
    const spinner = document.createElement('div');
    spinner.classList.add('sk-chase');
    spinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;

    $resultado.appendChild(spinner);

}