import { translateGeo } from './utils.js';
/**
 * Servicio para obtener datos de la REST Countries API
 */
const BASE_URL = 'https://restcountries.com/v3.1';
const WORLD_BANK_URL = 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=300&date=2022';

/**
 * Obtiene el PIB de los países desde el Banco Mundial
 */
const fetchGDPData = async () => {
    try {
        const response = await fetch(WORLD_BANK_URL);
        if (!response.ok) return {};
        const data = await response.json();

        // El Banco Mundial devuelve [metadata, [array_de_datos]]
        if (!Array.isArray(data) || data.length < 2) return {};

        const gdpMap = {};
        data[1].forEach(item => {
            if (item.countryiso3code && item.value) {
                gdpMap[item.countryiso3code] = item.value;
            }
        });
        return gdpMap;
    } catch (error) {
        console.error('World Bank API Error:', error);
        return {};
    }
};

export const fetchAllCountries = async () => {
    try {
        // Ejecutamos ambas peticiones en paralelo para optimizar tiempo
        const [countriesResponse, gdpMap] = await Promise.all([
            fetch(`${BASE_URL}/all?fields=name,capital,flags,population,currencies,cca3,translations,area,continents,subregion`),
            fetchGDPData()
        ]);

        if (!countriesResponse.ok) throw new Error('Error al cargar datos de países');
        const data = await countriesResponse.json();

        // Mapeamos para simplificar el acceso y añadir el PIB
        return data.map(country => ({
            ...country,
            nombreEs: country.translations?.spa?.common || country.name.common,
            continentesEs: country.continents?.map(c => translateGeo(c)) || [],
            subregionEs: translateGeo(country.subregion),
            pib: gdpMap[country.cca3] || null
        }));
    } catch (error) {
        console.error('API Error:', error);
        throw error; // Rethrow to let the UI/Main handle it
    }
};
