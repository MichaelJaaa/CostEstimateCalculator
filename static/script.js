// Add this to your existing JavaScript file

// Initialize region and floor selectors
function initializeSelectors() {
    const regionSelect = document.getElementById('region-select');
    const floorsSelect = document.getElementById('floors-select');
    const regionDisplay = document.getElementById('selected-region-display');
    const floorsDisplay = document.getElementById('selected-floors-display');

    if (regionSelect) {
        // Set default value
        regionSelect.value = 'luzon';

        // Add event listener
        regionSelect.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            regionDisplay.textContent = selectedOption.text || 'Luzon';
        });
    }

    if (floorsSelect) {
        // Set default value
        floorsSelect.value = '1';

        // Add event listener
        floorsSelect.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            floorsDisplay.textContent = selectedOption.text || '1-Storey';
        });
    }
}

// Store counts for each table
const tableCounts = {};

// Min/Max constraints for each table type
const tableConstraints = {
    // PART 1 - FOUNDATION
    'foundation-concrete-footing': { min: 1, max: 5 },
    'foundation-concrete-column': { min: 1, max: 5 },
    'foundation-concrete-beam': { min: 1, max: 5 },
    'foundation-concrete-slab': { min: 4, max: 10 },
    'foundation-masonry-wall': { min: 4, max: 10 },
    'foundation-steel-footing': { min: 1, max: 5 },
    'foundation-steel-column': { min: 1, max: 5 },
    'foundation-steel-beam': { min: 1, max: 5 },
    'foundation-steel-slab': { min: 4, max: 10 },
    'foundation-steel-wall': { min: 4, max: 10 },

    // PART 2 - PER FLOOR
    'floor-concrete-column': { min: 1, max: 5 },
    'floor-concrete-beam': { min: 1, max: 5 },
    'floor-concrete-slab': { min: 4, max: 10 },
    'floor-masonry-wall': { min: 4, max: 10 },
    'floor-steel-footing': { min: 1, max: 5 },
    'floor-steel-column': { min: 1, max: 5 },
    'floor-steel-beam': { min: 1, max: 5 },
    'floor-steel-slab': { min: 4, max: 10 },
    'floor-steel-wall': { min: 4, max: 10 }
};

// Initialize all tables
function initializeTables() {
    // PART 1 - FOUNDATION
    // Concrete
    initializeTable('foundation-concrete-footing', 3);
    initializeTable('foundation-concrete-column', 3);
    initializeTable('foundation-concrete-beam', 3);
    initializeTable('foundation-concrete-slab', 4);

    // Masonry
    initializeTable('foundation-masonry-wall', 4);

    // Steel
    initializeTable('foundation-steel-footing', 3);
    initializeTable('foundation-steel-column', 3);
    initializeTable('foundation-steel-beam', 3);
    initializeTable('foundation-steel-slab', 4);
    initializeTable('foundation-steel-wall', 4);

    // PART 2 - PER FLOOR
    // Concrete
    initializeTable('floor-concrete-column', 3);
    initializeTable('floor-concrete-beam', 3);
    initializeTable('floor-concrete-slab', 4);

    // Masonry
    initializeTable('floor-masonry-wall', 4);

    // Steel
    initializeTable('floor-steel-footing', 3);
    initializeTable('floor-steel-column', 3);
    initializeTable('floor-steel-beam', 3);
    initializeTable('floor-steel-slab', 4);
    initializeTable('floor-steel-wall', 4);
}

function initializeTable(tableId, initialCount) {
    // Ensure initial count respects min/max constraints
    const constraints = tableConstraints[tableId] || { min: 1, max: 12 };
    const validCount = Math.min(Math.max(initialCount, constraints.min), constraints.max);

    tableCounts[tableId] = validCount;
    renderTable(tableId);
    updateCountDisplay(tableId);
}

function renderTable(tableId) {
    const count = tableCounts[tableId];
    const tbody = document.getElementById(`${tableId}-body`);
    const tableHead = document.querySelector(`#${tableId}-table thead tr`);

    if (!tbody) return;

    // Update table headers based on table type
    updateTableHeaders(tableId, tableHead);

    let htmlStr = '';

    // Determine table type and render appropriate columns
    const tableType = getTableType(tableId);
    const isSteel = tableId.includes('steel');
    const isMasonry = tableId.includes('masonry');

    for (let i = 1; i <= count; i++) {
        const typeLabel = getTypeLabel(tableType, i, isMasonry);
        htmlStr += '<tr>';

        // First column - Type
        htmlStr += `<td class="footing-type">${typeLabel}</td>`;

        // Generate input columns based on table type
        const inputColumns = getInputColumns(tableType, tableId, i, isSteel, isMasonry);
        htmlStr += inputColumns;

        htmlStr += '</tr>';
    }

    tbody.innerHTML = htmlStr;

    // Update arrow button states (disable if at min/max)
    updateArrowButtons(tableId);
}

function updateTableHeaders(tableId, tableHead) {
    if (!tableHead) return;

    const tableType = getTableType(tableId);
    const isSteel = tableId.includes('steel');
    const isMasonry = tableId.includes('masonry');
    let headers = '<th>Type</th>';

    if (isSteel) {
        // STEEL-specific headers
        switch (tableType) {
            case 'footing':
                headers += '<th>No. of Bars in L (pcs)</th>';
                headers += '<th>No. of Bars in W (pcs)</th>';
                headers += '<th>No. of Footings (pcs)</th>';
                headers += '<th></th>'; // Empty column for layout
                break;

            case 'column':
                headers += '<th>No. of Vertical Bars (pcs)</th>';
                headers += '<th>No. of Lateral Ties (pcs)</th>';
                headers += '<th>No. of Columns (pcs)</th>';
                headers += '<th>Height (m)</th>';
                break;

            case 'beam':
                headers += '<th>No. of Steel Bars (pcs)</th>';
                headers += '<th>No. of Bottom Bars (pcs)</th>';
                headers += '<th>No. of Stirrups (pcs)</th>';
                headers += '<th>Overall Length (m)</th>';
                break;

            case 'slab':
                headers += '<th>No. of Top Bars (pcs)</th>';
                headers += '<th>Bar Spacing (cm)</th>';
                headers += '<th>No. of Slabs (pcs)</th>';
                headers += '<th></th>'; // Empty column for layout
                break;

            case 'wall':
                headers += '<th>Vertical Spacing (cm)</th>';
                headers += '<th>Length of Vertical (m)</th>';
                headers += '<th>Spacing Layer</th>';
                headers += '<th>Length of Horizontal (m)</th>';
                break;

            default:
                headers += '<th>Column 1</th>';
                headers += '<th>Column 2</th>';
                headers += '<th>Column 3</th>';
                headers += '<th>Column 4</th>';
        }
    } else if (isMasonry) {
        // MASONRY-specific headers (UPDATED)
        switch (tableType) {
            case 'wall':
                headers += '<th>Length (m)</th>';
                headers += '<th>Height (m)</th>';
                headers += '<th>No. of Walls (pcs)</th>';
                headers += '<th></th>'; // Empty column for layout
                break;

            default:
                headers += '<th>Column 1</th>';
                headers += '<th>Column 2</th>';
                headers += '<th>Column 3</th>';
                headers += '<th>Column 4</th>';
        }
    } else {
        // Non-steel, non-masonry headers (concrete)
        switch (tableType) {
            case 'footing':
                headers += '<th>Length (M)</th>';
                headers += '<th>Width (M)</th>';
                headers += '<th>Thickness (M)</th>';
                headers += '<th>no. of Footings (pcs)</th>';
                break;

            case 'column':
                headers += '<th>Length (M)</th>';
                headers += '<th>Width (M)</th>';
                headers += '<th>Height (M)</th>';
                headers += '<th>no. of Columns (pcs)</th>';
                break;

            case 'beam':
                headers += '<th>Base (M)</th>';
                headers += '<th>Depth (M)</th>';
                headers += '<th>Length (M)</th>';
                headers += '<th>no. of Beams (pcs)</th>';
                break;

            case 'slab':
                headers += '<th>Length (M)</th>';
                headers += '<th>Width (M)</th>';
                headers += '<th>Thickness (M)</th>';
                headers += '<th>no. of Slabs (pcs)</th>';
                break;

            case 'wall':
                // This shouldn't happen for concrete, but just in case
                headers += '<th>Length (M)</th>';
                headers += '<th>Width (M)</th>';
                headers += '<th>Thickness (M)</th>';
                headers += '<th>no. of Walls (pcs)</th>';
                break;

            default:
                headers += '<th>Column 1</th>';
                headers += '<th>Column 2</th>';
                headers += '<th>Column 3</th>';
                headers += '<th>Column 4</th>';
        }
    }

    tableHead.innerHTML = headers;
}

function getTableType(tableId) {
    if (tableId.includes('footing')) return 'footing';
    if (tableId.includes('column')) return 'column';
    if (tableId.includes('beam')) return 'beam';
    if (tableId.includes('slab')) return 'slab';
    if (tableId.includes('wall')) return 'wall';
    return 'default';
}

function getTypeLabel(tableType, index, isMasonry) {
    // UPDATED: Use "CBH" prefix for masonry walls
    if (isMasonry && tableType === 'wall') {
        return `CBH${index}`;
    }

    switch (tableType) {
        case 'footing': return `F${index}`;
        case 'column': return `C${index}`;
        case 'beam': return `B${index}`;
        case 'slab': return `S${index}`;
        case 'wall': return `W${index}`;
        default: return `${tableType.toUpperCase()}${index}`;
    }
}

function getInputColumns(tableType, tableId, rowIndex, isSteel, isMasonry) {
    let columns = '';
    const baseId = `${tableId}-input-${rowIndex}`;

    if (isSteel) {
        // STEEL-specific inputs with dropdowns where needed
        switch (tableType) {
            case 'footing':
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-1" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-2" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-3" placeholder="..."></td>`;
                columns += `<td></td>`; // Empty cell
                break;

            case 'column':
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-1" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-2" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-3" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-4" placeholder="..."></td>`;
                break;

            case 'beam':
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-1" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-2" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-3" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-4" placeholder="..."></td>`;
                break;

            case 'slab':
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-1" placeholder="..."></td>`;
                // Dropdown for Bar Spacing
                columns += `<td><select class="placeholder-input" id="${baseId}-2">`;
                columns += `<option value="">Select</option>`;
                columns += `<option value="10">10 cm</option>`;
                columns += `<option value="12.5">12.5 cm</option>`;
                columns += `<option value="15">15 cm</option>`;
                columns += `<option value="17.5">17.5 cm</option>`;
                columns += `<option value="20">20 cm</option>`;
                columns += `<option value="22.5">22.5 cm</option>`;
                columns += `<option value="25">25 cm</option>`;
                columns += `</select></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-3" placeholder="..."></td>`;
                columns += `<td></td>`; // Empty cell
                break;

            case 'wall':
                // Dropdown for Vertical Spacing
                columns += `<td><select class="placeholder-input" id="${baseId}-1">`;
                columns += `<option value="">Select</option>`;
                columns += `<option value="40">40 cm</option>`;
                columns += `<option value="60">60 cm</option>`;
                columns += `<option value="80">80 cm</option>`;
                columns += `</select></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-2" placeholder="..."></td>`;
                // Dropdown for Spacing Layer
                columns += `<td><select class="placeholder-input" id="${baseId}-3">`;
                columns += `<option value="">Select</option>`;
                columns += `<option value="2">2</option>`;
                columns += `<option value="3">3</option>`;
                columns += `<option value="4">4</option>`;
                columns += `</select></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-4" placeholder="..."></td>`;
                break;

            default:
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-1" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-2" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-3" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-4" placeholder="..."></td>`;
        }
    } else if (isMasonry) {
        // MASONRY-specific inputs (UPDATED)
        switch (tableType) {
            case 'wall':
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-1" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-2" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-3" placeholder="..."></td>`;
                columns += `<td></td>`; // Empty cell
                break;

            default:
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-1" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-2" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-3" placeholder="..."></td>`;
                columns += `<td><input type="text" class="placeholder-input" id="${baseId}-4" placeholder="..."></td>`;
        }
    } else {
        // Non-steel, non-masonry inputs (concrete - regular text inputs)
        columns += `<td><input type="text" class="placeholder-input" id="${baseId}-1" placeholder="..."></td>`;
        columns += `<td><input type="text" class="placeholder-input" id="${baseId}-2" placeholder="..."></td>`;
        columns += `<td><input type="text" class="placeholder-input" id="${baseId}-3" placeholder="..."></td>`;
        columns += `<td><input type="text" class="placeholder-input" id="${baseId}-4" placeholder="..."></td>`;
    }

    return columns;
}

function updateCountDisplay(tableId) {
    const countDisplay = document.getElementById(`${tableId}-count`);
    if (countDisplay) {
        countDisplay.textContent = tableCounts[tableId];
    }
}

function updateArrowButtons(tableId) {
    const currentCount = tableCounts[tableId];
    const constraints = tableConstraints[tableId] || { min: 1, max: 12 };

    // Find all arrow buttons for this table
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

// Global function for arrow buttons
window.updateTable = function (tableId, change) {
    const currentCount = tableCounts[tableId] || 3;
    const constraints = tableConstraints[tableId] || { min: 1, max: 12 };

    let newCount = currentCount + change;

    // Apply constraints
    if (newCount < constraints.min) newCount = constraints.min;
    if (newCount > constraints.max) newCount = constraints.max;

    // Only update if count actually changed
    if (newCount !== currentCount) {
        tableCounts[tableId] = newCount;
        renderTable(tableId);
        updateCountDisplay(tableId);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    initializeTables();
    initializeSelectors();
});