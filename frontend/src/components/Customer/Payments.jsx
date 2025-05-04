import React, { useEffect, useState } from 'react';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const dummyData = [
      {
        PaymentID: 1,
        RestaurantName: 'Cafe de Karachi',
        Amount: 5000,
        PaymentDate: '2025-05-01T14:30:00',
        Status: 'Completed',
        Method: 'Card',
      },
      {
        PaymentID: 2,
        RestaurantName: 'Bundu Khan',
        Amount: 2500,
        PaymentDate: '2025-05-03T18:00:00',
        Status: 'Pending',
        Method: 'Cash',
      },
    ];
    setPayments(dummyData);
  }, []);

  return (
    <div className="h-screen text-theme-brown">
      <div className="text-4xl text-theme-pink p-7 font-bold border-b">
        Your Payments
      </div>
      <div className="p-6">
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-md">
            <thead className="bg-theme-pink text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Restaurant</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount (PKR)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((payment, index) => (
                <tr key={payment.PaymentID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">{payment.RestaurantName}</td>
                  <td className="px-6 py-4 text-sm font-medium text-theme-brown">{payment.Amount}</td>
                  <td className="px-6 py-4 text-sm">{new Date(payment.PaymentDate).toLocaleString()}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${
                    payment.Status === 'Completed'
                      ? 'text-green-600'
                      : payment.Status === 'Pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {payment.Status}
                  </td>
                  <td className="px-6 py-4 text-sm">{payment.Method}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
