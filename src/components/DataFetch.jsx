"use client"
import React, { useEffect, useState } from 'react';

const getData = async () => {
    const res = await fetch('/data.json');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};

const DataFetch = () => {
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortCriteria, setSortCriteria] = useState({ field: '', direction: '' });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null); // State for selected item detail

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getData();
                setOrders(result.orders);
                setItems(result.items);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Filtering and sorting logic
    const filteredOrders = orders.filter(order => 
        filterStatus === 'All' || order.status === filterStatus
    );

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortCriteria.field === 'customer') {
            if (a.customer < b.customer) return sortCriteria.direction === 'asc' ? -1 : 1;
            if (a.customer > b.customer) return sortCriteria.direction === 'asc' ? 1 : -1;
            return 0;
        }
        if (sortCriteria.field === 'itemCount') {
            const aItemCount = a.items.reduce((acc, item) => acc + item.quantity, 0);
            const bItemCount = b.items.reduce((acc, item) => acc + item.quantity, 0);
            return sortCriteria.direction === 'asc' ? aItemCount - bItemCount : bItemCount - aItemCount;
        }
        return 0;
    });

    // Event handlers for filter and sort
    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleSortChange = (field) => {
        setSortCriteria(prevState => ({
            field,
            direction: prevState.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setSelectedItem(null); // Reset selected item when selecting a different order
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const handleMarkAsCompleted = (orderId) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, status: 'Completed' } : order
            )
        );
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Orders List</h1>
            {selectedOrder ? (
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                    <p><strong>Status:</strong> {selectedOrder.status}</p>
                    <ul className="list-disc pl-5">
                        {selectedOrder.items.map(item => (
                            <li key={item.id} className="mb-2">
                                {item.name} - Quantity: {item.quantity} -
                                <button
                                    onClick={() => handleItemClick(item)}
                                    className="text-blue-500 hover:underline focus:outline-none"
                                >
                                    Show Item Detail
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                        onClick={() => handleMarkAsCompleted(selectedOrder.id)}
                    >
                        Mark as Completed
                    </button>
                    <button 
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4 ml-2"
                        onClick={() => setSelectedOrder(null)}
                    >
                        Back to Orders
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <label htmlFor="status-filter" className="block text-lg mb-2">Filter by Status:</label>
                        <select 
                            id="status-filter" 
                            value={filterStatus} 
                            onChange={handleFilterChange} 
                            className="border border-gray-300 rounded p-2 w-full md:w-1/3"
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="mb-4 flex space-x-2">
                        <button 
                            onClick={() => handleSortChange('customer')} 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Sort by Customer {sortCriteria.field === 'customer' && (sortCriteria.direction === 'asc' ? '▲' : '▼')}
                        </button>
                        <button 
                            onClick={() => handleSortChange('itemCount')} 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Sort by Item Count {sortCriteria.field === 'itemCount' && (sortCriteria.direction === 'asc' ? '▲' : '▼')}
                        </button>
                    </div>
                    <ul className="list-disc pl-5">
                        {sortedOrders.map((order) => (
                            <li 
                                key={order.id} 
                                className="mb-2 cursor-pointer" 
                                onClick={() => handleOrderClick(order)}
                            >
                                <span className="font-bold">{order.id}</span> - {order.customer} - {order.status} - {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* Render item details when an item is selected */}
            {selectedItem && (
                <div className="bg-white p-4 rounded shadow mt-4">
                    <h2 className="text-2xl font-bold mb-4">Item Details</h2>
                    <p><strong>Item ID:</strong> {selectedItem.id}</p>
                    <p><strong>Name:</strong> {selectedItem.name}</p>
                    <p><strong>Stock:</strong> {selectedItem.stock}</p>
                    <button 
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        Back to Orders
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataFetch;
