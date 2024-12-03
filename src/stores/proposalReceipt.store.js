import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useProposalReceiptStore = defineStore("useProposalReceiptStore", {
  state: () => ({

  }),
  actions: {
    async search(
      code, status, proposalDate, createdBy, departmentId, createdAt, approvedAt,
      page, pageSize, key, orderBy
    ) {
      const response = await ApiService.get("/proposal-receipts", {
        params: {
          code,
          status,
          proposalDate,
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
      const response = await ApiService.get("/proposal-receipts/"+id);
      return response.data;
    },
    async create(formData) {
      const response = await ApiService.post("/proposal-receipts", formData);
      return response.data;
    },
    async update(id, formData) {
      const response = await ApiService.put("/proposal-receipts/"+id, formData);
      return response.data;
    },
    async changeStatus(id, status) {
      const response = await ApiService.put("/proposal-receipts/"+id+"/change-status", {
        status: status
      });
      return response.data;
    },
    async delete(id) {
      const response = await ApiService.delete("/proposal-receipts/"+id);
      return response.data;
    }
  }
})