import { renderMenu } from './ui.js';
import { state, loadSettings } from './state.js';
import { fetchAllCountries } from './api.js';

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('GeoSmart cargado correctamente');
    
    // Cargamos la configuración del usuario
    loadSettings();
    
    // Mostramos el menú inmediatamente
    renderMenu();

    // Cargamos los datos en segundo plano
    const countries = await fetchAllCountries();
    state.countries = countries;
    console.log(`${countries.length} países cargados en español.`);
});
