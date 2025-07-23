import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import appService from "@/services/api/appService";
import DataTable from "@/components/organisms/DataTable";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const DashboardPage = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appService.getAll();
      // Remove "Dashboard" from app names
      const processedData = data.map(app => ({
        ...app,
        appName: app.appName.replace(/Dashboard\s*/gi, '').trim()
      }));
      setApps(processedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const columns = [
    {
      key: "appName",
      header: "App Name",
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: "createdDate",
      header: "Created Date",
      render: (value) => (
        <div className="text-gray-600">
          {format(new Date(value), "MMM dd, yyyy")}
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: "totalUsers",
      header: "Total Users",
      render: (value) => (
        <div className="font-semibold text-gray-900">
          {value.toLocaleString()}
        </div>
      )
    }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadApps} />;
  }

  if (apps.length === 0) {
    return (
      <Empty
        title="No apps found"
        description="There are no applications in the system yet."
        icon="AppWindow"
      />
    );
  }

  const totalUsers = apps.reduce((sum, app) => sum + app.totalUsers, 0);
  const activeApps = apps.filter(app => app.status === 'Active').length;

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
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of all applications and their metrics
          </p>
        </div>
        
        <div className="flex space-x-4">
          <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="text-2xl font-bold">{apps.length}</div>
            <div className="text-xs opacity-90">Total Apps</div>
          </div>
          <div className="bg-gradient-to-r from-success to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="text-2xl font-bold">{activeApps}</div>
            <div className="text-xs opacity-90">Active Apps</div>
          </div>
          <div className="bg-gradient-to-r from-info to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <div className="text-xs opacity-90">Total Users</div>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={apps} sortable={true} />
    </motion.div>
  );
};

export default DashboardPage;