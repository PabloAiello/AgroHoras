const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKS8Hhfu06GQvZR-fGvmCkpePuuyLkuEcPQJqOizMnoippkVCsNudOiEXNal4yzw/pub?output=csv";

// Función para procesar correctamente filas en CSV respetando comillas y comas/puntos y comas
function parseCSVLine(line, separator) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

async function cargarYMostrarCSV() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const tableEl = document.getElementById('data-table');
  const theadEl = document.getElementById('table-head');
  const tbodyEl = document.getElementById('table-body');

  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error("No se pudo obtener el archivo CSV");

    const text = await response.text();
    
    // Detectar automáticamente si usa punto y coma (;) o coma (,)
    const separator = text.includes(";") ? ";" : ",";

    // Separar por salto de línea
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length === 0) return;

    // Limpiar contenido previo
    theadEl.innerHTML = '';
    tbodyEl.innerHTML = '';

    // Procesar Encabezados (primera línea)
    const headers = parseCSVLine(lines[0], separator);
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    theadEl.appendChild(headerRow);

    // Procesar Filas de datos
    const dataLines = lines.slice(1);
    dataLines.forEach(line => {
      const rowData = parseCSVLine(line, separator);
      const tr = document.createElement('tr');
      
      rowData.forEach(cellText => {
        const td = document.createElement('td');
        td.textContent = cellText;
        tr.appendChild(td);
      });
      tbodyEl.appendChild(tr);
    });

    // Ocultar mensaje de carga y mostrar la tabla
    loadingEl.classList.add('hidden');
    tableEl.classList.remove('hidden');

  } catch (error) {
    console.error("Error al procesar el CSV:", error);
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', cargarYMostrarCSV);
