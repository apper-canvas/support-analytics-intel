import appsData from "@/services/mockData/apps.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AppService {
  async getAll() {
    await delay(300);
    return [...appsData];
  }

  async getById(id) {
    await delay(200);
    const app = appsData.find(app => app.Id === parseInt(id));
    if (!app) {
      throw new Error("App not found");
    }
    return { ...app };
  }

  async create(appData) {
    await delay(400);
    const maxId = appsData.reduce((max, app) => Math.max(max, app.Id), 0);
    const newApp = {
      Id: maxId + 1,
      ...appData,
      createdDate: new Date().toISOString().split('T')[0],
      status: "Development",
      totalUsers: 0
    };
    appsData.push(newApp);
    return { ...newApp };
  }

  async update(id, appData) {
    await delay(350);
    const index = appsData.findIndex(app => app.Id === parseInt(id));
    if (index === -1) {
      throw new Error("App not found");
    }
    appsData[index] = { ...appsData[index], ...appData };
    return { ...appsData[index] };
  }

  async delete(id) {
    await delay(250);
    const index = appsData.findIndex(app => app.Id === parseInt(id));
    if (index === -1) {
      throw new Error("App not found");
    }
    const deletedApp = appsData.splice(index, 1)[0];
    return { ...deletedApp };
  }
}

export default new AppService();