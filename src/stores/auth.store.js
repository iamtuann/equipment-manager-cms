import { defineStore } from "pinia";
import ApiService from "@/services/api.service";
import { jwtDecode } from "jwt-decode";
import router from "@/router";
import { ROLE_ADMIN, ROLE_QTTB, ROLE_BGH, ROLE_LDK } from "@/constant";

export const useAuthStore = defineStore({
  id: "useAuthStore",
  state: () => ({

  }),
  actions: {
    async login(login) {
      const response = await ApiService.post("/auth/login", login);
      return response;
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user")
      router.push({name: "Login"})
    },
    getUsername() {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      return decodedToken.sub;
    },
    getFullname() {
      let fullName = "";
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        fullName = user.firstName + " " + user.lastName;
      }
      return fullName;
    },
    isTokenExpired() {
      try {
        const decodedToken = jwtDecode(localStorage.getItem("token"));
        const currentTime = Date.now() / 1000;

        return decodedToken.exp < currentTime;
      } catch (error) {
        return true; // Nếu có lỗi khi giải mã token, coi như token đã hết hạn
      }
    },
    isAuth() {
      return !!(localStorage.getItem("token") && !this.isTokenExpired());
    },
    getRole() {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const roles = decodedToken.roles.join(', ');
      return roles;
    },
    getDisplayRole() {
      let roles = "";
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        roles = user.roles.join(', ')
      }
      return roles;
    },
    isAdmin() {
      try {
        const decodedToken = jwtDecode(localStorage.getItem("token"));
        const roles = decodedToken.roles.join(',');
        
        return !!(roles.includes(ROLE_ADMIN));
      } catch (error) {
        return true;
      }
    },
    isQTTB() {
      try {
        const decodedToken = jwtDecode(localStorage.getItem("token"));
        const roles = decodedToken.roles.join(',');
        return !!(roles.includes(ROLE_QTTB));
      } catch (error) {
        return true;
      }
    },
    isBGH() {
      try {
        const decodedToken = jwtDecode(localStorage.getItem("token"));
        const roles = decodedToken.roles.join(',');
        return !!(roles.includes(ROLE_BGH));
      } catch (error) {
        return true;
      }
    },
    isLDK() {
      try {
        const decodedToken = jwtDecode(localStorage.getItem("token"));
        const roles = decodedToken.roles.join(',');
        return !!(roles.includes(ROLE_LDK));
      } catch (error) {
        return true;
      }
    },
  }
})