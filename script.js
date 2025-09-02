
    const secciones = [
      "Crimen Organizado","Muertes Violentas","Alta Complejidad",
      "Aseguramiento Evidencia","Delitos Económicos","Apoyo Operativo",
      "Artefactos Explosivos","Invest. contra DD.HH","Análisis Criminal",
      "Jefatura Operaciones","Ciberdelitos","Medio Ambiente",
      "Equipo Especial","Plana Mayor","Capitanes","Tenientes"
    ];
    
    const columnas = [
      "Dotación","Forman","Falta","Servicio","Franco","Feriado","Autorizado",
      "Permiso","Licencia","Com. Serv.","Agregado","Sin Motivo","Otros"
    ];

    const principales = ["Dotación","Forman","Falta"];
    const camposCalculables = ["Servicio","Franco","Feriado","Autorizado","Permiso","Licencia","Com. Serv.","Agregado","Sin Motivo","Otros"];

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
      // Verificar si es un nuevo día
      if (esNuevoDia()) {
        // Limpiar datos del día anterior
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
      
      // Inicializar estructura de datos si está vacía
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

      // Actualizar la fecha del último acceso
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
      }
      else if (columna === 'Dotación') {
        datos[seccion][columna] = numValor;
        const forman = parseInt(datos[seccion]['Forman']) || 0;
        const falta = Math.max(0, numValor - forman);
        datos[seccion]['Falta'] = falta;
        
        const faltaInput = document.querySelector(`input[data-seccion="${seccion}"][data-columna="Falta"]`);
        if (faltaInput) faltaInput.value = falta;
        
        localStorage.setItem("cuentaDiaria", JSON.stringify(datos));
        actualizarTotalSeccion(seccion);
        actualizarTotalGeneral();
      } 
      else if (columna === 'Forman') {
        datos[seccion][columna] = numValor;
        const dotacion = parseInt(datos[seccion]['Dotación']) || 0;
        const falta = Math.max(0, dotacion - numValor);
        datos[seccion]['Falta'] = falta;
        
        const faltaInput = document.querySelector(`input[data-seccion="${seccion}"][data-columna="Falta"]`);
        if (faltaInput) faltaInput.value = falta;
        
        localStorage.setItem("cuentaDiaria", JSON.stringify(datos));
        actualizarTotalSeccion(seccion);
        actualizarTotalGeneral();
      }
      else {
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
        // Limpiar completamente datos y localStorage
        datos = {};
        localStorage.removeItem("cuentaDiaria");
        
        // Inicializar estructura vacía sin valores
        secciones.forEach(seccion => {
          datos[seccion] = {};
          columnas.forEach(col => {
            datos[seccion][col] = '';
          });
        });
        
        // Limpiar todos los inputs en el DOM
        const inputs = document.querySelectorAll('.input-control');
        inputs.forEach(input => {
          input.value = '';
          input.value = 0;
        });
        
        // Limpiar totales de secciones
        secciones.forEach(seccion => {
          const spanTotal = document.getElementById(`total-${seccion}`);
          if (spanTotal) {
            spanTotal.innerText = 0;
          }
        });
        
        // Limpiar total general
        const elementoTotal = document.getElementById("totalGeneral");
        if (elementoTotal) {
          elementoTotal.innerText = 0;
        }
        
        // Actualizar la fecha para evitar que se reinicie automáticamente
        actualizarFecha();
        
        // Mostrar confirmación
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

    // Funciones del Informe
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
      
      // Inicializar contadores
      const tiposAusencia = ["Servicio","Franco","Feriado","Autorizado","Permiso","Licencia","Com. Serv.","Agregado","Sin Motivo","Otros"];
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
        
        // Contar ausentismo por tipo
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
        
        datosDetalle.push({
          seccion,
          dotacion,
          formando,
          ausente,
          porcentajeOperativo: porcentajeOperativo.toFixed(1),
          estado,
          statusClass
        });
      });

      // Calcular porcentaje general
      const porcentajeGeneral = totalDotacion > 0 ? (totalFormando / totalDotacion * 100) : 0;

      // Generar HTML del informe
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

        <div class="informe-tabla">
          <h3>📋 Detalle por Unidad Operativa</h3>
          <table class="tabla-detalle">
            <thead>
              <tr>
                <th>Unidad</th>
                <th>Dotación</th>
                <th>Formando</th>
                <th>Ausente</th>
                <th>% Operativo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
      `;

      // Ordenar por porcentaje operativo descendente
      datosDetalle.sort((a, b) => b.porcentajeOperativo - a.porcentajeOperativo);

      datosDetalle.forEach(item => {
        htmlInforme += `
          <tr class="${item.statusClass}">
            <td><strong>${item.seccion}</strong></td>
            <td class="num-cell">${item.dotacion}</td>
            <td class="num-cell">${item.formando}</td>
            <td class="num-cell">${item.ausente}</td>
            <td class="num-cell">${item.porcentajeOperativo}%</td>
            <td class="num-cell"><strong>${item.estado}</strong></td>
          </tr>
        `;
      });

      htmlInforme += `
            </tbody>
          </table>
        </div>

        <div class="informe-tabla">
          <h3>📊 Detalle Completo por Unidad</h3>
          <table class="tabla-detalle">
            <thead>
              <tr>
                <th>Unidad</th>
                <th>Dot.</th>
                <th>Form.</th>
                <th>Serv.</th>
                <th>Franco</th>
                <th>Feriado</th>
                <th>Autor.</th>
                <th>Perm.</th>
                <th>Lic.</th>
                <th>C.Serv.</th>
                <th>Agreg.</th>
                <th>S.Mot.</th>
                <th>Otros</th>
              </tr>
            </thead>
            <tbody>
      `;

      secciones.forEach(seccion => {
        const datoSeccion = datos[seccion] || {};
        htmlInforme += `
          <tr>
            <td><strong>${seccion}</strong></td>
            <td class="num-cell">${datoSeccion['Dotación'] || 0}</td>
            <td class="num-cell">${datoSeccion['Forman'] || 0}</td>
            <td class="num-cell">${datoSeccion['Servicio'] || 0}</td>
            <td class="num-cell">${datoSeccion['Franco'] || 0}</td>
            <td class="num-cell">${datoSeccion['Feriado'] || 0}</td>
            <td class="num-cell">${datoSeccion['Autorizado'] || 0}</td>
            <td class="num-cell">${datoSeccion['Permiso'] || 0}</td>
            <td class="num-cell">${datoSeccion['Licencia'] || 0}</td>
            <td class="num-cell">${datoSeccion['Com. Serv.'] || 0}</td>
            <td class="num-cell">${datoSeccion['Agregado'] || 0}</td>
            <td class="num-cell">${datoSeccion['Sin Motivo'] || 0}</td>
            <td class="num-cell">${datoSeccion['Otros'] || 0}</td>
          </tr>
        `;
      });

      htmlInforme += `
            </tbody>
          </table>
        </div>

        <div class="informe-tabla">
          <h3>📈 Análisis de Ausentismo</h3>
          <table class="tabla-detalle">
            <thead>
              <tr>
                <th>Tipo de Ausencia</th>
                <th>Cantidad</th>
                <th>% del Total Ausente</th>
              </tr>
            </thead>
            <tbody>
      `;

      const ausentismoOrdenado = Object.entries(ausentismoPorTipo)
        .sort(([,a], [,b]) => b - a)
        .filter(([,valor]) => valor > 0);

      ausentismoOrdenado.forEach(([tipo, cantidad]) => {
        const porcentaje = totalAusente > 0 ? (cantidad / totalAusente * 100) : 0;
        htmlInforme += `
          <tr>
            <td><strong>${tipo}</strong></td>
            <td class="num-cell">${cantidad}</td>
            <td class="num-cell">${porcentaje.toFixed(1)}%</td>
          </tr>
        `;
      });

      htmlInforme += `
            </tbody>
          </table>
        </div>
      `;

      // Generar observaciones automáticas
      const observaciones = [];
      
      if (porcentajeGeneral < 70) {
        observaciones.push('⚠️ Efectividad operacional por debajo del umbral crítico (70%)');
      }
      
      if (totalAusente > totalFormando * 0.3) {
        observaciones.push('⚠️ Alto nivel de ausentismo detectado');
      }
      
      const unidadesCriticas = datosDetalle.filter(item => 
        parseFloat(item.porcentajeOperativo) < 70
      );
      
      if (unidadesCriticas.length > 0) {
        observaciones.push(`⚠️ ${unidadesCriticas.length} unidades en estado crítico: ${unidadesCriticas.map(u => u.seccion).join(', ')}`);
      }
      
      const sinDotacion = datosDetalle.filter(item => item.dotacion === 0);
      if (sinDotacion.length > 0) {
        observaciones.push(`ℹ️ Unidades sin dotación registrada: ${sinDotacion.map(u => u.seccion).join(', ')}`);
      }

      if (observaciones.length > 0) {
        htmlInforme += `
          <div class="informe-tabla">
            <h3>⚠️ Observaciones y Alertas</h3>
            <div style="padding: 1rem;">
        `;
        
        observaciones.forEach(obs => {
          htmlInforme += `<p style="margin: 0.5rem 0; padding: 0.5rem; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">${obs}</p>`;
        });
        
        htmlInforme += `
            </div>
          </div>
        `;
      }

      htmlInforme += `
        <div class="print-section">
          <button class="print-btn" onclick="imprimirInforme()">🖨️ Imprimir Informe</button>
          <p style="margin-top: 1rem; color: #64748b; font-size: 0.9rem;">
            <strong>Sistema de Control de Personal v2.0</strong><br>
            Informe generado automáticamente el ${ahora.toLocaleString('es-CL')}
          </p>
        </div>
      `;

      document.getElementById('contenidoInforme').innerHTML = htmlInforme;
    }

    function imprimirInforme() {
      window.print();
    }

    // Cerrar modal al hacer clic fuera de él
    window.onclick = function(event) {
      const modal = document.getElementById('modalInforme');
      if (event.target == modal) {
        cerrarInforme();
      }
    }

    window.onload = () => {
      inicializarDatos();
      
      const cont = document.getElementById("contenedor");
      
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

        cont.appendChild(card);
      });

      actualizarTotales();
    }