// D:\proyecto-EJS\public\js\empleado.js
document.addEventListener('DOMContentLoaded', function() {
    cargarMisResultados();
});

function cargarMisResultados() {
    fetch('/empleados/mis-resultados/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Datos recibidos:', data); // Depuración de los datos del servidor
        if (data.success) {
            mostrarResultadosEnTabla(data.data);
        } else {
            mostrarError(data.message || 'Error al cargar los resultados');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarError('Error de conexión con el servidor');
    });
}

function mostrarResultadosEnTabla(resultados) {
    const tbody = document.querySelector('#tablaMisResultados tbody');
    
    if (resultados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="14" class="text-center text-muted py-4">
                    <i data-lucide="clipboard-x" class="me-2" width="20" height="20"></i>
                    No se encontraron resultados
                </td>
            </tr>
        `;
        lucide.createIcons();
        return;
    }

    tbody.innerHTML = resultados.map((resultado, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${resultado.tamizaje_id || 'N/A'}</td>
            <td>${resultado.tamizaje_nombre || 'N/A'}</td>
            <td>${formatearFecha(resultado.fecha_creacion)}</td>
            <td>${resultado.altura || '-'}</td>
            <td>${resultado.peso || '-'}</td>
            <td class="imc-color" data-imc="${resultado.IMC || '-'}">${resultado.IMC || '-'}</td>
            <td class="pressure-color" data-sistole="${resultado.sistole || '-'}">${resultado.sistole || '-'}</td>
            <td class="pressure-color" data-diastole="${resultado.diastole || '-'}">${resultado.diastole || '-'}</td>
            <td>${resultado.pulso || '-'}</td>
            <td class="oxygen-color" data-value="${resultado.oxigenacion || '-'}">${resultado.oxigenacion || '-'}</td>
            <td class="glucose-color" data-value="${resultado.glucosa || '-'}">${resultado.glucosa || '-'}</td>
            <td>${resultado.temperatura || '-'}</td>
            <td>${resultado.observacion || '-'}</td>
        </tr>
    `).join('');

    console.log('HTML generado:', tbody.innerHTML); // Depuración del HTML
    aplicarColores();

    lucide.createIcons();
}

function formatearFecha(fechaString) {
    if (!fechaString) return '-';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function mostrarError(mensaje) {
    const tbody = document.querySelector('#tablaMisResultados tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="14" class="text-center text-danger py-4">
                <i data-lucide="alert-circle" class="me-2" width="20" height="20"></i>
                ${mensaje}
            </td>
        </tr>
    `;
    lucide.createIcons();
}

function aplicarColores() {
    // IMC (columna 6)
    const imcCells = document.querySelectorAll('.imc-color');
    console.log('IMC cells found:', imcCells.length);
    imcCells.forEach(cell => {
        const rawImc = cell.getAttribute('data-imc'); // Valor crudo antes de parsear
        console.log('Raw IMC:', rawImc);
        const imc = parseFloat(rawImc) || 0;
        console.log('Parsed IMC:', imc);
        if (!isNaN(imc)) {
            if (imc >= 30) cell.style.backgroundColor = '#ff6347'; // Rojo
            else if (imc >= 25) cell.style.backgroundColor = '#ffa500'; // Naranja
            else if (imc >= 18) cell.style.backgroundColor = '#90ee90'; // Verde
            else cell.style.backgroundColor = ''; // Sin color
        }
    });

    // Presión (columnas 7 y 8)
    const pressureCells = document.querySelectorAll('.pressure-color');
    console.log('Pressure cells found:', pressureCells.length);
    pressureCells.forEach(cell => {
        const rawSistole = cell.getAttribute('data-sistole');
        const rawDiastole = cell.getAttribute('data-diastole');
        console.log('Raw Sistole/Diastole:', rawSistole, rawDiastole);
        const sistole = parseFloat(rawSistole) || 0;
        const diastole = parseFloat(rawDiastole) || 0;
        console.log('Parsed Sistole/Diastole:', sistole, diastole);
        if (!isNaN(sistole) && !isNaN(diastole)) {
            if (sistole >= 140 || diastole >= 90) cell.style.backgroundColor = '#ff6347'; // Rojo
            else cell.style.backgroundColor = ''; // Sin color
        }
    });

    // Oxigenación (columna 10)
    const oxygenCells = document.querySelectorAll('.oxygen-color');
    console.log('Oxygen cells found:', oxygenCells.length);
    oxygenCells.forEach(cell => {
        const rawValue = cell.getAttribute('data-value');
        console.log('Raw Oxygen:', rawValue);
        const value = parseFloat(rawValue) || 0;
        console.log('Parsed Oxygen:', value);
        if (!isNaN(value)) {
            if (value < 92) cell.style.backgroundColor = '#ff6347'; // Rojo
            else if (value >= 95) cell.style.backgroundColor = '#90ee90'; // Verde
            else cell.style.backgroundColor = ''; // Sin color
        }
    });

    // Glucosa (columna 11)
    const glucoseCells = document.querySelectorAll('.glucose-color');
    console.log('Glucose cells found:', glucoseCells.length);
    glucoseCells.forEach(cell => {
        const rawValue = cell.getAttribute('data-value');
        console.log('Raw Glucose:', rawValue);
        const value = parseFloat(rawValue) || 0;
        console.log('Parsed Glucose:', value);
        if (!isNaN(value)) {
            if (value >= 200) cell.style.backgroundColor = '#ff6347'; // Rojo
            else if (value >= 70 && value < 100) cell.style.backgroundColor = '#90ee90'; // Verde
            else cell.style.backgroundColor = ''; // Sin color
        }
    });
}