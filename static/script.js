// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active-page');
    });

    // Show selected page
    document.getElementById(pageId).classList.add('active-page');
}

// Store selected values
let selectedRegion = '';
let selectedMaterial = '';
let selectedDetail = '';

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
    const tableConfig = getTableConfig(detailId);

    // Create the card with the table
    container.innerHTML = `
        <div class="material-card">
            <div class="subsection-header">
                <span class="subsection-marker">${tableConfig.marker}</span>
                <span class="subsection-title">${tableConfig.title}</span>
                <div class="type-selector" data-group="${detailId}">
                    <span class="type-label">No. of Types</span>
                    <div class="type-number">
                        <span class="number-badge" id="${detailId}-count">3</span>
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

    // Initialize the table with 3 rows
    renderTableRows(detailId, 3);
}

// ===== TABLE CONFIGURATION =====
function getTableConfig(detailId) {
    const configs = {
        'concrete-footing': {
            marker: '(A)',
            title: 'FOOTING DETAILS',
            headers: '<th>Type</th><th>Length (M)</th><th>Width (M)</th><th>Thickness (M)</th><th>no. of Footings (pcs)</th><th>Action</th>'
        },
        'concrete-column': {
            marker: '(B)',
            title: 'COLUMN DETAILS',
            headers: '<th>Type</th><th>Length (M)</th><th>Width (M)</th><th>Height (M)</th><th>no. of Columns (pcs)</th><th>Action</th>'
        },
        'concrete-beam': {
            marker: '(C)',
            title: 'BEAM DETAILS',
            headers: '<th>Type</th><th>Base (M)</th><th>Depth (M)</th><th>Length (M)</th><th>no. of Beams (pcs)</th><th>Action</th>'
        },
        'concrete-slab': {
            marker: '(D)',
            title: 'SLAB DETAILS',
            headers: '<th>Type</th><th>Length (M)</th><th>Width (M)</th><th>Thickness (M)</th><th>no. of Slabs (pcs)</th><th>Action</th>'
        },
        'masonry-wall': {
            marker: '(M)',
            title: 'WALL DETAILS',
            headers: '<th>Type</th><th>Length (m)</th><th>Height (m)</th><th>No. of Walls (pcs)</th><th></th><th>Action</th>'
        },
        'steel-footing': {
            marker: '(A)',
            title: 'FOOTING DETAILS',
            headers: '<th>Type</th><th>No. of Bars in L (pcs)</th><th>No. of Bars in W (pcs)</th><th>No. of Footings (pcs)</th><th></th><th>Action</th>'
        },
        'steel-column': {
            marker: '(B)',
            title: 'COLUMN DETAILS',
            headers: '<th>Type</th><th>No. of Vertical Bars (pcs)</th><th>No. of Lateral Ties (pcs)</th><th>No. of Columns (pcs)</th><th>Height (m)</th><th>Action</th>'
        },
        'steel-beam': {
            marker: '(C)',
            title: 'BEAM DETAILS',
            headers: '<th>Type</th><th>No. of Steel Bars (pcs)</th><th>No. of Bottom Bars (pcs)</th><th>No. of Stirrups (pcs)</th><th>Overall Length (m)</th><th>Action</th>'
        },
        'steel-slab': {
            marker: '(D)',
            title: 'SLAB DETAILS',
            headers: '<th>Type</th><th>No. of Top Bars (pcs)</th><th>Bar Spacing (cm)</th><th>No. of Slabs (pcs)</th><th></th><th>Action</th>'
        },
        'steel-wall': {
            marker: '(E)',
            title: 'WALL DETAILS',
            headers: '<th>Type</th><th>Vertical Spacing (cm)</th><th>Length of Vertical (m)</th><th>Spacing Layer</th><th>Length of Horizontal (m)</th><th>Action</th>'
        }
    };

    return configs[detailId] || {
        marker: '(A)',
        title: 'DETAILS',
        headers: '<th>Type</th><th>Column 1</th><th>Column 2</th><th>Column 3</th><th>Column 4</th><th>Action</th>'
    };
}

// ===== RENDER TABLE ROWS =====
function renderTableRows(tableId, count) {
    const tbody = document.getElementById(`${tableId}-body`);
    if (!tbody) return;

    const tableType = getTypeFromId(tableId);

    let htmlStr = '';
    for (let i = 1; i <= count; i++) {
        const typeLabel = getTypeLabel(tableType, i);
        htmlStr += '<tr>';

        // Type column
        htmlStr += `<td class="footing-type">${typeLabel}</td>`;

        // Input columns (4 data columns)
        for (let j = 1; j <= 4; j++) {
            htmlStr += `<td><input type="text" class="placeholder-input" id="${tableId}-input-${i}-${j}" placeholder="..."></td>`;
        }

        // Action column with delete button
        htmlStr += `<td><button class="delete-btn" onclick="deleteRow('${tableId}', ${i})"><span class="delete-icon">🗑️</span></button></td>`;

        htmlStr += '</tr>';
    }

    tbody.innerHTML = htmlStr;
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

// ===== TABLE ACTIONS =====
function updateTable(tableId, change) {
    const countDisplay = document.getElementById(`${tableId}-count`);
    let currentCount = parseInt(countDisplay.textContent) || 3;
    let newCount = currentCount + change;

    // Clamp between 1 and 10
    if (newCount < 1) newCount = 1;
    if (newCount > 10) newCount = 10;

    countDisplay.textContent = newCount;

    // Re-render the table
    renderTableRows(tableId, newCount);
}

function deleteRow(tableId, rowIndex) {
    console.log(`Deleting row ${rowIndex} from ${tableId}`);

    const countDisplay = document.getElementById(`${tableId}-count`);
    let currentCount = parseInt(countDisplay.textContent) || 3;

    if (currentCount <= 1) {
        alert("Cannot delete the last row!");
        return;
    }

    // Decrease the count
    let newCount = currentCount - 1;
    countDisplay.textContent = newCount;

    // Re-render the table with new count
    renderTableRows(tableId, newCount);
}

// ===== HOME BUTTON =====
function goHome() {
    // Reset selections
    selectedRegion = '';
    selectedMaterial = '';
    selectedDetail = '';

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
window.goHome = goHome;