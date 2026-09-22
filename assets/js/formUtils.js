/**
 * Utilidades y funciones compartidas para formularios
 * Utilizado por: form-receta.js, form-calculo.js
 */

// ==================== FORMATTERS ====================
const integerFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
});

const decimal2Formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const decimal3Formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
});

const decimal4Formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
});

const decimal6Formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
});

// ==================== FUNCIONES DE FORMATO ====================
function formatInt(value) {
    return integerFormatter.format(Number(value) || 0);
}

function format2(value) {
    return decimal2Formatter.format(Number(value) || 0);
}

function format3(value) {
    return decimal3Formatter.format(Number(value) || 0);
}

function format4(value) {
    return decimal4Formatter.format(Number(value) || 0);
}

function format6(value) {
    return decimal6Formatter.format(Number(value) || 0);
}

function formatDecimal(value, maxDecimals = 6) {
    const num = Number(value) || 0;
    const str = num.toString();
    
    // Si es notación científica, convertir
    if (str.includes('e')) {
        return num.toFixed(maxDecimals).replace(/\.?0+$/, '');
    }
    
    // Obtener la parte decimal
    const parts = str.split('.');
    if (!parts[1]) return num.toFixed(2); // Sin decimales, mostrar 2
    
    const decimals = parts[1];
    const significantDecimals = decimals.replace(/0+$/, ''); // Eliminar ceros al final
    
    // Si no hay decimales significativos, mostrar 2
    if (!significantDecimals) return num.toFixed(2);
    
    // Si hay decimales significativos, mostrar hasta 6
    const decimalPlaces = Math.min(significantDecimals.length, maxDecimals);
    return num.toFixed(decimalPlaces);
}

// ==================== FUNCIONES UTILITARIAS ====================
function getRandomLogo() {
    const n = Math.floor(Math.random() * 9) + 1; // 1 al 9
    return `assets/images/products/logo/logo-${n}.svg`;
}

function itemAlreadyAdded(tbody, itemId) {
    return [...tbody.querySelectorAll("tr")]
        .some(tr => tr.dataset.itemId == itemId);
}

// ==================== FUNCIONES DE VALIDACIÓN ====================
function validarDescripcion(descripcion) {
    return descripcion && descripcion.trim() && descripcion.trim() !== "-";
}

function validarPeso(peso) {
    const pesoRaw = peso;
    const pesoTexto = pesoRaw !== null && pesoRaw !== undefined && String(pesoRaw).trim() !== ""
        ? String(pesoRaw).trim()
        : "";
    return pesoTexto;
}

function getPesoColor(peso) {
    const pesoNumero = Number(peso);
    return !Number.isNaN(pesoNumero) && pesoNumero === 0
        ? "text-danger"
        : "text-primary";
}

// ==================== FUNCIONES DE CÁLCULO (form-calculo.js) ====================
function normalizarPais(pais) {
    return pais && pais.toString().trim().toUpperCase() === "USA"
        ? "USA"
        : "CHINA";
}

function getMargenByGrupo(grupo) {
    if (!grupo) return 0.32;
    const match = grupo.toString().match(/\d+/);
    if (!match) return 0.32;

    return ({
        0: 0.00,
        1: 0.15,
        2: 0.25,
        3: 0.28,
        4: 0.30,
        5: 0.31,
        6: 0.33,
        7: 0.35,
        8: 0.36,
        9: 0.40,
        10: 0.45,
        11: 0.50,
        12: 0.55
    })[parseInt(match[0], 10)] ?? 0.32;
}

function getPesoPorPais(tbody) {
    const pesos = {};
    tbody.querySelectorAll("tr").forEach(tr => {
        const qty  = parseInt(tr.querySelector("input").value);
        const peso = parseFloat(tr.dataset.peso);
        const pais = normalizarPais(tr.dataset.pais);

        if (!pesos[pais]) pesos[pais] = 0;
        pesos[pais] += peso * qty;
    });
    return pesos;
}

function getTotalPesoActual(tbody) {
    let total = 0;
    tbody.querySelectorAll("tr").forEach(tr => {
        const qty  = parseInt(tr.querySelector("input").value);
        const peso = parseFloat(tr.dataset.peso);
        total += peso * qty;
    });
    return total;
}

// ==================== FUNCIONES DE NEGOCIO ====================
function calcularGasto(totalFob, gastoTable) {
    if (gastoTable.length === 0) return 0;

    for (const row of gastoTable) {
        const min = parseFloat(row.valor_inicial);
        const max = parseFloat(row.valor_final);

        if (totalFob >= min && totalFob <= max) {
            return parseFloat(row.costo);
        }
    }

    return parseFloat(gastoTable[gastoTable.length - 1].costo);
}

function calcularFletePorPais(pais, pesoTotal, fleteTable) {
    const paisCalc = normalizarPais(pais);
    let tarifas = fleteTable.filter(r => r.pais === paisCalc);

    if (tarifas.length === 0) {
        tarifas = fleteTable.filter(r => r.pais === "CHINA");
    }

    tarifas.sort((a, b) => parseFloat(a.peso) - parseFloat(b.peso));

    for (const row of tarifas) {
        if (pesoTotal <= parseFloat(row.peso)) {
            return parseFloat(row.flete);
        }
    }

    return parseFloat(tarifas[tarifas.length - 1].flete);
}

// ==================== UTILIDAD DE REDONDEO ====================
function decimalAdjust(type, value, exp) {
    // Shift
    value = +value;
    exp = +exp;
    if (exp === undefined || +exp === 0) {
        return Math.round(value);
    }
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
