import { defineStore } from "pinia";
import ApiService from "@/services/api.service";

export const useAuthStore = defineStore({
  id: "useAuthStore",
  state: () => ({

  }),
  actions: {
    async login(login) {
      const response = await ApiService.post("/auth/login", login);
      return response;
    },
  }
})