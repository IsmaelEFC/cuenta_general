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

  if (camposCalculables.includes(columna)) {
    const valorAnterior = parseInt(datos[seccion][columna]) || 0;
    const diferencia = numValor - valorAnterior;

    datos[seccion][columna] = numValor;

    const formanActual = parseInt(datos[seccion]['Forman']) || 0;
    const faltaActual = parseInt(datos[seccion]['Falta']) || 0;

    const nuevoForman = Math.max(0, formanActual - diferencia);
    const nuevaFalta = faltaActual + diferencia;

    datos[seccion]['Forman'] = nuevoForman;
    datos[seccion]['Falta'] = nuevaFalta;

    const formanInput = document.querySelector(`input[data-seccion="${seccion}"][data-columna="Forman"]`);
    const faltaInput = document.querySelector(`input[data-seccion="${seccion}"][data-columna="Falta"]`);

    if (formanInput) formanInput.value = nuevoForman;
    if (faltaInput) faltaInput.value = nuevaFalta;

    localStorage.setItem("cuentaDiaria", JSON.stringify(datos));
    actualizarTotalSeccion(seccion);
    actualizarTotalGeneral();
  } else if (columna === 'Dotación') {
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