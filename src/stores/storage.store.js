import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useStorageStore = defineStore("useStorageStore", {
  state: () => ({

  }),
  actions: {
    async getAll() {
      const response = await ApiService.get("/storages");
      return response.data;
    },
    async getById(id) {
      const response = await ApiService.get("/storages/"+id);
      return response.data;
    },
    async create(storage) {
      const response = await ApiService.post("/storages", storage);
      return response.data;
    },
    async update(storage) {
      const response = await ApiService.put("/storages/"+storage.id, storage);
      return response.data;
    },
    async delete(id) {
      const response = await ApiService.delete("/storages/"+id);
      return response.data;
    }
  }
})