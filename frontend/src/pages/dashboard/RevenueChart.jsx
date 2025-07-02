import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// ✅ Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = ({ orders }) => {
    // Define months for X-axis
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Map orders to correct months and calculate revenue
    const monthlyRevenue = months.map(month => {
        const monthOrders = orders.filter(o => {
            // The createdAt field contains the year-month string (e.g., "2024-03")
            const [year, monthNum] = o.createdAt.split('-');
            const date = new Date(year, parseInt(monthNum) - 1);
            return date.toLocaleString('default', { month: 'short' }) === month;
        });
        return monthOrders.reduce((total, order) => total + order.totalPrice, 0);
    });

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Monthly Revenue (₹)',
                data: monthlyRevenue,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Revenue Overview',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Revenue (₹)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default RevenueChart;

