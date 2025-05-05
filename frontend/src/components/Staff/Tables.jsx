import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Tables = () => {
  const [statusFilter, setStatusFilter] = useState('Sort By');

  const tables = [
    {
      id: 1,
      name: 'Table 1',
      capacity: 2,
      status: 'Available',
      description: 'Cozy table for two by the window.'
    },
    {
      id: 2,
      name: 'Table 2',
      capacity: 4,
      status: 'Occupied',
      description: 'Close to the kitchen, great for quick service.'
    },
    {
      id: 3,
      name: 'Table 3',
      capacity: 6,
      status: 'Reserved',
      description: 'Reserved for a large party in the evening.'
    },
    {
      id: 4,
      name: 'Table 4',
      capacity: 4,
      status: 'Available',
      description: 'Near the entrance, a great spot for people-watching.'
    },
    {
      id: 5,
      name: 'Table 5',
      capacity: 2,
      status: 'Available',
      description: 'Perfect for a romantic dinner.'
    },
    {
      id: 6,
      name: 'Table 6',
      capacity: 4,
      status: 'Occupied',
      description: 'Great for a group of friends.'
    }
  ];

  // Filter tables based on selected status
  const filteredTables = tables.filter((table) => {
    if (statusFilter === 'Sort By') return true;
    return table.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Sort By Heading */}
      

      {/* Sort Dropdown */}
      <div className="mb-6 flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="Sort By">Sort By</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
        </select>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.map((table) => (
          <Link
            to={`/tables/${table.id}`}
            key={table.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg border border-gray-300 transition duration-200 cursor-pointer"
          >
            {/* Table Name */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{table.name}</h2>

            {/* Table Capacity */}
            <div className="text-gray-600 mb-2">
              <strong>Capacity: </strong>{table.capacity} seats
            </div>

            {/* Table Description */}
            <div className="text-gray-600 mb-2">
              <strong>Description: </strong>{table.description}
            </div>

            {/* Table Status */}
            <div className="text-gray-600">
              <strong>Status: </strong>{table.status}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tables;
