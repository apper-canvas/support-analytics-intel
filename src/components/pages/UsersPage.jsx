import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import userService from "@/services/api/userService";
import ApperIcon from "@/components/ApperIcon";
import { Button } from "@/components/atoms/Button";
import DataTable from "@/components/organisms/DataTable";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
const loadFilteredUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.search(searchTerm, statusFilter);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilteredUsers();
  }, [searchTerm, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const statusButtons = [
    { key: "All", label: "All", count: users.length },
    { key: "Active", label: "Active" },
    { key: "Inactive", label: "Inactive" },
    { key: "New", label: "New" }
  ];

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: "email",
      header: "Email",
      render: (value) => (
        <div className="text-gray-600">{value}</div>
      )
    },
    {
      key: "registrationDate",
      header: "Registration Date",
      render: (value) => (
        <div className="text-gray-600">
          {format(new Date(value), "MMM dd, yyyy")}
        </div>
      )
    },
    {
      key: "lastActivity",
      header: "Last Activity",
      render: (value) => (
        <div className="text-gray-600">
          {format(new Date(value), "MMM dd, yyyy HH:mm")}
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <StatusBadge status={value} />
    }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

if (error) {
    return <Error message={error} onRetry={loadFilteredUsers} />;
  }

  if (users.length === 0) {
    return (
      <Empty
        title="No users found"
        description="There are no users in the system yet."
        icon="Users"
      />
    );
  }

return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Users
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor user accounts and activity
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="text-2xl font-bold">{users.length}</div>
          <div className="text-xs opacity-90">Total Users</div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ApperIcon name="Search" size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {statusButtons.map((status) => (
              <Button
                key={status.key}
                variant={statusFilter === status.key ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilter(status.key)}
                className="transition-all duration-200"
              >
                {status.label}
                {status.count !== undefined && (
                  <span className="ml-1 text-xs opacity-75">
                    ({status.count})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={users} />
    </motion.div>
  );
};

export default UsersPage;