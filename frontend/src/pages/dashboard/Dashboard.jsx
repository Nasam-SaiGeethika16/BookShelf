import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle } from 'react-icons/md';
import RevenueChart from './RevenueChart';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const { data: books = [] } = useFetchAllBooksQuery();
    const [visitorsToday, setVisitorsToday] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${getBaseUrl()}/api/admin`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                // Transform monthly sales data into the format expected by RevenueChart
                const transformedData = {
                    ...response.data,
                    orders: response.data.monthlySales?.map(sale => ({
                        createdAt: sale._id, // This is the year-month string
                        totalPrice: sale.totalSales
                    })) || []
                };

                setData(transformedData);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        axios.get('/api/admin/visitors-today')
            .then(res => setVisitorsToday(res.data.count))
            .catch(() => setVisitorsToday(0));
    }, []);

    // Pie chart data for category interest
    const categoryCounts = {};
    (books || []).forEach(book => {
        const cat = book.category || 'Unknown';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const pieData = {
        labels: Object.keys(categoryCounts),
        datasets: [
            {
                data: Object.values(categoryCounts),
                backgroundColor: [
                    '#4ade80', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#34d399', '#f472b6', '#facc15', '#38bdf8', '#f87171',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Trending books count
    const trendingCount = (books || []).filter(book => book.trending).length;

    if (loading) return <Loading />;

  return (
        <div className="space-y-8 ml-64">
     <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="flex items-center p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-800 dark:text-green-400 bg-green-100 dark:bg-green-900 rounded-full mr-6">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                        <span className="block text-2xl font-bold text-green-800 dark:text-green-400">{data?.totalBooks || 0}</span>
                        <span className="block text-gray-500 dark:text-gray-400">Total Books</span>
                    </div>
                </div>
                <div className="flex items-center p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-800 dark:text-green-400 bg-green-100 dark:bg-green-900 rounded-full mr-6">
                        <MdIncompleteCircle className='size-6' />
                </div>
                <div>
                        <span className="block text-2xl font-bold text-green-800 dark:text-green-400">{data?.totalOrders || 0}</span>
                        <span className="block text-gray-500 dark:text-gray-400">Total Orders</span>
                    </div>
                </div>
                {/* Trending Books Card */}
                <div className="flex items-center p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-800 dark:text-green-400 bg-green-100 dark:bg-green-900 rounded-full mr-6">
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <div>
                        <span className="block text-2xl font-bold text-green-800 dark:text-green-400">{trendingCount}</span>
                        <span className="block text-gray-500 dark:text-gray-400">Trending Books</span>
                </div>
              </div>
            </section>

            {/* Full-width Graph Section with Dynamic Data */}
            <section className="grid md:grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="flex flex-col bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-6 py-5 font-semibold border-b border-gray-100 dark:border-gray-700">Monthly Revenue Overview</div>
                <div className="p-4 flex-grow">
                        <RevenueChart orders={data?.orders || []} />
                  </div>
                </div>
                {/* Category Interest Chart Card */}
                <div className="flex flex-col bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-6 py-5 font-semibold border-b border-gray-100 dark:border-gray-700">Category Interest Overview</div>
                    <div className="p-4 flex-grow flex items-center justify-center">
                        {pieData.labels.length > 0 ? (
                            <div className="w-full max-w-xs">
                                <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} />
              </div>
                        ) : (
                            <span className="text-gray-500 dark:text-gray-400">No category data</span>
                        )}
                </div>
              </div>
            </section>
        </div>
    );
};

export default Dashboard;
