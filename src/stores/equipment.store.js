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
    async getById(id) {
      const response = await ApiService.get("/equipments/"+id);
      return response.data;
    },
    async create(equipment) {
      const response = await ApiService.post("/equipments", equipment);
      return response.data;
    },
    async update(id, equipment) {
      const response = await ApiService.put("/equipments/"+id, equipment);
      return response.data;
    }
  }
})