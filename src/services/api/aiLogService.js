import aiLogsData from "@/services/mockData/aiLogs.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AILogService {
  async getAll() {
    await delay(400);
    return [...aiLogsData];
  }

async getById(id) {
    await delay(200);
    const log = aiLogsData.find(log => log.Id === parseInt(id));
    if (!log) {
      throw new Error("AI Log not found");
    }
    
    // Enrich log data with detailed information
    const enrichedLog = {
      ...log,
      metadata: {
        requestId: `req_${log.Id}_${Date.now().toString().slice(-6)}`,
        sessionId: `sess_${log.user.split('@')[0]}_${log.Id}`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      contextualInfo: {
        duration: `${(Math.random() * 5 + 0.1).toFixed(2)}s`,
        responseTime: `${Math.floor(Math.random() * 800 + 100)}ms`,
        dataProcessed: `${(Math.random() * 10 + 0.5).toFixed(1)}MB`,
        apiVersion: "v1.2.4"
      },
      stackTrace: log.logLevel === "Error" ? [
        `at processRequest (/app/src/services/processor.js:124:15)`,
        `at handleUserQuery (/app/src/controllers/query.js:89:12)`,
        `at Router.post (/app/src/routes/api.js:45:8)`,
        `at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)`,
        `at next (/app/node_modules/express/lib/router/route.js:137:13)`
      ] : null,
      relatedEvents: aiLogsData
        .filter(relatedLog => 
          relatedLog.Id !== log.Id && 
          (relatedLog.user === log.user || relatedLog.app === log.app)
        )
        .slice(0, 3)
        .map(relatedLog => ({
          Id: relatedLog.Id,
          timestamp: relatedLog.timestamp,
          eventType: relatedLog.eventType,
          logLevel: relatedLog.logLevel,
          message: relatedLog.message.substring(0, 100) + "..."
        }))
    };
    
    return enrichedLog;
  }

  async create(logData) {
    await delay(300);
    const maxId = aiLogsData.reduce((max, log) => Math.max(max, log.Id), 0);
    const newLog = {
      Id: maxId + 1,
      ...logData,
      timestamp: new Date().toISOString()
    };
    aiLogsData.push(newLog);
    return { ...newLog };
  }

  async update(id, logData) {
    await delay(350);
    const index = aiLogsData.findIndex(log => log.Id === parseInt(id));
    if (index === -1) {
      throw new Error("AI Log not found");
    }
    aiLogsData[index] = { ...aiLogsData[index], ...logData };
    return { ...aiLogsData[index] };
  }

  async delete(id) {
    await delay(250);
    const index = aiLogsData.findIndex(log => log.Id === parseInt(id));
    if (index === -1) {
      throw new Error("AI Log not found");
    }
    const deletedLog = aiLogsData.splice(index, 1)[0];
    return { ...deletedLog };
  }
}

export default new AILogService();