const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKS8Hhfu06GQvZR-fGvmCkpePuuyLkuEcPQJqOizMnoippkVCsNudOiEXNal4yzw/pub?output=csv";

async function cargarYMostrarCSV() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const tableEl = document.getElementById('data-table');
  const theadEl = document.getElementById('table-head');
  const tbodyEl = document.getElementById('table-body');

  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error("No se pudo obtener el archivo");

    const text = await response.text();
    
    // Parsear líneas separadas por comas
    const rows = text.trim().split("\n").map(row => row.split(","));

    if (rows.length === 0) return;

    // Encabezados
    const headers = rows[0];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText.replace(/"/g, '');
      headerRow.appendChild(th);
    });
    theadEl.appendChild(headerRow);

    // Filas de datos
    const dataRows = rows.slice(1);
    dataRows.forEach(rowData => {
      const tr = document.createElement('tr');
      rowData.forEach(cellText => {
        const td = document.createElement('td');
        td.textContent = cellText.replace(/"/g, '');
        tr.appendChild(td);
      });
      tbodyEl.appendChild(tr);
    });

    loadingEl.classList.add('hidden');
    tableEl.classList.remove('hidden');

  } catch (error) {
    console.error("Error al procesar el CSV:", error);
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', cargarYMostrarCSV);
