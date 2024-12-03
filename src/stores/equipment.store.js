import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useEquipmentStore = defineStore("useEquipmentStore", {
  state: () => ({

  }),
  actions: {
    async search(
      code, status, typeId, departmentId, storageId, receiveDate, warrantyDate,
      page, pageSize, key, orderBy
    ) {
      const response = await ApiService.get("/equipments", {
        params: {
          code,
          status,
          typeId,
          departmentId,
          storageId,
          receiveDate,
          warrantyDate,
          page,
          pageSize,
          key,
          orderBy
        }
      });
      return response.data;
    },
    async searchInDepartment(departmentId, page, pageSize, key, orderBy) {
      return this.search(null, null, null, departmentId, null, null, null, page, pageSize, key, orderBy);
    },
    async searchInStorage(storageId, page, pageSize, key, orderBy) {
      return this.search(null, null, null, null, storageId, null, null, page, pageSize, key, orderBy);
    },
    async getAllInStorage(typeId, storageId, status) {
      const response = await ApiService.get("/equipments/all/in-storage", {
        params: {
          typeId,
          status,
          storageId
        }
      });
      return response.data;
    },
    async getById(id) {
      const response = await ApiService.get("/equipments/"+id);
      return response.data;
    },
    async create(equipment) {
      const response = await ApiService.post("/equipments", equipment);
      return response.data;
    },
    async addToDepartment(departmentId, equipmentIds) {
      const response = await ApiService.post("/equipments/add-to-department", {
        departmentId,
        equipmentIds
      });
      return response.data;
    },
    async addToStorage(storageId, equipmentIds) {
      const response = await ApiService.post("/equipments/add-to-storage", {
        storageId,
        equipmentIds
      });
      return response.data;
    },
    async update(id, equipment) {
      const response = await ApiService.put("/equipments/"+id, equipment);
      return response.data;
    },
    async delete(id) {
      const response = await ApiService.delete("/equipments/"+id);
      return response.data;
    }
  }
})