import React, { useState } from 'react';

const TableDetails = () => {
  const [table, setTable] = useState({
    id: 1,
    capacity: 4,
    description: 'Corner table near the window',
    status: 'Available',
  });

  const [selectedStatus, setSelectedStatus] = useState(table.status);

  const handleUpdate = () => {
    setTable((prev) => ({ ...prev, status: selectedStatus }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-theme-pink">Table Details</h2>

        <div className="mb-4 space-y-2">
          <p><strong>Table:</strong> #{table.id}</p>
          <p><strong>Capacity:</strong> {table.capacity} people</p>
          <p><strong>Description:</strong> {table.description}</p>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-theme-pink focus:border-theme-pink"
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="mt-6 bg-theme-pink text-white px-4 py-2 rounded-md hover:bg-pink-600 w-full"
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default TableDetails;
