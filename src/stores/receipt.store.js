import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useReceiptStore = defineStore("useReceiptStore", {
  state: () => ({

  }),
  actions: {
    async getApproved() {
      const response = await ApiService.get("/receipts/approved");
      return response.data;
    },
  }
})