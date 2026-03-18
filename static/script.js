// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active-page');
    });

    // Show selected page
    document.getElementById(pageId).classList.add('active-page');
}

// Store selected values and table data
let selectedRegion = '';
let selectedMaterial = '';
let selectedDetail = '';

// Store table data to preserve inputs
let tableData = {};

// ===== MIN/MAX CONSTRAINTS FOR EACH TABLE TYPE =====
const tableConstraints = {
    'concrete-footing': { min: 1, max: 5 },
    'concrete-column': { min: 1, max: 5 },
    'concrete-beam': { min: 1, max: 5 },
    'concrete-slab': { min: 4, max: 10 },
    'masonry-wall': { min: 4, max: 10 },
    'steel-footing': { min: 1, max: 5 },
    'steel-column': { min: 1, max: 5 },
    'steel-beam': { min: 1, max: 5 },
    'steel-slab': { min: 4, max: 10 },
    'steel-wall': { min: 4, max: 10 }
};

// ===== TABLE CONFIGURATIONS =====
const tableConfigs = {
    'concrete-footing': {
        marker: '(A)',
        title: 'FOOTING DETAILS',
        headers: '<th>Type</th><th>Length (M)</th><th>Width (M)</th><th>Thickness (M)</th><th>no. of Footings (pcs)</th><th>Action</th>',
        columnCount: 4,
        resultColumns: ['Type', 'Length (M)', 'Width (M)', 'Thickness (M)', 'No. of Footings', 'Sum'],
        calculateSum: (row) => {
            // Sum all numeric values in the row
            let sum = 0;
            for (let i = 0; i < row.length; i++) {
                const val = parseFloat(row[i]);
                if (!isNaN(val)) sum += val;
            }
            return sum;
        }
    },
    'concrete-column': {
        marker: '(B)',
        title: 'COLUMN DETAILS',
        headers: '<th>Type</th><th>Length (M)</th><th>Width (M)</th><th>Height (M)</th><th>no. of Columns (pcs)</th><th>Action</th>',
        columnCount: 4,
        resultColumns: ['Type', 'Length (M)', 'Width (M)', 'Height (M)', 'No. of Columns', 'Sum'],
        calculateSum: (row) => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) {
                const val = parseFloat(row[i]);
                if (!isNaN(val)) sum += val;
            }
            return sum;
        }
    },
    'concrete-beam': {
        marker: '(C)',
        title: 'BEAM DETAILS',
        headers: '<th>Type</th><th>Base (M)</th><th>Depth (M)</th><th>Length (M)</th><th>no. of Beams (pcs)</th><th>Action</th>',
        columnCount: 4,
        resultColumns: ['Type', 'Base (M)', 'Depth (M)', 'Length (M)', 'No. of Beams', 'Sum'],
        calculateSum: (row) => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) {
                const val = parseFloat(row[i]);
                if (!isNaN(val)) sum += val;
            }
            return sum;
        }
    },
    'concrete-slab': {
        marker: '(D)',
        title: 'SLAB DETAILS',
        headers: '<th>Type</th><th>Length (M)</th><th>Width (M)</th><th>Thickness (M)</th><th>no. of Slabs (pcs)</th><th>Action</th>',
        columnCount: 4,
        resultColumns: ['Type', 'Length (M)', 'Width (M)', 'Thickness (M)', 'No. of Slabs', 'Sum'],
        calculateSum: (row) => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) {
                const val = parseFloat(row[i]);
                if (!isNaN(val)) sum += val;
            }
            return sum;
        }
    },
    'masonry-wall': {
        marker: '(M)',
        title: 'WALL DETAILS',
        headers: '<th>Type</th><th>Length (m)</th><th>Height (m)</th><th>No. of Walls (pcs)</th><th>Action</th>',
        columnCount: 3,
        resultColumns: ['Type', 'Length (m)', 'Height (m)', 'No. of Walls', 'Sum'],
        calculateSum: (row) => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) {
                const val = parseFloat(row[i]);
                if (!isNaN(val)) sum += val;
            }
            return sum;
        }
    },
    'steel-footing': {
        marker: '(A)',
        title: 'FOOTING DETAILS',
        headers: '<th>Type</th><th>No. of Bars in L (pcs)</th><th>No. of Bars in W (pcs)</th><th>No. of Footings (pcs)</th><th></th><th>Action</th>',
        columnCount: 3,
        resultColumns: ['Type', 'Bars in L', 'Bars in W', 'No. of Footings', 'Sum'],
        calculateSum: (row) => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) {
                const val = parseFloat(row[i]);
                if (!isNaN(val)) sum += val;
            }
            return sum;
        }
    },
    'steel-column': {
        marker: '(B)',
        title: 'COLUMN DETAILS',
        headers: '<th>Type</th><th>No. of Vertical Bars (pcs)</th><th>No. of Lateral Ties (pcs)</th><th>No. of Columns (pcs)</th><th>Height (m)</th><th>Action</th>',
        columnCount: 4,
        resultColumns: ['Type', 'Vertical Bars', 'Lateral Ties', 'No. of Columns', 'Height (m)', 'Sum'],
        calculateSum: (row) => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) {
                const val = parseFloat(row[i]);
                if (!isNaN(val)) sum += val;
            }
            return sum;
        }
    },
    'steel-beam': {
        marker: '(C)',
        title: 'BEAM DETAILS',
        headers: '<th>Type</th><th>No. of Steel Bars (pcs)</th><th>No. of Bottom Bars (pcs)</th><th>No. of Stirrups (pcs)</th><th>Overall Length (m)</th><th>Action</th>',
        columnCount: 4,
        resultColumns: ['Type', 'Steel Bars', 'Bottom Bars', 'Stirrups', 'Length (m)', 'Sum'],
        calculateSum: (row) => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) {
                const val = parseFloat(row[i]);
                if (!isNaN(val)) sum += val;
            }
            return sum;
        }
    },
    'steel-slab': {
        marker: '(D)',
        title: 'SLAB DETAILS',
        headers: '<th>Type</th><th>No. of Top Bars (pcs)</th><th>Bar Spacing (cm)</th><th>No. of Slabs (pcs)</th><th></th><th>Action</th>',
        columnCount: 3,
        resultColumns: ['Type', 'Top Bars', 'Bar Spacing', 'No. of Slabs', 'Sum'],
        calculateSum: (row) => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) {
                const val = parseFloat(row[i]);
                if (!isNaN(val)) sum += val;
            }
            return sum;
        }
    },
    'steel-wall': {
        marker: '(E)',
        title: 'WALL DETAILS',
        headers: '<th>Type</th><th>Vertical Spacing (cm)</th><th>Length of Vertical (m)</th><th>Spacing Layer</th><th>Length of Horizontal (m)</th><th>Action</th>',
        columnCount: 4,
        resultColumns: ['Type', 'Vertical Spacing', 'Vertical Length', 'Spacing Layer', 'Horizontal Length', 'Sum'],
        calculateSum: (row) => {
            let sum = 0;
            for (let i = 0; i < row.length; i++) {
                const val = parseFloat(row[i]);
                if (!isNaN(val)) sum += val;
            }
            return sum;
        }
    }
};

// ===== PAGE 2: SELECT REGION =====
function selectRegion(region) {
    selectedRegion = region;
    console.log('Selected region:', region);
    showPage('page3');
}

// ===== PAGE 3: SELECT MATERIAL =====
function selectMaterial(material) {
    selectedMaterial = material;
    console.log('Selected material:', material);
    updateDetailCards(material);
    showPage('page4');
}

// ===== PAGE 4: UPDATE DETAIL CARDS BASED ON MATERIAL =====
function updateDetailCards(material) {
    const container = document.getElementById('detail-cards-container');

    if (!container) {
        console.error('Container not found');
        return;
    }

    // Remove any existing layout classes
    container.classList.remove('concrete-layout', 'steel-layout', 'masonry-layout');
    container.style.display = ''; // Reset display property

    let cardsHTML = '';

    if (material === 'concrete') {
        container.classList.add('concrete-layout');
        cardsHTML = `
            <div class="selection-card" onclick="selectDetail('concrete-footing')">
                <h3>(A) FOOTING DETAILS</h3>
            </div>
            <div class="selection-card" onclick="selectDetail('concrete-column')">
                <h3>(B) COLUMN DETAILS</h3>
            </div>
            <div class="selection-card" onclick="selectDetail('concrete-beam')">
                <h3>(C) BEAM DETAILS</h3>
            </div>
            <div class="selection-card" onclick="selectDetail('concrete-slab')">
                <h3>(D) SLAB DETAILS</h3>
            </div>
        `;
    } else if (material === 'masonry') {
        container.classList.add('masonry-layout');
        cardsHTML = `
            <div class="selection-card" onclick="selectDetail('masonry-wall')">
                <h3>(M) WALL DETAILS</h3>
            </div>
        `;
    } else if (material === 'steel') {
        container.classList.add('steel-layout');
        cardsHTML = `
            <div class="selection-card" onclick="selectDetail('steel-footing')">
                <h3>(A) FOOTING DETAILS</h3>
            </div>
            <div class="selection-card" onclick="selectDetail('steel-column')">
                <h3>(B) COLUMN DETAILS</h3>
            </div>
            <div class="selection-card" onclick="selectDetail('steel-beam')">
                <h3>(C) BEAM DETAILS</h3>
            </div>
            <div class="selection-card" onclick="selectDetail('steel-slab')">
                <h3>(D) SLAB DETAILS</h3>
            </div>
            <div class="selection-card" onclick="selectDetail('steel-wall')">
                <h3>(E) WALL DETAILS</h3>
            </div>
        `;
    }

    container.innerHTML = cardsHTML;
}

// ===== PAGE 4: SELECT DETAIL TYPE =====
function selectDetail(detailId) {
    selectedDetail = detailId;
    console.log('Selected detail:', detailId);

    // Get constraints for this table
    const constraints = tableConstraints[detailId] || { min: 1, max: 10 };

    // Initialize table data if it doesn't exist
    if (!tableData[detailId]) {
        tableData[detailId] = {
            count: constraints.min, // Start at minimum
            rows: {}
        };
        // Initialize with minimum number of rows
        for (let i = 1; i <= constraints.min; i++) {
            tableData[detailId].rows[i] = Array(tableConfigs[detailId].columnCount).fill('');
        }
    }

    // Update title on page 5
    updateDetailTitle(detailId);

    // Load the appropriate table
    loadDetailsTable(detailId);

    // SHOW PAGE 5
    showPage('page5');
}

// ===== PAGE 5: UPDATE TITLE =====
function updateDetailTitle(detailId) {
    const titleElement = document.getElementById('detail-title');
    if (!titleElement) return;

    const titleMap = {
        'concrete-footing': 'CONCRETE - FOOTING DETAILS',
        'concrete-column': 'CONCRETE - COLUMN DETAILS',
        'concrete-beam': 'CONCRETE - BEAM DETAILS',
        'concrete-slab': 'CONCRETE - SLAB DETAILS',
        'masonry-wall': 'MASONRY - WALL DETAILS',
        'steel-footing': 'STEEL - FOOTING DETAILS',
        'steel-column': 'STEEL - COLUMN DETAILS',
        'steel-beam': 'STEEL - BEAM DETAILS',
        'steel-slab': 'STEEL - SLAB DETAILS',
        'steel-wall': 'STEEL - WALL DETAILS'
    };

    titleElement.textContent = titleMap[detailId] || 'DETAILS';
}

// ===== PAGE 5: LOAD DETAILS TABLE =====
function loadDetailsTable(detailId) {
    const container = document.getElementById('details-card-container');
    if (!container) {
        console.error('Details container not found');
        return;
    }

    // Get the appropriate headers and markers for this detail type
    const tableConfig = tableConfigs[detailId];

    // Create the card with the table
    container.innerHTML = `
        <div class="material-card">
            <div class="subsection-header">
                <span class="subsection-marker">${tableConfig.marker}</span>
                <span class="subsection-title">${tableConfig.title}</span>
                <div class="type-selector" data-group="${detailId}">
                    <span class="type-label">No. of Types</span>
                    <div class="type-number">
                        <span class="number-badge" id="${detailId}-count">${tableData[detailId].count}</span>
                        <div class="arrow-group">
                            <button class="arrow-btn" onclick="updateTable('${detailId}', 1)">▲</button>
                            <button class="arrow-btn" onclick="updateTable('${detailId}', -1)">▼</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-container">
                <table class="footing-table" id="${detailId}-table">
                    <thead>
                        <tr>
                            ${tableConfig.headers}
                        </tr>
                    </thead>
                    <tbody id="${detailId}-body">
                        <!-- Rows will be populated by JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Render the table rows
    renderTableRows(detailId);

    // Update arrow button states
    updateArrowButtons(detailId);
}

// ===== RENDER TABLE ROWS =====
function renderTableRows(tableId) {
    const tbody = document.getElementById(`${tableId}-body`);
    if (!tbody) return;

    const tableConfig = tableConfigs[tableId];
    const tableType = getTypeFromId(tableId);
    const count = tableData[tableId].count;
    const rows = tableData[tableId].rows;

    let htmlStr = '';
    for (let i = 1; i <= count; i++) {
        const typeLabel = getTypeLabel(tableType, i);

        // Initialize row data if it doesn't exist
        if (!rows[i]) {
            rows[i] = Array(tableConfig.columnCount).fill('');
        }

        htmlStr += '<tr>';

        // Type column
        htmlStr += `<td class="footing-type">${typeLabel}</td>`;

        // Input columns (based on columnCount)
        for (let j = 0; j < tableConfig.columnCount; j++) {
            const value = rows[i][j] || '';
            htmlStr += `<td><input type="text" class="placeholder-input" id="${tableId}-input-${i}-${j}" value="${value}" placeholder="..." oninput="validateNumberInput(this)" onchange="saveInputValue('${tableId}', ${i}, ${j}, this.value)"></td>`;
        }

        // Action column with delete button
        htmlStr += `<td><button class="delete-btn" onclick="deleteRow('${tableId}', ${i})"><span class="delete-icon">🗑️</span></button></td>`;

        htmlStr += '</tr>';
    }

    tbody.innerHTML = htmlStr;
}

// ===== VALIDATE NUMBER INPUT =====
function validateNumberInput(input) {
    // Remove any non-numeric characters except dot and minus
    let value = input.value;
    value = value.replace(/[^0-9.-]/g, '');

    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Ensure minus sign is only at the beginning
    if (value.indexOf('-') > 0) {
        value = value.replace(/-/g, '');
    }

    input.value = value;
}

// ===== SAVE INPUT VALUE =====
function saveInputValue(tableId, rowIndex, colIndex, value) {
    if (!tableData[tableId]) return;
    if (!tableData[tableId].rows[rowIndex]) {
        tableData[tableId].rows[rowIndex] = [];
    }
    tableData[tableId].rows[rowIndex][colIndex] = value;
}

// ===== HELPER FUNCTIONS =====
function getTypeFromId(tableId) {
    if (tableId.includes('footing')) return 'footing';
    if (tableId.includes('column')) return 'column';
    if (tableId.includes('beam')) return 'beam';
    if (tableId.includes('slab')) return 'slab';
    if (tableId.includes('wall')) return 'wall';
    return 'default';
}

function getTypeLabel(tableType, index) {
    switch (tableType) {
        case 'footing': return `F${index}`;
        case 'column': return `C${index}`;
        case 'beam': return `B${index}`;
        case 'slab': return `S${index}`;
        case 'wall': return `W${index}`;
        default: return `T${index}`;
    }
}

// ===== UPDATE ARROW BUTTON STATES =====
function updateArrowButtons(tableId) {
    const currentCount = tableData[tableId].count;
    const constraints = tableConstraints[tableId] || { min: 1, max: 10 };

    const selector = document.querySelector(`.type-selector[data-group="${tableId}"]`);
    if (selector) {
        const increaseBtn = selector.querySelector('.arrow-btn:first-of-type');
        const decreaseBtn = selector.querySelector('.arrow-btn:last-of-type');

        if (increaseBtn) {
            increaseBtn.disabled = currentCount >= constraints.max;
            increaseBtn.style.opacity = currentCount >= constraints.max ? '0.5' : '1';
            increaseBtn.style.cursor = currentCount >= constraints.max ? 'not-allowed' : 'pointer';
        }

        if (decreaseBtn) {
            decreaseBtn.disabled = currentCount <= constraints.min;
            decreaseBtn.style.opacity = currentCount <= constraints.min ? '0.5' : '1';
            decreaseBtn.style.cursor = currentCount <= constraints.min ? 'not-allowed' : 'pointer';
        }
    }
}

// ===== TABLE ACTIONS =====
function updateTable(tableId, change) {
    const countDisplay = document.getElementById(`${tableId}-count`);
    let currentCount = tableData[tableId].count;
    const constraints = tableConstraints[tableId] || { min: 1, max: 10 };

    let newCount = currentCount + change;

    // Apply constraints
    if (newCount < constraints.min) newCount = constraints.min;
    if (newCount > constraints.max) newCount = constraints.max;

    if (newCount === currentCount) return; // No change

    tableData[tableId].count = newCount;
    countDisplay.textContent = newCount;

    // Initialize new rows if needed
    const tableConfig = tableConfigs[tableId];
    for (let i = currentCount + 1; i <= newCount; i++) {
        if (!tableData[tableId].rows[i]) {
            tableData[tableId].rows[i] = Array(tableConfig.columnCount).fill('');
        }
    }

    // Re-render the table
    renderTableRows(tableId);

    // Update arrow button states
    updateArrowButtons(tableId);
}

function deleteRow(tableId, rowIndex) {
    console.log(`Deleting row ${rowIndex} from ${tableId}`);

    let currentCount = tableData[tableId].count;
    const constraints = tableConstraints[tableId] || { min: 1, max: 10 };

    if (currentCount <= constraints.min) {
        alert(`Cannot delete below minimum of ${constraints.min} rows!`);
        return;
    }

    // Get all current rows
    const rows = tableData[tableId].rows;
    const newRows = {};

    // Reindex rows, skipping the deleted one
    let newIndex = 1;
    for (let i = 1; i <= currentCount; i++) {
        if (i !== rowIndex) {
            newRows[newIndex] = rows[i];
            newIndex++;
        }
    }

    // Update table data
    tableData[tableId].rows = newRows;
    tableData[tableId].count = currentCount - 1;

    // Update display
    const countDisplay = document.getElementById(`${tableId}-count`);
    countDisplay.textContent = tableData[tableId].count;

    // Re-render the table
    renderTableRows(tableId);

    // Update arrow button states
    updateArrowButtons(tableId);
}

// ===== CALCULATE RESULTS =====
function calculateResults() {
    console.log('Calculating results for:', selectedDetail);

    if (!selectedDetail || !tableData[selectedDetail]) {
        alert('No data to calculate!');
        return;
    }

    const tableConfig = tableConfigs[selectedDetail];
    const data = tableData[selectedDetail];
    const count = data.count;
    const rows = data.rows;
    const tableType = getTypeFromId(selectedDetail);

    // Calculate per row sums and grand total
    let rowSums = [];
    let grandTotal = 0;

    for (let i = 1; i <= count; i++) {
        const rowData = rows[i] || Array(tableConfig.columnCount).fill('');
        const rowSum = tableConfig.calculateSum(rowData);
        rowSums.push(rowSum);
        grandTotal += rowSum;
    }

    // Get or create results container
    let resultsContainer = document.getElementById('results-container');
    if (!resultsContainer) {
        // Create results section if it doesn't exist
        const page5 = document.getElementById('page5');
        const resultsHTML = `
            <div class="results-section">
                <h2 class="results-title">RESULTS</h2>
                <div id="results-container" class="results-container">
                    <!-- Results table will be inserted here -->
                </div>
                <div class="results-info">
                    <div class="results-summary">
                        <span>Total Types: <span id="results-count" class="results-count">${count}</span></span>
                        <span class="grand-total">Grand Total: <span id="grand-total-value">${grandTotal.toFixed(2)}</span></span>
                    </div>
                    <span>Calculation completed</span>
                </div>
            </div>
        `;

        // Insert after the navigation buttons
        const navButtons = document.querySelector('#page5 .page-navigation');
        navButtons.insertAdjacentHTML('afterend', resultsHTML);
        resultsContainer = document.getElementById('results-container');
    }

    // Build results table
    let resultsHTML = '<table class="results-table"><thead><tr>';

    // Add headers
    tableConfig.resultColumns.forEach(header => {
        resultsHTML += `<th>${header}</th>`;
    });
    resultsHTML += '</tr></thead><tbody>';

    // Add rows with their sums
    for (let i = 1; i <= count; i++) {
        const typeLabel = getTypeLabel(tableType, i);
        const rowData = rows[i] || Array(tableConfig.columnCount).fill('—');
        const rowSum = rowSums[i - 1];

        resultsHTML += '<tr>';
        resultsHTML += `<td><strong>${typeLabel}</strong></td>`;

        // Add data cells
        for (let j = 0; j < tableConfig.columnCount; j++) {
            const value = rowData[j] || '—';
            resultsHTML += `<td>${value}</td>`;
        }

        // Add sum cell
        resultsHTML += `<td class="sum-cell"><strong>${rowSum.toFixed(2)}</strong></td>`;

        resultsHTML += '</tr>';
    }

    resultsHTML += '</tbody></table>';

    // Update results container
    resultsContainer.innerHTML = resultsHTML;

    // Update count and grand total display
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = count;
    }

    const grandTotalElement = document.getElementById('grand-total-value');
    if (grandTotalElement) {
        grandTotalElement.textContent = grandTotal.toFixed(2);
    }

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== HOME BUTTON =====
function goHome() {
    // Reset selections
    selectedRegion = '';
    selectedMaterial = '';
    selectedDetail = '';

    // Remove results section if it exists
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.remove();
    }

    // Go to page 1
    showPage('page1');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded, showing page 1');

    // Show first page
    showPage('page1');

    // Add home button listener if it exists
    const homeBtn = document.querySelector('.home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', goHome);
    }
});

// Make functions globally available
window.showPage = showPage;
window.selectRegion = selectRegion;
window.selectMaterial = selectMaterial;
window.selectDetail = selectDetail;
window.updateTable = updateTable;
window.deleteRow = deleteRow;
window.saveInputValue = saveInputValue;
window.validateNumberInput = validateNumberInput;
window.calculateResults = calculateResults;
window.goHome = goHome;