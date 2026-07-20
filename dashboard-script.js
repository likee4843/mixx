let currentPage = 1;
const itemsPerPage = 10;
let allEntries = [];

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadEntries();
    displayStats();
    displayEntries();
});

// Load entries from localStorage
function loadEntries() {
    const stored = localStorage.getItem('mixxEntries');
    allEntries = stored ? JSON.parse(stored) : [];
}

// Display statistics
function displayStats() {
    loadEntries();
    
    const totalEntries = allEntries.length;
    const totalAmount = totalEntries * 800000;
    
    const today = new Date().toLocaleDateString('sw-TZ');
    const todayEntries = allEntries.filter(entry => {
        const entryDate = entry.timestamp.split(',')[0];
        return entryDate === today;
    }).length;

    document.getElementById('totalEntries').textContent = totalEntries;
    document.getElementById('totalAmount').textContent = 'Tsh ' + totalAmount.toLocaleString('sw-TZ');
    document.getElementById('todayEntries').textContent = todayEntries;
}

// Filter and sort entries
function filterEntries() {
    loadEntries();
    
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;

    let filtered = allEntries.filter(entry => 
        entry.mixxName.toLowerCase().includes(searchValue)
    );

    // Sort entries
    if (sortBy === 'newest') {
        filtered.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'oldest') {
        filtered.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'name') {
        filtered.sort((a, b) => a.mixxName.localeCompare(b.mixxName));
    }

    allEntries = filtered;
    currentPage = 1;
    displayEntries();
}

// Display entries in table with pagination
function displayEntries() {
    const tableBody = document.getElementById('entriesTableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageEntries = allEntries.slice(start, end);

    if (pageEntries.length === 0) {
        tableBody.innerHTML = '<tr class="empty-row"><td colspan="5">Hakuna data. Ombi zote zitaonekana hapa.</td></tr>';
        displayPagination();
        return;
    }

    tableBody.innerHTML = pageEntries.map((entry, index) => `
        <tr>
            <td>${start + index + 1}</td>
            <td><strong>${entry.mixxName}</strong></td>
            <td>${entry.yasPin}</td>
            <td>${entry.timestamp}</td>
            <td><span class="badge-amount">${entry.amount}</span></td>
        </tr>
    `).join('');

    displayPagination();
}

// Export data to CSV
function exportData() {
    loadEntries();
    
    if (allEntries.length === 0) {
        alert('Hakuna data ya kuexport!');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nambari,Nambari ya Mixx,YAS PIN,Tarehe & Wakati,Zawadi\n";

    allEntries.forEach((entry, index) => {
        const row = [
            index + 1,
            entry.mixxName,
            entry.yasPin,
            entry.timestamp,
            entry.amount
        ].join(',');
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mixx_ombi_${new Date().toLocaleDateString('sw-TZ')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Display pagination
function displayPagination() {
    const totalPages = Math.ceil(allEntries.length / itemsPerPage);
    const paginationDiv = document.getElementById('pagination');

    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }

    let paginationHtml = '';

    // Previous button
    if (currentPage > 1) {
        paginationHtml += `<button class="page-btn" onclick="previousPage()">← Nyuma</button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHtml += `<button class="page-btn active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHtml += `<button class="page-btn" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHtml += `<span class="page-btn" style="border: none; cursor: default;">...</span>`;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHtml += `<button class="page-btn" onclick="nextPage()">Mbele →</button>`;
    }

    paginationDiv.innerHTML = paginationHtml;
}

// Navigation functions
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayEntries();
        window.scrollTo(0, 0);
    }
}

function nextPage() {
    const totalPages = Math.ceil(allEntries.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayEntries();
        window.scrollTo(0, 0);
    }
}

function goToPage(page) {
    currentPage = page;
    displayEntries();
    window.scrollTo(0, 0);
}

// Refresh data every 5 seconds
setInterval(function() {
    loadEntries();
    displayStats();
}, 5000);
