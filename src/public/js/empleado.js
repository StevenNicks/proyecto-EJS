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
        console.log('Datos recibidos:', data);
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
                <td colspan="18" class="text-center text-muted py-4">
                    <i data-lucide="clipboard-x" class="me-2" width="20" height="20"></i>
                    No se encontraron resultados
                </td>
            </tr>
        `;
        lucide.createIcons();
        return;
    }

    tbody.innerHTML = resultados.map((resultado, index) => {
        // Preparar el objeto para pasar a la función de gráficas
        const registroGraficas = {
            ...resultado,
            fecha_formateada: formatearFecha(resultado.fecha_creacion || resultado.fecha)
        };
        
        // Escapar comillas dobles para el onclick
        const registroEscapado = JSON.stringify(registroGraficas).replace(/"/g, '&quot;');
        
        return `
        <tr>
            <td>${index + 1}</td>
            <td>${resultado.tamizaje_id || 'N/A'}</td>
            <td>${resultado.tipo_tamizaje || resultado.tamizaje_nombre || 'TAMIZAJE ANUAL'}</td>
            <td>${formatearFecha(resultado.fecha_creacion || resultado.fecha)}</td>
            <td>${resultado.empleado_cedula || resultado.cedula || 'N/A'}</td>
            <td>${resultado.agencia || 'CALI'}</td>
            <td>${resultado.altura || '-'}</td>
            <td>${resultado.peso || '-'}</td>
            <td>${resultado.IMC || '-'}</td>
            <td>${resultado.sistole || '-'}</td>
            <td>${resultado.diastole || '-'}</td>
            <td>${resultado.pulso || '-'}</td>
            <td>${resultado.oxigenacion || '-'}</td>
            <td>${resultado.glucosa || '-'}</td>
            <td>${resultado.temperatura || '-'}</td>
            <!-- ❌ QUITAMOS ESTA LÍNEA: <td>${resultado.observacion || '-'}</td> -->
            <td>${calcularEstadoIMC(resultado.IMC)}</td>
            <td>${resultado.seguimientos || 'No aplica'}</td>
            <td>
                <button class="btn btn-outline-primary btn-sm btn-grafica" 
                        onclick="abrirGraficasRegistro(${registroEscapado})"
                        title="Ver gráficas de este registro">
                    <i data-lucide="bar-chart-3" width="14" height="14"></i>
                    Gráfica
                </button>
            </td>
        </tr>
        `;
    }).join('');

    lucide.createIcons();
}

// ✅ FUNCIÓN PARA CALCULAR ESTADO IMC
function calcularEstadoIMC(imc) {
    if (!imc || imc === '-') return '<span class="badge bg-secondary">N/A</span>';
    
    const imcValue = parseFloat(imc);
    if (isNaN(imcValue)) return '<span class="badge bg-secondary">N/A</span>';
    
    if (imcValue < 18.5) return '<span class="badge bg-info">Bajo peso</span>';
    if (imcValue < 25) return '<span class="badge bg-success">Normal</span>';
    if (imcValue < 30) return '<span class="badge bg-warning">Sobrepeso</span>';
    return '<span class="badge bg-danger">Obesidad</span>';
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
            <td colspan="19" class="text-center text-danger py-4">
                <i data-lucide="alert-circle" class="me-2" width="20" height="20"></i>
                ${mensaje}
            </td>
        </tr>
    `;
    lucide.createIcons();
}