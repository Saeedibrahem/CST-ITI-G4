        // ================================
        // Chart initialization (fixed)
        // - create gradient using the canvas context BEFORE building the config
        // - ensure Chart.js script tag is above this script block
        // ================================

        // Get the canvas context
        const canvas = document.getElementById('salesChart');
        const ctx = canvas.getContext('2d');

        // Create gradient for background
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(24,119,242,0.25)');
        gradient.addColorStop(1, 'rgba(24,119,242,0.02)');

        // Chart data (mobile-first: daily labels)
        const initialLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const initialData = [2, 3, 1, 4, 2, 5, 3];

        const salesConfig = {
            type: 'line',
            data: {
                labels: initialLabels,
                datasets: [{
                    label: 'Sales Over Time',
                    data: initialData,
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 3,
                    borderColor: 'rgba(24,119,242,1)',
                    backgroundColor: gradient
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        };

        // Create the chart instance
        const salesChart = new Chart(ctx, salesConfig);

        // Change data when user clicks pills
        document.querySelectorAll('[data-bs-toggle="pill"]').forEach(btn => {
            btn.addEventListener('shown.bs.tab', (e) => {
                const target = e.target.getAttribute('href'); // '#daily' or '#monthly' or '#yearly'
                if (target === '#daily') {
                    salesChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    salesChart.data.datasets[0].data = [2, 3, 1, 4, 2, 5, 3];
                } else if (target === '#monthly') {
                    salesChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                    salesChart.data.datasets[0].data = [10, 12, 8, 14, 9, 16];
                } else {
                    salesChart.data.labels = ['2019', '2020', '2021', '2022', '2023'];
                    salesChart.data.datasets[0].data = [120, 150, 200, 180, 210];
                }
                salesChart.update();
            });
        });

        // Close offcanvas on mobile after clicking a link
        document.querySelectorAll('#sidebarOffcanvas .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const offcanvasEl = document.getElementById('sidebarOffcanvas');
                const instance = bootstrap.Offcanvas.getInstance(offcanvasEl);
                if (instance) instance.hide();
            });
        });