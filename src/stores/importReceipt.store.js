import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useImportReceiptStore = defineStore("useImportReceiptStore", {
  state: () => ({

  }),
  actions: {
    async search(
      code, status, importDate, createdBy, createdAt, updatedAt,
      page, pageSize, key, orderBy
    ) {
      const response = await ApiService.get("/import-receipts", {
        params: {
          code,
          status,
          importDate,
          createdBy,
          createdAt,
          updatedAt,
          page,
          pageSize,
          key,
          orderBy
        }
      });
      return response.data;
    },
    async getById(id) {
      const response = await ApiService.get("/import-receipts/"+id);
      return response.data;
    },
    async create(formData) {
      const response = await ApiService.post("/import-receipts", formData);
      return response.data;
    },
    async update(id, formData) {
      const response = await ApiService.put("/import-receipts/"+id, formData);
      return response.data;
    },
    async changeStatus(id, status) {
      const response = await ApiService.put("/import-receipts/"+id+"/change-status", {
        status: status
      });
      return response.data;
    },
    async delete(id) {
      const response = await ApiService.delete("/import-receipts/"+id);
      return response.data;
    }
  }
})