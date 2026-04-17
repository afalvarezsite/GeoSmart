import { renderMenu } from './ui.js';
import { state, loadSettings } from './state.js';
import { fetchAllCountries } from './api.js';

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Cargamos la configuración del usuario
    loadSettings();
    
    // Mostramos el menú (en estado de carga)
    renderMenu();

    try {
        // Cargamos los datos
        const countries = await fetchAllCountries();
        state.countries = countries;
        state.loading = false;
        
        // Actualizamos el menú con los datos cargados
        renderMenu();
        console.log(`${countries.length} países cargados correctamente.`);
    } catch (error) {
        state.loading = false;
        state.error = "Error al conectar con el servidor. Por favor, revisa tu conexión.";
        renderMenu();
    }
});
