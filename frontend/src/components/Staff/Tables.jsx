import React, { useEffect, useState } from "react";
import axios from "axios";

const Tables = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const restaurantId = localStorage.getItem("restaurantId");
  const userId = localStorage.getItem("userId"); // adjust if stored differently

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/restaurants/${restaurantId}/tables`
      );
      setTables(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No tables found for this restaurant.");
      } else {
        setError("Error fetching tables: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) fetchTables();
  }, [restaurantId]);

  const filteredTables = tables.filter((table) =>
    statusFilter === "All"
      ? true
      : table.Status?.toLowerCase() === statusFilter.toLowerCase()
  );

  const formatStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "";

  const updateTableStatus = async () => {
    if (!selectedTable) return;
    setUpdating(true);
    try {
      await axios.put(
        `http://localhost:5000/api/tables/${selectedTable.TableID}/status`,
        {
          userId: Number(userId),
          newStatus: selectedTable.Status,
        }
      );
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.TableID === selectedTable.TableID
            ? { ...table, Status: selectedTable.Status }
            : table
        )
      );
      setSelectedTable(null); 
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update table status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col relative">
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
        Restaurant Tables
      </div>

      <div className="h-full bg-gray-50 p-6">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-bold text-theme-pink mb-4">
            {statusFilter} Tables
          </h2>
          <div className="mb-6 flex justify-end">
            <div className="flex flex-col gap-1">
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

        {loading ? (
          <p>Loading tables...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTables.map((table, i) => (
              <div
                key={table.TableID}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg border border-gray-300 transition duration-200 cursor-pointer"
                onClick={() => setSelectedTable(table)}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Table {i + 1}
                </h2>
                <div className="text-gray-600 mb-2">
                  <strong>Capacity: </strong>
                  {table.Capacity} seats
                </div>
                <div className="text-gray-600 mb-2">
                  <strong>Description: </strong>
                  {table.Description}
                </div>
                <div className="text-gray-600">
                  <strong>Status: </strong>
                  {formatStatus(table.Status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-200 relative">
            <button
              onClick={() => setSelectedTable(null)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-theme-pink">
              Table Details
            </h2>

            <div className="mb-4 space-y-2">
              <p>
                <strong>Table:</strong> #{selectedTable.TableID}
              </p>
              <p>
                <strong>Capacity:</strong> {selectedTable.Capacity} people
              </p>
              <p>
                <strong>Description:</strong> {selectedTable.Description}
              </p>

              <div className="mt-4">
                <label
                  htmlFor="status-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status-select"
                  value={selectedTable.Status}
                  onChange={(e) =>
                    setSelectedTable({ ...selectedTable, Status: e.target.value })
                  }
                  className="min-h-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-theme-pink focus:border-theme-pink"
                  disabled={updating}
                >
                  <option value="Free">Free</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>

            <button
              onClick={updateTableStatus}
              disabled={updating}
              className={`mt-1 w-full px-4 py-2 rounded-md text-white ${
                updating ? "bg-pink-300 cursor-not-allowed" : "bg-theme-pink hover:bg-pink-600"
              }`}
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
