import { createRouter, createWebHistory, RouterView } from "vue-router";
import {h, render} from 'vue'
import { jwtDecode  } from "jwt-decode";
import { ROLE_ADMIN, ROLE_QTTB, ROLE_BGH, ROLE_LDK } from "@/constant";

const routes = [
  {
    path: "",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children:[
      {
        path: "/dashboard",
        alias: "",
        name: "Dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
        }
      },
      {
        path: "/departments",
        component: { render: () => h(RouterView) },
        children: [
          {
            path: "",
            name: "Departments",
            component: () => import("@/views/departments/List.vue"),
            meta: {
            }
          }
        ]
      },
      {
        path: "/equipment-types",
        component: { render: () => h(RouterView) },
        children: [
          {
            path: "",
            name: "EquipmentTypes",
            component: () => import("@/views/equipmentTypes/List.vue"),
            meta: {
            }
          }
        ]
      },
      {
        path: "/storages",
        component: { render: () => h(RouterView) },
        children: [
          {
            path: "",
            name: "Storages",
            component: () => import("@/views/storages/List.vue"),
            meta: {
            }
          }
        ]
      },
      {
        path: "/equipments",
        component: { render: () => h(RouterView) },
        children: [
          {
            path: "",
            name: "Equipments",
            component: () => import("@/views/equipments/List.vue"),
            meta: {
            }
          },
          {
            path: "create",
            name: "CreateEquipment",
            component: () => import("@/views/equipments/CreateUpdate.vue"),
            meta: {
            }
          },
          {
            path: ":id/update",
            name: "UpdateEquipment",
            component: () => import("@/views/equipments/CreateUpdate.vue"),
            meta: {
            }
          }
        ]
      },
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach(async (to, from, next) => { 
//   const token = localStorage.getItem("token");
//   if (token && typeof token === 'string') {
//     try {
//       const decodedToken = jwtDecode(token);
//       console.log(decodedToken);
      
//       const roles = decodedToken.roles.join(',');
//       if (to.path === "/login" && authStore().isAuth()) {
//         // router.push("/");
//         next({name: 'Dashboard'})
//       } else if (to.meta.requiredAuth && to.meta.roles && !to.meta.roles.some(role => roles.includes(role))) {
//         next({name: 'AccessDenied'})
//       } else if (to.meta.requiredAuth && !authStore().isAuth()) {
//         // authStore().returnUrl = to.fullPath;
//         const nameUrl = to.name;
//         if (nameUrl === 'LeadInfo') {
//           localStorage.setItem("nameUrlLead", nameUrl);
//           localStorage.setItem("idLead", to.params.id);
//         } else if (nameUrl === 'RegisterCardInfo') {
//           localStorage.setItem("nameUrlRegisterCard", nameUrl);
//           localStorage.setItem("idRegisterCard", to.params.id);
//         }
//         next({name: 'Login'})
//       } else {
//         next()
//       }
//     } catch (error) {
//       next()
//     }
//   } else {
//     if (to.meta.requiredAuth) {
//       next({ name: 'Login' });
//     } else {
//       next();
//     }
//   }
// });

export default router;