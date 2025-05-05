import React, { useState } from 'react';

const Tables = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTable, setSelectedTable] = useState(null);
  const tables = [
    {
      id: 1,
      name: 'Table 1',
      capacity: 2,
      status: 'Free',
      description: 'Cozy table for two by the window.',
    },
    {
      id: 2,
      name: 'Table 2',
      capacity: 4,
      status: 'Occupied',
      description: 'Close to the kitchen, great for quick service.',
    },
    {
      id: 3,
      name: 'Table 3',
      capacity: 6,
      status: 'Reserved',
      description: 'Reserved for a large party in the evening.',
    },
    {
      id: 4,
      name: 'Table 4',
      capacity: 4,
      status: 'Free',
      description: 'Near the entrance, a great spot for people-watching.',
    },
    {
      id: 5,
      name: 'Table 5',
      capacity: 2,
      status: 'Free',
      description: 'Perfect for a romantic dinner.',
    },
    {
      id: 6,
      name: 'Table 6',
      capacity: 4,
      status: 'Occupied',
      description: 'Great for a group of friends.',
    },
  ];

  const filteredTables = tables.filter((table) => {
    if (statusFilter === 'All') return true;
    return table.status === statusFilter;
  });

  return (
    <div className="h-screen flex flex-col relative">
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
        Restaurant Tables
      </div>
      <div className="h-full bg-gray-50 p-6">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold text-theme-pink mb-4">{statusFilter} Tables</h2>
          <div className="mb-6 flex justify-end">
            <div className='flex flex-col gap-1'>
              <div className="text-gray-500 text-sm">Filter By</div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="All">All</option>
                <option value="Free">Free</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg border border-gray-300 transition duration-200 cursor-pointer"
              onClick={() => setSelectedTable(table)}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{table.name}</h2>
              <div className="text-gray-600 mb-2">
                <strong>Capacity: </strong>{table.capacity} seats
              </div>
              <div className="text-gray-600 mb-2">
                <strong>Description: </strong>{table.description}
              </div>
              <div className="text-gray-600">
                <strong>Status: </strong>{table.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-200 relative">
            <button
              onClick={() => setSelectedTable(null)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-theme-pink">Table Details</h2>

            <div className="mb-4 space-y-2">
              <p><strong>Table:</strong> #{selectedTable.id}</p>
              <p><strong>Capacity:</strong> {selectedTable.capacity} people</p>
              <p><strong>Description:</strong> {selectedTable.description}</p>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedTable.status}
                  onChange={(e) =>
                    setSelectedTable({ ...selectedTable, status: e.target.value })
                  }
                  className=" min-h-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-theme-pink focus:border-theme-pink"
                >
                  <option value="Free">Free</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                // Optionally update your backend or state
                setSelectedTable(null); // close modal
              }}
              className="mt-1 bg-theme-pink text-white px-4 py-2 rounded-md hover:bg-pink-600 w-full"
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
