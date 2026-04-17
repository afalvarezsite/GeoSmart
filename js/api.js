/**
 * Servicio para obtener datos de la REST Countries API
 */
const BASE_URL = 'https://restcountries.com/v3.1';

export const fetchAllCountries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/all?fields=name,capital,flags,population,currencies,cca3,translations`);
        if (!response.ok) throw new Error('Error al cargar datos');
        const data = await response.json();
        
        // Mapeamos para simplificar el acceso al nombre en español
        return data.map(country => ({
            ...country,
            nombreEs: country.translations?.spa?.common || country.name.common
        }));
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};
