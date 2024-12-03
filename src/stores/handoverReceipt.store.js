import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useHandoverReceiptStore = defineStore("useHandoverReceiptStore", {
  state: () => ({

  }),
  actions: {
    async search(
      code, status, handoverDate, createdBy, departmentId, createdAt, approvedAt,
      page, pageSize, key, orderBy
    ) {
      const response = await ApiService.get("/handover-receipts", {
        params: {
          code,
          status,
          handoverDate,
          createdBy,
          departmentId,
          createdAt,
          approvedAt,
          page,
          pageSize,
          key,
          orderBy
        }
      });
      return response.data;
    },
    async getById(id) {
      const response = await ApiService.get("/handover-receipts/"+id);
      return response.data;
    },
    async create(formData) {
      const response = await ApiService.post("/handover-receipts", formData);
      return response.data;
    },
    async update(id, formData) {
      const response = await ApiService.put("/handover-receipts/"+id, formData);
      return response.data;
    },
    async changeStatus(id, status) {
      const response = await ApiService.put("/handover-receipts/"+id+"/change-status", {
        status: status
      });
      return response.data;
    },
    async delete(id) {
      const response = await ApiService.delete("/handover-receipts/"+id);
      return response.data;
    }
  }
})