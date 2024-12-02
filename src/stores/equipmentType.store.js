import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useEquipmentTypeStore = defineStore("useEquipmentTypeStore", {
  state: () => ({

  }),
  actions: {
    async getAll() {
      const response = await ApiService.get("/types");
      return response.data;
    },
    async getById(id) {
      const response = await ApiService.get("/types/"+id);
      return response.data;
    },
    async create(equipmentType) {
      const response = await ApiService.post("/types", equipmentType);
      return response.data;
    },
    async update(equipmentType) {
      const response = await ApiService.put("/types/"+equipmentType.id, equipmentType);
      return response.data;
    },
    async delete(id) {
      const response = await ApiService.delete("/types/"+id);
      return response.data;
    }
  }
})