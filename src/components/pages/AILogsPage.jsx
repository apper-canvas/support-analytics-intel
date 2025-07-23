import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import aiLogService from "@/services/api/aiLogService";
import DataTable from "@/components/organisms/DataTable";
import LogLevelBadge from "@/components/molecules/LogLevelBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const AILogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aiLogService.getAll();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const columns = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (value) => (
        <div className="text-gray-600 font-mono text-xs">
          {format(new Date(value), "MMM dd, HH:mm:ss")}
        </div>
      )
    },
    {
      key: "user",
      header: "User",
      render: (value) => (
        <div className="text-gray-900 font-medium text-sm">{value}</div>
      )
    },
    {
      key: "app",
      header: "App",
      render: (value) => (
        <div className="text-gray-700">{value}</div>
      )
    },
    {
      key: "eventType",
      header: "Event Type",
      render: (value) => (
        <div className="text-gray-600">{value}</div>
      )
    },
    {
      key: "logLevel",
      header: "Log Level",
      render: (value) => <LogLevelBadge level={value} />
    }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadLogs} />;
  }

  if (logs.length === 0) {
    return (
      <Empty
        title="No logs found"
        description="There are no AI logs in the system yet."
        icon="FileText"
      />
    );
  }

  const errorCount = logs.filter(log => log.logLevel === "Error").length;
  const warningCount = logs.filter(log => log.logLevel === "Warning").length;
  const infoCount = logs.filter(log => log.logLevel === "Info").length;

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
            AI Logs
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor AI system events and troubleshoot issues
          </p>
        </div>
        
        <div className="flex space-x-3">
          <div className="bg-gradient-to-r from-error to-red-600 text-white px-3 py-2 rounded-lg shadow-lg">
            <div className="text-xl font-bold">{errorCount}</div>
            <div className="text-xs opacity-90">Errors</div>
          </div>
          <div className="bg-gradient-to-r from-warning to-amber-600 text-white px-3 py-2 rounded-lg shadow-lg">
            <div className="text-xl font-bold">{warningCount}</div>
            <div className="text-xs opacity-90">Warnings</div>
          </div>
          <div className="bg-gradient-to-r from-info to-cyan-600 text-white px-3 py-2 rounded-lg shadow-lg">
            <div className="text-xl font-bold">{infoCount}</div>
            <div className="text-xs opacity-90">Info</div>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={logs} />
    </motion.div>
  );
};

export default AILogsPage;