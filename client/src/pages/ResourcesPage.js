import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [newResourceName, setNewResourceName] = useState('');
    const [error, setError] = useState('');

    // Fetch resources on component mount
    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await axios.get('/api/resources');
            setResources(response.data);
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError('Failed to load resources');
        }
    };

    const handleAddResource = async () => {
        if (!newResourceName) {
            setError('Resource name cannot be empty');
            return;
        }

        try {
            const response = await axios.post('/api/resources', { name: newResourceName });
            setResources([...resources, response.data]);
            setNewResourceName('');
            setError('');
        } catch (err) {
            console.error('Error adding resource:', err);
            setError('Failed to add resource');
        }
    };

    const handleDeleteResource = async (id) => {
        try {
            await axios.delete(`/api/resources/${id}`);
            setResources(resources.filter(resource => resource.id !== id));
        } catch (err) {
            console.error('Error deleting resource:', err);
            setError('Failed to delete resource');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">Resources</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="w-full max-w-md mb-8">
                <input
                    type="text"
                    placeholder="Enter resource name"
                    value={newResourceName}
                    onChange={(e) => setNewResourceName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                />
                <button
                    onClick={handleAddResource}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Add Resource
                </button>
            </div>

            <ul className="w-full max-w-md bg-white rounded shadow divide-y divide-gray-200">
                {resources.map(resource => (
                    <li
                        key={resource.id}
                        className="flex justify-between items-center px-4 py-2"
                        data-testid="resource-item"
                    >
                        {resource.name}
                        <button
                            onClick={() => handleDeleteResource(resource.id)}
                            className="text-red-600 hover:underline"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResourcesPage;
