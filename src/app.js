const API_URL = "https://rickandmortyapi.com/api/character";

// Campos de filtro: id del input/select en el HTML -> nombre del parámetro de la API
const FILTERS = ["name", "status", "species", "type", "gender"];

const resultsEl = document.getElementById("results");
const statusEl = document.getElementById("status-message");
const errorEl = document.getElementById("error-message");
const btnAll = document.getElementById("btn-all");
const btnSearch = document.getElementById("btn-search");

// --- Helpers de UI ---------------------------------------------------------

function setStatus(message) {
    statusEl.textContent = message;
}

function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    console.error("[error]", message);
}

function clearError() {
    errorEl.textContent = "";
    errorEl.hidden = true;
}

function setLoading(isLoading) {
    btnAll.disabled = isLoading;
    btnSearch.disabled = isLoading;
}

// --- Lógica de datos -------------------------------------------------------

// Lee los filtros del DOM y devuelve solo los que tienen un valor cargado.
function readFilters() {
    const params = {};
    FILTERS.forEach((id) => {
        const value = document.getElementById(`filter-${id}`).value.trim();
        if (value) params[id] = value;
    });
    return params;
}

// Realiza la request a la API. Centraliza el manejo de errores y logs.
async function fetchCharacters(params) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_URL}?${query}` : API_URL;
    console.info("[request] GET", url);

    const response = await fetch(url);
    console.info("[response]", response.status, response.statusText);

    // La API responde 404 cuando ningún personaje coincide con los filtros.
    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error(`La API respondió con estado ${response.status}.`);
    }

    const data = await response.json();
    console.info("[data] personajes recibidos:", data.results ? data.results.length : 0);
    return data.results || [];
}

// --- Render ----------------------------------------------------------------

function statusDotClass(status) {
    const value = (status || "").toLowerCase();
    if (value === "alive") return "dot-alive";
    if (value === "dead") return "dot-dead";
    return "dot-unknown";
}

function renderCharacters(characters) {
    characters.forEach((character) => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}" loading="lazy" />
            <div class="card-body">
                <h2>${character.name}</h2>
                <p>
                    <span class="dot ${statusDotClass(character.status)}"></span>
                    ${character.status} - ${character.species}
                </p>
                <p><span class="label">Género:</span> ${character.gender}</p>
                <p><span class="label">Origen:</span> ${character.origin.name}</p>
            </div>
        `;
        resultsEl.appendChild(card);
    });
}

// --- Flujo principal -------------------------------------------------------

async function loadCharacters(params) {
    clearError();
    resultsEl.innerHTML = "";
    setLoading(true);
    setStatus("Cargando…");

    try {
        const characters = await fetchCharacters(params);

        if (characters.length === 0) {
            setStatus("");
            showError("No se encontraron personajes con esos filtros.");
            return;
        }

        renderCharacters(characters);
        setStatus(`Se encontraron ${characters.length} personajes.`);
    } catch (error) {
        setStatus("");
        // Errores de red (sin conexión, CORS, etc.) caen acá.
        showError(`No se pudo obtener la información: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

btnAll.addEventListener("click", () => {
    console.info("[accion] obtener todos los personajes");
    loadCharacters({});
});

btnSearch.addEventListener("click", () => {
    const params = readFilters();
    console.info("[accion] buscar con filtros", params);
    loadCharacters(params);
});
