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
    return { ...log };
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