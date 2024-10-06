// Sidebar Toggle Functionality
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    sidebar.classList.toggle('w-16');
    sidebar.classList.toggle('w-60');
    const icons = sidebar.querySelectorAll('.sidebar-link i');
    icons.forEach(icon => {
        icon.classList.toggle('hidden');
    });
});

// Chart.js Implementation
document.addEventListener('DOMContentLoaded', function () {
    const ctxEarnings = document.getElementById('earningsChart').getContext('2d');
    const earningsChart = new Chart(ctxEarnings, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Earnings',
                data: [12000, 19000, 30000, 25000, 22000, 30000],
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });

    const ctxUserActivity = document.getElementById('userActivityChart').getContext('2d');
    const userActivityChart = new Chart(ctxUserActivity, {
        type: 'bar',
        data: {
            labels: ['User1', 'User2', 'User3', 'User4', 'User5'],
            datasets: [{
                label: 'User Activity',
                data: [12, 19, 3, 5, 2],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Activity Count'
                    }
                }
            }
        }
    });

    const ctxMonthlyRevenue = document.getElementById('monthlyRevenueChart').getContext('2d');
    const monthlyRevenueChart = new Chart(ctxMonthlyRevenue, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Monthly Revenue',
                data: [5000, 7000, 9000, 6000, 8000, 12000],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                }
            }
        }
    });

    const ctxNewSignups = document.getElementById('newSignupsChart').getContext('2d');
    const newSignupsChart = new Chart(ctxNewSignups, {
        type: 'bar',
        data: {
            labels: ['User1', 'User2', 'User3', 'User4', 'User5'],
            datasets: [{
                label: 'New Signups',
                data: [10, 15, 5, 8, 12],
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Signup Count'
                    }
                }
            }
        }
    });
});
