/**
 * Utilidades generales para el juego
 */

/**
 * Mezcla un array aleatoriamente (Fisher-Yates)
 */
export const shuffle = (array) => {
    const list = [...array];
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
};

const TRANSLATIONS = {
    // Continentes
    "Africa": "África",
    "Antarctica": "Antártida",
    "Asia": "Asia",
    "Europe": "Europa",
    "North America": "América del Norte",
    "Oceania": "Oceanía",
    "South America": "América del Sur",
    
    // Subregiones
    "Northern Europe": "Europa del Norte",
    "Southern Europe": "Europa del Sur",
    "Western Europe": "Europa Occidental",
    "Eastern Europe": "Europa del Este",
    "Central Europe": "Europa Central",
    "Central America": "América Central",
    "Caribbean": "Caribe",
    "Western Asia": "Asia Occidental",
    "Eastern Asia": "Asia Oriental",
    "South-Eastern Asia": "Sudeste Asiático",
    "Southern Asia": "Asia del Sur",
    "Central Asia": "Asia Central",
    "Northern Africa": "África del Norte",
    "Western Africa": "África Occidental",
    "Eastern Africa": "África Oriental",
    "Southern Africa": "África del Sur",
    "Middle Africa": "África Central",
    "Australia and New Zealand": "Australia y Nueva Zelanda",
    "Melanesia": "Melanesia",
    "Micronesia": "Micronesia",
    "Polynesia": "Polinesia"
};

/**
 * Traduce un término geográfico al español
 */
export const translateGeo = (term) => {
    if (!term) return 'N/A';
    return TRANSLATIONS[term] || term;
};

const CURRENCY_TRANSLATIONS = {
    // A - C
    "Afghan afghani": "Afghani afgano",
    "Albanian lek": "Lek albanés",
    "Algerian dinar": "Dinar argelino",
    "Angolan kwanza": "Kwanza angoleño",
    "Argentine peso": "Peso argentino",
    "Armenian dram": "Dram armenio",
    "Aruban florin": "Florín arubano",
    "Australian dollar": "Dólar australiano",
    "Azerbaijani manat": "Manat azerbaiyano",
    "Bahamian dollar": "Dólar bahameño",
    "Bahraini dinar": "Dinar bahreiní",
    "Bangladeshi taka": "Taka bangladesí",
    "Barbadian dollar": "Dólar de Barbados",
    "Belarusian ruble": "Rublo bielorruso",
    "Belize dollar": "Dólar beliceño",
    "Bermudian dollar": "Dólar de Bermudas",
    "Bhutanese ngultrum": "Ngultrum butanés",
    "Bolivian boliviano": "Boliviano",
    "Bosnia and Herzegovina convertible mark": "Marco convertible",
    "Botswana pula": "Pula",
    "Brazilian real": "Real brasileño",
    "British pound": "Libra esterlina",
    "Brunei dollar": "Dólar de Brunéi",
    "Bulgarian lev": "Lev búlgaro",
    "Burmese kyat": "Kyat birmano",
    "Burundian franc": "Franco burundés",
    "CFP franc": "Franco CFP",
    "Cambodian riel": "Riel camboyano",
    "Canadian dollar": "Dólar canadiense",
    "Cape Verdean escudo": "Escudo caboverdiano",
    "Cayman Islands dollar": "Dólar de las Islas Caimán",
    "Central African CFA franc": "Franco CFA de África Central",
    "Chilean peso": "Peso chileno",
    "Chinese yuan": "Yuan chino",
    "Colombian peso": "Peso colombiano",
    "Comorian franc": "Franco comorense",
    "Congolese franc": "Franco congoleño",
    "Cook Islands dollar": "Dólar de las Islas Cook",
    "Costa Rican colón": "Colón costarricense",
    "Cuban convertible peso": "Peso cubano convertible",
    "Cuban peso": "Peso cubano",
    "Czech koruna": "Corona checa",

    // D - I
    "Danish krone": "Corona danesa",
    "Djiboutian franc": "Franco yibutiano",
    "Dominican peso": "Peso dominicano",
    "Eastern Caribbean dollar": "Dólar del Caribe Oriental",
    "Egyptian pound": "Libra egipcia",
    "Eritrean nakfa": "Nakfa",
    "Ethiopian birr": "Birr etíope",
    "Falkland Islands pound": "Libra de las Islas Malvinas",
    "Faroese króna": "Corona feroesa",
    "Fijian dollar": "Dólar fiyiano",
    "Ghanaian cedi": "Cedi ghanés",
    "Gibraltar pound": "Libra de Gibraltar",
    "Guatemalan quetzal": "Quetzal guatemalteco",
    "Guernsey pound": "Libra de Guernsey",
    "Guinean franc": "Franco guineano",
    "Guyanese dollar": "Dólar guyanés",
    "Haitian gourde": "Gourde haitiano",
    "Honduran lempira": "Lempira hondureño",
    "Hong Kong dollar": "Dólar de Hong Kong",
    "Hungarian forint": "Forinto húngaro",
    "Icelandic króna": "Corona islandesa",
    "Indian rupee": "Rupia india",
    "Indonesian rupiah": "Rupia indonesia",
    "Iranian rial": "Rial iraní",
    "Iraqi dinar": "Dinar iraquí",
    "Israeli new shekel": "Nuevo séquel israelí",

    // J - N
    "Jamaican dollar": "Dólar jamaicano",
    "Japanese yen": "Yen japonés",
    "Jersey pound": "Libra de Jersey",
    "Jordanian dinar": "Dinar jordano",
    "Kazakhstani tenge": "Tenge kazajo",
    "Kenyan shilling": "Chelín keniano",
    "Kiribati dollar": "Dólar de Kiribati",
    "Kuwaiti dinar": "Dinar kuwaití",
    "Kyrgyzstani som": "Som kirguís",
    "Lao kip": "Kip lao",
    "Lebanese pound": "Libra libanesa",
    "Leone": "Leone",
    "Lesotho loti": "Loti",
    "Liberian dollar": "Dólar liberiano",
    "Libyan dinar": "Dinar libio",
    "Macanese pataca": "Pataca de Macao",
    "Malagasy ariary": "Ariary malgache",
    "Malawian kwacha": "Kwacha malauí",
    "Malaysian ringgit": "Ringgit malayo",
    "Maldivian rufiyaa": "Rufiyaa maldiva",
    "Manx pound": "Libra de la Isla de Man",
    "Mauritanian ouguiya": "Ouguiya",
    "Mauritian rupee": "Rupia mauriciana",
    "Mexican peso": "Peso mexicano",
    "Moldovan leu": "Leu moldavo",
    "Mongolian tögrög": "Tugrik mongol",
    "Moroccan dirham": "Dirham marroquí",
    "Mozambican metical": "Metical",
    "Namibian dollar": "Dólar namibio",
    "Nepalese rupee": "Rupia nepalí",
    "Netherlands Antillean guilder": "Florín antillano neerlandés",
    "New Taiwan dollar": "Nuevo dólar taiwanés",
    "New Zealand dollar": "Dólar neozelandés",
    "Nicaraguan córdoba": "Córdoba nicaragüense",
    "Nigerian naira": "Naira nigeriana",
    "North Korean won": "Won norcoreano",
    "Norwegian krone": "Corona noruega",

    // O - S
    "Omani rial": "Rial omaní",
    "Pakistani rupee": "Rupia pakistaní",
    "Panamanian balboa": "Balboa panameño",
    "Papua New Guinean kina": "Kina",
    "Paraguayan guaraní": "Guaraní paraguayo",
    "Peruvian sol": "Sol peruano",
    "Philippine peso": "Peso filipino",
    "Polish złoty": "Zloty polaco",
    "Pound sterling": "Libra esterlina",
    "Qatari riyal": "Rial qatarí",
    "Romanian leu": "Leu rumano",
    "Russian ruble": "Rublo ruso",
    "Rwandan franc": "Franco ruandés",
    "Saint Helena pound": "Libra de Santa Elena",
    "Samoan tālā": "Tala samoano",
    "Saudi riyal": "Rial saudí",
    "Serbian dinar": "Dinar serbio",
    "Seychellois rupee": "Rupia de Seychelles",
    "Singapore dollar": "Dólar de Singapur",
    "Solomon Islands dollar": "Dólar de las Islas Salomón",
    "Somali shilling": "Chelín somalí",
    "South African rand": "Rand sudafricano",
    "South Korean won": "Won surcoreano",
    "South Sudanese pound": "Libra sursudanesa",
    "Sri Lankan rupee": "Rupia de Sri Lanka",
    "Sudanese pound": "Libra sudanesa",
    "Surinamese dollar": "Dólar surinamés",
    "Swazi lilangeni": "Lilangeni",
    "Swedish krona": "Corona sueca",
    "Swiss franc": "Franco suizo",
    "Syrian pound": "Libra siria",
    "São Tomé and Príncipe dobra": "Dobra",

    // T - Z
    "Tajikistani somoni": "Somoni tayiko",
    "Tanzanian shilling": "Chelín tanzano",
    "Thai baht": "Baht tailandés",
    "Tongan paʻanga": "Paʻanga",
    "Trinidad and Tobago dollar": "Dólar de Trinidad y Tobago",
    "Tunisian dinar": "Dinar tunecino",
    "Turkish lira": "Lira turca",
    "Turkmenistan manat": "Manat turcomano",
    "Tuvaluan dollar": "Dólar de Tuvalu",
    "Ugandan shilling": "Chelín ugandés",
    "Ukrainian hryvnia": "Grivna ucraniana",
    "United Arab Emirates dirham": "Dirham de los Emiratos Árabes Unidos",
    "United States dollar": "Dólar estadounidense",
    "Uruguayan peso": "Peso uruguayo",
    "Uzbekistani soʻm": "Som uzbeko",
    "Vanuatu vatu": "Vatu",
    "Venezuelan bolívar soberano": "Bolívar soberano",
    "Vietnamese đồng": "Dong vietnamita",
    "West African CFA franc": "Franco CFA de África Occidental",
    "Yemeni rial": "Rial yemení",
    "Zambian kwacha": "Kwacha zambiano",
    "Zimbabwean dollar": "Dólar zimbabuense",

    // Adicionales
    "dalasi": "Dalasi",
    "denar": "Denar macedonio",
    "euro": "Euro",
    "krone": "Corona",
    "lari": "Lari georgiano",
    "United Kingdom pound": "Libra esterlina",
    "Swiss Franc": "Franco suizo"
};

/**
 * Traduce el nombre de una moneda al español
 */
export const translateCurrency = (name) => {
    if (!name) return 'N/A';
    
    // Normalizar a Capital Case para búsqueda en mapa (pero respetando si el mapa tiene el nombre exacto de la API)
    const normalizedName = name.trim();
    
    // 1. Búsqueda exacta
    if (CURRENCY_TRANSLATIONS[normalizedName]) {
        return CURRENCY_TRANSLATIONS[normalizedName];
    }

    // 2. Búsqueda insensible a mayúsculas
    const lowerName = normalizedName.toLowerCase();
    for (const [key, value] of Object.entries(CURRENCY_TRANSLATIONS)) {
        if (key.toLowerCase() === lowerName) {
            return value;
        }
    }
    
    // 3. Traducciones genéricas si no hay mapa exacto
    let translated = normalizedName;
    translated = translated.replace(/dollar/i, "Dólar");
    translated = translated.replace(/peso/i, "Peso");
    translated = translated.replace(/pound/i, "Libra");
    translated = translated.replace(/rupee/i, "Rupia");
    translated = translated.replace(/franc/i, "Franco");
    translated = translated.replace(/shilling/i, "Chelín");
    translated = translated.replace(/dinar/i, "Dinar");
    translated = translated.replace(/riyal/i, "Rial");
    translated = translated.replace(/rial/i, "Rial");
    translated = translated.replace(/dirham/i, "Dirham");
    translated = translated.replace(/krone|krona|króna/i, "Corona");
    translated = translated.replace(/ruble/i, "Rublo");
    translated = translated.replace(/florin/i, "Florín");
    translated = translated.replace(/guilder/i, "Florín");
    
    // Asegurar que la primera letra sea mayúscula si es una traducción genérica
    return translated.charAt(0).toUpperCase() + translated.slice(1);
};

/**
 * Simplifica el nombre de una moneda eliminando gentilicios y referencias geográficas
 */
export const simplifyCurrency = (name) => {
    if (!name) return 'N/A';
    
    // Regex consolidada para eliminar términos geográficos y gentilicios (incluyendo preposiciones comunes)
    const combinedRegex = / de los Emiratos Árabes Unidos| del Caribe Oriental| de África (Occidental|Central)| de las Islas (Caimán|Cook|Malvinas|Salomón)| de (Barbados|Bermudas|Brunéi|Gibraltar|Guernsey|Jersey|Macao|Santa Elena|Seychelles|Sri Lanka|Singapur)| de la Isla de Man| (estadounidense|macedonio|mauriciana|australiano|canadiense|mexicano|argentino|chileno|colombiano|neozelandés|peruano|uruguayo|cubano|dominicano|paraguayo|boliviano|venezolano|panameño|costarricense|hondureño|guatemalteco|nicaragüense|haitiano|bahameño|jamaiquino|beliceño|fiyiano|guyancés)| (europeo|euro|afgano|albanés|argelino|guyanés|angoleño|armenio|azerbaiyano|bahreiní|bangladesí|bielorruso|butanés|conversion|bosnio|botsuano|brasileño|búlgaro|birmano|burundés|caboverdiano|camboyano|comorense|congoleño|yibutiano|egipcio|eritreo|etíope|feroés|ghanés|guineano|húngaro|islandés|indonesio|iraní|iraquí|israelí|jordano|kazajo|keniano|kuwaití|kirguís|lao|libanés|lesotense|liberiano|libio|malgache|malauí|malayo|maldivo|mauritano|mauriciano|moldavo|mongol|marroquí|mozambiqueño|namibio|nepalí|nigeriano|norcoreano|surcoreano|noruego|omaní|pakistaní|polaco|qatarí|rumano|ruso|ruandés|samoano|saudí|serbio|somalí|sudafricano|sursudanés|sudanés|surinamés|sirio|taiwanés|tayiko|tanzano|tailandés|tongano|tunecino|turcomano|ugandés|ucraniano|uzbeko|vietnamita|yemení|zambiano|zimbabuense)| (Hong Kong|siria|esterlina|suizo|jamaicano|convertible|egipcia|soberano|antillano neerlandés|danesa|nuevo)/gi;
    
    let simplified = name.replace(combinedRegex, '').trim();
    
    // Si después de simplificar queda vacío (ej: "Boliviano" -> ""), volvemos al original
    if (simplified.length < 3) return name;
    
    return simplified;
};

/**
 * Formatea valores de moneda (PIB) a escala legible en español
 */
export const formatCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    
    if (value >= 1.0e12) {
        return (value / 1.0e12).toFixed(2).replace('.', ',') + " Billones $";
    }
    if (value >= 1.0e9) {
        return (value / 1.0e9).toFixed(2).replace('.', ',') + " Mil Mill. $";
    }
    if (value >= 1.0e6) {
        return (value / 1.0e6).toFixed(2).replace('.', ',') + " Millones $";
    }
    
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
};
