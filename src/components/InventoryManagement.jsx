'use client'
import React, { useEffect, useState } from 'react';

const getData = async () => {
    const res = await fetch('/data.json');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};

const InventoryManagement = () => {
    const [items, setItems] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [newItem, setNewItem] = useState({ name: '', stock: '' });
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getData();
                setItems(result.items);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
    };

    const handleAddItem = () => {
        if (newItem.name && newItem.stock !== '') {
            setItems((prevItems) => [
                ...prevItems,
                { id: Date.now(), name: newItem.name, stock: parseInt(newItem.stock) }
            ]);
            setNewItem({ name: '', stock: '' });
        }
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
    };

    const handleUpdateItem = () => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === editingItem.id ? editingItem : item
            )
        );
        setEditingItem(null);
    };

    const handleDeleteItem = (itemId) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    const filteredItems = items.filter((item) =>
        filterStatus === 'All'
            ? true
            : filterStatus === 'In Stock'
            ? item.stock > 0
            : item.stock === 0
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
            <div className="mb-4">
                <label htmlFor="status-filter" className="block text-lg mb-2">Filter by Stock:</label>
                <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded p-2 w-full md:w-1/3"
                >
                    <option value="All">All</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
                <div className="mb-4">
                    <label className="block text-lg mb-2">Item Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newItem.name}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-lg mb-2">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={newItem.stock}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <button
                    onClick={handleAddItem}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Add Item
                </button>
            </div>
            <ul className="list-disc pl-5">
                {filteredItems.map((item) => (
                    <li key={item.id} className="mb-2">
                        <span className="font-bold">{item.name}</span> - Stock: {item.stock}
                        <button
                            onClick={() => handleEditItem(item)}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 ml-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            {editingItem && (
                <div className="bg-white p-4 rounded shadow mt-6">
                    <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
                    <div className="mb-4">
                        <label className="block text-lg mb-2">Item Name</label>
                        <input
                            type="text"
                            name="name"
                            value={editingItem.name}
                            onChange={(e) =>
                                setEditingItem((prevItem) => ({
                                    ...prevItem,
                                    name: e.target.value
                                }))
                            }
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg mb-2">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={editingItem.stock}
                            onChange={(e) =>
                                setEditingItem((prevItem) => ({
                                    ...prevItem,
                                    stock: parseInt(e.target.value)
                                }))
                            }
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <button
                        onClick={handleUpdateItem}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Update Item
                    </button>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
