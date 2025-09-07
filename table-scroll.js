document.addEventListener('DOMContentLoaded', function() {
    const tableContainer = document.querySelector('.informe-detalle');
    if (!tableContainer) return;

    // Enable native horizontal scrolling
    tableContainer.style.overflowX = 'auto';
    tableContainer.style.overflowY = 'hidden';
    
    // Set minimum width to ensure scrolling works
    const table = tableContainer.querySelector('table');
    if (table) {
        table.style.minWidth = 'max-content';
    }
    
    // Add smooth scrolling for better UX
    tableContainer.style.scrollBehavior = 'smooth';
    
    // Add visual feedback for touch devices
    let isDragging = false;
    let startX;
    let scrollLeft;

    // Touch events
    tableContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - tableContainer.offsetLeft;
        scrollLeft = tableContainer.scrollLeft;
        tableContainer.style.cursor = 'grabbing';
    }, { passive: true });

    tableContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - tableContainer.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        tableContainer.scrollLeft = scrollLeft - walk;
    }, { passive: false });

    tableContainer.addEventListener('touchend', () => {
        isDragging = false;
        tableContainer.style.cursor = 'grab';
    });
    
    // Mouse events for desktop
    tableContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - tableContainer.offsetLeft;
        scrollLeft = tableContainer.scrollLeft;
        tableContainer.style.cursor = 'grabbing';
        e.preventDefault();
    });

    tableContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - tableContainer.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        tableContainer.scrollLeft = scrollLeft - walk;
    });

    tableContainer.addEventListener('mouseup', () => {
        isDragging = false;
        tableContainer.style.cursor = 'grab';
    });

    tableContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        tableContainer.style.cursor = 'grab';
    });
    
    // Handle wheel events for horizontal scrolling
    tableContainer.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            tableContainer.scrollLeft += e.deltaY;
        }
    }, { passive: false });
});
