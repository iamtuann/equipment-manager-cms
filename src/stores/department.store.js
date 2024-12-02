import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useDepartmentStore = defineStore("useDepartmentStore", {
  state: () => ({

  }),
  actions: {
    async getAll() {
      const response = await ApiService.get("/departments");
      return response.data;
    },
    async getById(id) {
      const response = await ApiService.get("/departments/"+id);
      return response.data;
    },
    async create(department) {
      const response = await ApiService.post("/departments", department);
      return response.data;
    },
    async update(id, department) {
      const response = await ApiService.put("/departments/"+id, department);
      return response.data;
    }
  }
})