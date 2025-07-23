import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import aiLogService from "@/services/api/aiLogService";
import ApperIcon from "@/components/ApperIcon";
import DataTable from "@/components/organisms/DataTable";
import LogLevelBadge from "@/components/molecules/LogLevelBadge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const AILogsPage = () => {
const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleRowClick = async (row) => {
    try {
      const detailedLog = await aiLogService.getById(row.Id);
      setSelectedLog(detailedLog);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to load log details:", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLog(null);
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
    },
    {
      key: "message",
      header: "Message",
      render: (value) => (
        <div className="text-gray-700 max-w-md truncate" title={value}>
          {value}
        </div>
      )
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

<DataTable columns={columns} data={logs} sortable={true} onRowClick={handleRowClick} />
      
      {showModal && selectedLog && (
        <LogDetailModal log={selectedLog} onClose={handleCloseModal} />
      )}
    </motion.div>
  );
};

const LogDetailModal = ({ log, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    metadata: false,
    context: false,
    stackTrace: false,
    relatedEvents: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="FileText" size={24} className="text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">Log Details</h2>
            </div>
            <LogLevelBadge level={log.logLevel} />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Timestamp</label>
                  <div className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                    {format(new Date(log.timestamp), "MMM dd, yyyy 'at' HH:mm:ss")}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">User</label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{log.user}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Application</label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{log.app}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Type</label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{log.eventType}</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Log Level</label>
                  <div className="bg-gray-50 p-2 rounded">
                    <LogLevelBadge level={log.logLevel} />
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <div className="text-sm text-gray-900 bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                {log.message}
              </div>
            </div>

            {/* Metadata Section */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('metadata')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Info" size={16} className="text-gray-600" />
                  <span className="font-semibold text-gray-900">Metadata</span>
                </div>
                <ApperIcon 
                  name={expandedSections.metadata ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-gray-400" 
                />
              </button>
              {expandedSections.metadata && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Request ID:</span>
                      <div className="text-sm text-gray-900 font-mono">{log.metadata.requestId}</div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Session ID:</span>
                      <div className="text-sm text-gray-900 font-mono">{log.metadata.sessionId}</div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">IP Address:</span>
                      <div className="text-sm text-gray-900 font-mono">{log.metadata.ipAddress}</div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">User Agent:</span>
                      <div className="text-sm text-gray-900 truncate">{log.metadata.userAgent}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contextual Information */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('context')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={16} className="text-gray-600" />
                  <span className="font-semibold text-gray-900">Performance Context</span>
                </div>
                <ApperIcon 
                  name={expandedSections.context ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-gray-400" 
                />
              </button>
              {expandedSections.context && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Duration:</span>
                      <div className="text-sm text-gray-900 font-mono">{log.contextualInfo.duration}</div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Response Time:</span>
                      <div className="text-sm text-gray-900 font-mono">{log.contextualInfo.responseTime}</div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">Data Processed:</span>
                      <div className="text-sm text-gray-900 font-mono">{log.contextualInfo.dataProcessed}</div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-700">API Version:</span>
                      <div className="text-sm text-gray-900 font-mono">{log.contextualInfo.apiVersion}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stack Trace (for errors) */}
            {log.stackTrace && (
              <div className="border border-red-200 rounded-lg">
                <button
                  onClick={() => toggleSection('stackTrace')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="AlertTriangle" size={16} className="text-red-600" />
                    <span className="font-semibold text-red-900">Stack Trace</span>
                  </div>
                  <ApperIcon 
                    name={expandedSections.stackTrace ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-red-400" 
                  />
                </button>
                {expandedSections.stackTrace && (
                  <div className="border-t border-red-200 p-4 bg-red-50">
                    <div className="space-y-1">
                      {log.stackTrace.map((line, index) => (
                        <div key={index} className="text-sm text-red-900 font-mono bg-white p-2 rounded border-l-2 border-red-300">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Related Events */}
            {log.relatedEvents.length > 0 && (
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('relatedEvents')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Link" size={16} className="text-gray-600" />
                    <span className="font-semibold text-gray-900">Related Events ({log.relatedEvents.length})</span>
                  </div>
                  <ApperIcon 
                    name={expandedSections.relatedEvents ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-gray-400" 
                  />
                </button>
                {expandedSections.relatedEvents && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="space-y-2">
                      {log.relatedEvents.map((event) => (
                        <div key={event.Id} className="bg-white p-3 rounded border-l-4 border-blue-500 hover:bg-blue-50 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-900">{event.eventType}</span>
                            <LogLevelBadge level={event.logLevel} />
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            {format(new Date(event.timestamp), "MMM dd, HH:mm:ss")}
                          </div>
                          <div className="text-sm text-gray-700">{event.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default AILogsPage;