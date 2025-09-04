const secciones = [
  "Crimen Organizado", "Muertes Violentas", "Alta Complejidad",
  "Aseguramiento Evidencia", "Delitos Económicos", "Apoyo Operativo",
  "Artefactos Explosivos", "Invest. contra DD.HH", "Análisis Criminal",
  "Jefatura Operaciones", "Ciberdelitos", "Medio Ambiente",
  "Equipo Especial", "Plana Mayor", "Capitanes", "Tenientes"
];

const columnas = [
  "Dotación", "Forman", "Falta", "Servicio", "Franco", "Feriado", "Autorizado",
  "Permiso", "Licencia", "Com. Serv.", "Agregado", "Sin Motivo", "Otros"
];

const principales = ["Dotación", "Forman", "Falta"];
const camposCalculables = ["Servicio", "Franco", "Feriado", "Autorizado", "Permiso", "Licencia", "Com. Serv.", "Agregado", "Sin Motivo", "Otros"];

let datos = {};

function esNuevoDia() {
  const hoy = new Date().toDateString();
  const ultimoDia = localStorage.getItem("ultimoDia");
  return ultimoDia !== hoy;
}

function actualizarFecha() {
  const hoy = new Date().toDateString();
  localStorage.setItem("ultimoDia", hoy);
}

function inicializarDatos() {
  if (esNuevoDia()) {
    localStorage.removeItem("cuentaDiaria");
    datos = {};
  }

  const datosGuardados = localStorage.getItem("cuentaDiaria");
  if (datosGuardados) {
    try {
      datos = JSON.parse(datosGuardados);
    } catch (e) {
      console.error("Error al cargar datos:", e);
      datos = {};
    }
  }

  secciones.forEach(seccion => {
    if (!datos[seccion]) {
      datos[seccion] = {};
    }
    columnas.forEach(col => {
      if (datos[seccion][col] === undefined) {
        datos[seccion][col] = '';
      }
    });
  });
  actualizarFecha();
}

function guardar(seccion, columna, valor) {
  if (!datos[seccion]) datos[seccion] = {};

  const numValor = parseInt(valor) || 0;

  if (columna === 'Dotación') {
    datos[seccion][columna] = numValor;
    const forman = parseInt(datos[seccion]['Forman']) || 0;
    const falta = Math.max(0, numValor - forman);
    datos[seccion]['Falta'] = falta;

    const faltaInput = document.querySelector(`input[data-seccion="${seccion}"][data-columna="Falta"]`);
    if (faltaInput) faltaInput.value = falta;

    localStorage.setItem("cuentaDiaria", JSON.stringify(datos));
    actualizarTotalSeccion(seccion);
    actualizarTotalGeneral();
  } else if (columna === 'Forman') {
    datos[seccion][columna] = numValor;
    const dotacion = parseInt(datos[seccion]['Dotación']) || 0;
    const falta = Math.max(0, dotacion - numValor);
    datos[seccion]['Falta'] = falta;

    const faltaInput = document.querySelector(`input[data-seccion="${seccion}"][data-columna="Falta"]`);
    if (faltaInput) faltaInput.value = falta;

    localStorage.setItem("cuentaDiaria", JSON.stringify(datos));
    actualizarTotalSeccion(seccion);
    actualizarTotalGeneral();
  } else {
    datos[seccion][columna] = numValor;
    localStorage.setItem("cuentaDiaria", JSON.stringify(datos));
  }
}

function actualizarTotalSeccion(seccion) {
  const total = parseInt(datos[seccion]['Forman']) || 0;
  const spanTotal = document.getElementById(`total-${seccion}`);
  if (spanTotal) {
    spanTotal.innerText = total;
  }
}

function actualizarTotalGeneral() {
  let totalGeneral = 0;
  secciones.forEach(sec => {
    if (datos[sec]) {
      totalGeneral += parseInt(datos[sec]['Forman']) || 0;
    }
  });
  const elementoTotal = document.getElementById("totalGeneral");
  if (elementoTotal) {
    elementoTotal.innerText = totalGeneral;
  }
}

function actualizarTotales() {
  secciones.forEach(seccion => {
    actualizarTotalSeccion(seccion);
  });
  actualizarTotalGeneral();
}

function resetear() {
  if (confirm("¿Seguro que deseas borrar todos los datos del día actual?")) {
    datos = {};
    localStorage.removeItem("cuentaDiaria");
    secciones.forEach(seccion => {
      datos[seccion] = {};
      columnas.forEach(col => {
        datos[seccion][col] = '';
      });
    });
    const inputs = document.querySelectorAll('.input-control');
    inputs.forEach(input => {
      input.value = '';
      input.value = 0;
    });
    secciones.forEach(seccion => {
      const spanTotal = document.getElementById(`total-${seccion}`);
      if (spanTotal) {
        spanTotal.innerText = 0;
      }
    });
    const elementoTotal = document.getElementById("totalGeneral");
    if (elementoTotal) {
      elementoTotal.innerText = 0;
    }
    actualizarFecha();
    alert("✅ Datos reiniciados correctamente");
  }
}

function crearInput(seccion, columna) {
  const div = document.createElement("div");
  div.className = "input-field";
  const valor = datos[seccion]?.[columna] || '';
  const esCalculado = columna === 'Falta';
  const readonlyAttr = esCalculado ? 'readonly' : '';
  const readonlyClass = esCalculado ? 'readonly' : '';
  div.innerHTML = `
    <div class="input-label">${columna}</div>
    <input type="number" 
           inputmode="numeric" 
           pattern="[0-9]*"
           data-seccion="${seccion}"
           data-columna="${columna}"
           class="input-control ${readonlyClass}"
           value="${valor}"
           ${readonlyAttr}
           onchange="guardar('${seccion}','${columna}',this.value)" />
  `;
  return div;
}

function crearInputs(seccion, columnas, contenedor) {
  columnas.forEach(col => {
    const inputDiv = crearInput(seccion, col);
    contenedor.appendChild(inputDiv);
  });
}

function abrirInforme() {
  generarInforme();
  document.getElementById('modalInforme').style.display = 'block';
}

function cerrarInforme() {
  document.getElementById('modalInforme').style.display = 'none';
}

function generarInforme() {
  const ahora = new Date();
  document.getElementById('fechaInforme').textContent =
    ahora.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  let totalDotacion = 0;
  let totalFormando = 0;
  let totalAusente = 0;
  let ausentismoPorTipo = {};

  const tiposAusencia = ["Servicio", "Franco", "Feriado", "Autorizado", "Permiso", "Licencia", "Com. Serv.", "Agregado", "Sin Motivo", "Otros"];
  tiposAusencia.forEach(tipo => {
    ausentismoPorTipo[tipo] = 0;
  });

  const datosDetalle = [];

  secciones.forEach(seccion => {
    const datoSeccion = datos[seccion] || {};
    const dotacion = parseInt(datoSeccion['Dotación']) || 0;
    const formando = parseInt(datoSeccion['Forman']) || 0;
    const ausente = parseInt(datoSeccion['Falta']) || 0;
    totalDotacion += dotacion;
    totalFormando += formando;
    totalAusente += ausente;

    tiposAusencia.forEach(tipo => {
      ausentismoPorTipo[tipo] += parseInt(datoSeccion[tipo]) || 0;
    });

    const porcentajeOperativo = dotacion > 0 ? (formando / dotacion * 100) : 0;
    let estado = 'ÓPTIMO';
    let statusClass = 'status-optimo';
    if (porcentajeOperativo < 70) {
      estado = 'CRÍTICO';
      statusClass = 'status-critico';
    } else if (porcentajeOperativo < 85) {
      estado = 'ACEPTABLE';
      statusClass = 'status-aceptable';
    }
    datosDetalle.push({ seccion, dotacion, formando, ausente, porcentajeOperativo: porcentajeOperativo.toFixed(1), estado, statusClass });
  });

  const porcentajeGeneral = totalDotacion > 0 ? (totalFormando / totalDotacion * 100) : 0;

  let htmlInforme = `
    <div class="informe-resumen">
      <div class="stat-card">
        <div class="stat-number">${totalDotacion}</div>
        <div class="stat-label">Total Dotación</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: var(--success);">${totalFormando}</div>
        <div class="stat-label">Personal Formando</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: var(--danger);">${totalAusente}</div>
        <div class="stat-label">Personal Ausente</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: var(--primary);">${porcentajeGeneral.toFixed(1)}%</div>
        <div class="stat-label">Efectividad Operacional</div>
      </div>
    </div>
    
    <div class="informe-detalle">
      <div class="card-detail">
        <h3>Detalle por Secciones</h3>
        <table>
          <thead>
            <tr>
              <th>Sección</th>
              <th>Dotación</th>
              <th>Formando</th>
              <th>Falta</th>
              <th>% Op.</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${datosDetalle.map(d => `
              <tr>
                <td>${d.seccion}</td>
                <td>${d.dotacion}</td>
                <td>${d.formando}</td>
                <td>${d.ausente}</td>
                <td>${d.porcentajeOperativo}%</td>
                <td class="status-cell ${d.statusClass}">${d.estado}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="informe-ausentismo">
      <h3>Resumen de Ausentismo</h3>
      <ul>
        ${Object.keys(ausentismoPorTipo).map(tipo => `
          <li><strong>${tipo}:</strong> ${ausentismoPorTipo[tipo]}</li>
        `).join('')}
      </ul>
    </div>
  `;
  document.getElementById('contenidoInforme').innerHTML = htmlInforme;
}

// Función mejorada para exportar PDF
function exportarPDF() {
  const btn = document.querySelector('.export-pdf-btn');
  const originalText = btn.innerHTML;
  
  // Mostrar loading
  btn.innerHTML = '<span class="loading"></span> Generando PDF...';
  btn.disabled = true;
  
  setTimeout(() => {
    const elemento = document.getElementById('pdfContainer');
    if (typeof window.jsPDF === 'undefined') {
      console.error('jsPDF no está cargado correctamente');
      console.log('window.jspdf:', window.jspdf);
      alert('Error: No se pudo cargar la biblioteca de PDF. Por favor, recarga la página.');
      btn.innerHTML = originalText;
      btn.disabled = false;
      return;
    }
    
    // Hacer visible temporalmente el contenedor PDF
    elemento.style.position = 'static';
    elemento.style.left = 'auto';
    elemento.style.top = 'auto';
    elemento.style.visibility = 'visible';
    
    html2canvas(elemento, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: elemento.scrollWidth,
      height: elemento.scrollHeight,
      windowWidth: 800,
      windowHeight: 1200
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new window.jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const ratio = pdfWidth / canvasWidth;
      const scaledHeight = canvasHeight * ratio;
      
      let yPosition = 0;
      let remainingHeight = scaledHeight;
      
      // Añadir páginas según sea necesario
      while (remainingHeight > 0) {
        if (yPosition > 0) {
          pdf.addPage();
        }
        
        const pageHeight = Math.min(pdfHeight, remainingHeight);
        
        pdf.addImage(
          imgData, 
          'JPEG', 
          0, 
          yPosition === 0 ? 0 : -yPosition * (pdfHeight / scaledHeight) * canvasHeight / ratio,
          pdfWidth, 
          scaledHeight
        );
        
        yPosition += pageHeight;
        remainingHeight -= pageHeight;
      }
      
      // Ocultar nuevamente el contenedor PDF
      elemento.style.position = 'absolute';
      elemento.style.left = '-10000px';
      elemento.style.top = '-10000px';
      elemento.style.visibility = 'hidden';
      
      const fecha = new Date().toISOString().split('T')[0];
      pdf.save(`Informe_Personal_OS9_${fecha}.pdf`);
      
      // Restaurar botón
      btn.innerHTML = originalText;
      btn.disabled = false;
      
      console.log('PDF generado exitosamente');
      
    }).catch(error => {
      console.error('Error al generar PDF:', error);
      
      // Ocultar contenedor PDF en caso de error
      elemento.style.position = 'absolute';
      elemento.style.left = '-10000px';
      elemento.style.top = '-10000px';
      elemento.style.visibility = 'hidden';
      
      // Restaurar botón
      btn.innerHTML = originalText;
      btn.disabled = false;
      
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    });
  }, 100);
}

// Nueva función para compartir por WhatsApp
function compartirWhatsapp() {
  const totalFormando = document.getElementById('totalGeneral').innerText;
  const fecha = document.getElementById('fechaInforme').innerText;
  const resumen = `
📊 Reporte de Personal OS9
🗓️ ${fecha}
👥 Total de personal formando: ${totalFormando}

*Puedes generar un informe detallado en la aplicación.*
  `;
  
  const url = `https://wa.me/?text=${encodeURIComponent(resumen)}`;
  window.open(url, '_blank');
}

function crearTabla(seccion, contenedor, titulo, columns) {
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        ${columns.map(col => `<th>${col}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr>
        ${columns.map(col => `
          <td><input type="number" 
                   data-seccion="${seccion}"
                   data-columna="${col}"
                   value="${datos[seccion]?.[col] || ''}" 
                   onchange="guardar('${seccion}','${col}',this.value)" /></td>
        `).join('')}
      </tr>
    </tbody>
  `;
  contenedor.appendChild(table);
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarDatos();
  const contenedor = document.getElementById("contenedor");

  secciones.forEach(sec => {
    const card = document.createElement("div");
    card.className = "section-card";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = sec;
    card.appendChild(title);

    const mainGrid = document.createElement("div");
    mainGrid.className = "input-grid main-grid";
    crearInputs(sec, principales, mainGrid);
    card.appendChild(mainGrid);

    const extras = columnas.filter(c => !principales.includes(c));
    const details = document.createElement("details");
    details.className = "collapsible";

    const summary = document.createElement("summary");
    summary.className = "collapsible-header";
    summary.textContent = "Ver campos adicionales";
    details.appendChild(summary);

    const extraContent = document.createElement("div");
    extraContent.className = "collapsible-content";

    const extraGrid = document.createElement("div");
    extraGrid.className = "input-grid extra-grid";
    crearInputs(sec, extras, extraGrid);

    extraContent.appendChild(extraGrid);
    details.appendChild(extraContent);
    card.appendChild(details);

    const totalDiv = document.createElement("div");
    totalDiv.style.textAlign = "right";
    totalDiv.style.marginTop = "1.5rem";
    totalDiv.innerHTML = `<div class="total-badge">Formando: <span id="total-${sec}">0</span></div>`;
    card.appendChild(totalDiv);

    contenedor.appendChild(card);
  });
  actualizarTotales();

  document.querySelector('.reset-btn').onclick = resetear;
  document.querySelector('.report-btn').onclick = abrirInforme;
});