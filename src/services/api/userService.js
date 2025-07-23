import usersData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  async getAll() {
    await delay(300);
    return [...usersData];
  }

  async getById(id) {
    await delay(200);
    const user = usersData.find(user => user.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async create(userData) {
    await delay(400);
    const maxId = usersData.reduce((max, user) => Math.max(max, user.Id), 0);
    const newUser = {
      Id: maxId + 1,
      ...userData,
      registrationDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString(),
      status: "Pending"
    };
    usersData.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await delay(350);
    const index = usersData.findIndex(user => user.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    usersData[index] = { ...usersData[index], ...userData };
    return { ...usersData[index] };
  }

  async delete(id) {
    await delay(250);
    const index = usersData.findIndex(user => user.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    const deletedUser = usersData.splice(index, 1)[0];
    return { ...deletedUser };
return { ...deletedUser };
  }

  async search(searchTerm, statusFilter = null) {
    await delay(200);
    let results = [...usersData];
    
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.Id.toString().includes(term)
      );
    }
    
    if (statusFilter && statusFilter !== 'All') {
      results = results.filter(user => user.status === statusFilter);
    }
    
    return results;
  }
}