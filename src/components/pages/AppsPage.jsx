import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import appService from "@/services/api/appService";
import DataTable from "@/components/organisms/DataTable";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const AppsPage = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appService.getAll();
      setApps(data);
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
      key: "status",
      header: "Status",
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: "performanceScore",
      header: "Performance Score",
      render: (value) => {
        const getScoreColor = (score) => {
          if (score >= 85) return "text-green-600 bg-green-50";
          if (score >= 70) return "text-yellow-600 bg-yellow-50";
          return "text-red-600 bg-red-50";
        };
        
        return (
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreColor(value)}`}>
              {value}
            </div>
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  value >= 85 ? 'bg-green-500' : 
                  value >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${value}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
    {
      key: "totalUsers",
      header: "Users Count",
      render: (value) => (
        <div className="font-semibold text-gray-900">
          {value.toLocaleString()}
        </div>
      )
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      render: (value) => (
        <div className="text-gray-600">
          {format(new Date(value), "MMM dd, yyyy 'at' HH:mm")}
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
            Applications
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor application status and user metrics
          </p>
        </div>
        
        <div className="flex space-x-4">
          <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="text-2xl font-bold">{apps.length}</div>
            <div className="text-xs opacity-90">Total Apps</div>
          </div>
          <div className="bg-gradient-to-r from-success to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <div className="text-xs opacity-90">Total Users</div>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={apps} />
    </motion.div>
  );
};

export default AppsPage;