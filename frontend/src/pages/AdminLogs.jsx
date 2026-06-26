import React, { useState, useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import { getAllBorrowings } from '../services/borrowingApi';

const AdminLogs = () => {
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await getAllBorrowings();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const query = search.toLowerCase();
    const userName = log.userId?.username || '';
    const bookTitle = log.bookId?.title || '';
    return (
      userName.toLowerCase().includes(query) ||
      bookTitle.toLowerCase().includes(query) ||
      log.status.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status) => {
    if (status === 'overdue') return 'text-red-600';
    if (status === 'borrowed') return 'text-yellow-600';
    return 'text-green-700';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading logs...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Heading & Search */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A2947]">Borrowing Logs</h1>
          <input
            type="text"
            placeholder="Search by user or book..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 px-4 py-2 rounded-lg border border-[#AACCB6] bg-[#fbf5ef] outline-none focus:border-[#8B5E3C] transition-colors"
          />
        </div>

        {/* Logs */}
        <div className="bg-[#fbf5ef] rounded-xl shadow-lg p-6">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <div
                key={log._id || index}
                className={`${
                  index !== filteredLogs.length - 1
                    ? "border-b border-[#96B5A1] pb-5 mb-5"
                    : ""
                }`}
              >
                <p className="leading-8 text-[#0A2947]">
                  <span className="font-bold">
                    {log.userId?.username || 'Unknown User'}
                  </span>
                  {" "}borrowed{" "}
                  <span className="font-semibold text-[#8B5E3C]">
                    {log.bookId?.title || 'Unknown Book'}
                  </span>
                  {" "}on{" "}
                  <span className="font-medium">
                    {formatDate(log.borrowDate)}
                  </span>
                  . It should be returned before{" "}
                  <span className="font-medium">
                    {formatDate(log.dueDate)}
                  </span>
                  .
                  {log.returnDate && (
                    <span>
                      {" "}Returned on{" "}
                      <span className="font-medium">
                        {formatDate(log.returnDate)}
                      </span>
                      .
                    </span>
                  )}
                </p>
                <p className="mt-3">
                  Status :
                  <span className={`ml-2 font-semibold ${getStatusColor(log.status)}`}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                  {log.fine > 0 && (
                    <span className="ml-4 text-red-600 font-semibold">
                      Fine: ₹{log.fine}
                    </span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              {search ? 'No matching logs found.' : 'No borrowings yet.'}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLogs;