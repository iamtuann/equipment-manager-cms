import { createRouter, createWebHistory, RouterView } from "vue-router";
import {h, render} from 'vue'
import { jwtDecode  } from "jwt-decode";
import { ROLE_ADMIN, ROLE_QTTB, ROLE_BGH, ROLE_LDK } from "@/constant";
import { useAuthStore } from "@/stores";

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
          requiredAuth: true,
          roles: [ROLE_ADMIN, ROLE_QTTB, ROLE_BGH, ROLE_LDK],
        }
      },
      {
        path: "/departments",
        component: { render: () => h(RouterView) },
        meta: {
          requiredAuth: true,
          roles: [ROLE_ADMIN, ROLE_QTTB, ROLE_BGH, ROLE_LDK],
        },
        children: [
          {
            path: "",
            name: "Departments",
            component: () => import("@/views/departments/List.vue"),
            meta: {
            }
          },
          {
            path: ":id/detail",
            name: "DetaiDepartment",
            component: () => import("@/views/departments/Detail.vue"),
            meta: {
            }
          }
        ]
      },
      {
        path: "/equipment-types",
        component: { render: () => h(RouterView) },
        meta: {
          requiredAuth: true,
          roles: [ROLE_ADMIN, ROLE_QTTB],
        },
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
        meta: {
          requiredAuth: true,
          roles: [ROLE_ADMIN, ROLE_QTTB],
        },
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
        meta: {
          requiredAuth: true,
          roles: [ROLE_ADMIN, ROLE_QTTB],
        },
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
      {
        path: "/import-receipts",
        component: { render: () => h(RouterView) },
        meta: {
          requiredAuth: true,
          roles: [ROLE_ADMIN, ROLE_QTTB, ROLE_BGH, ROLE_LDK],
        },
        children: [
          {
            path: "",
            name: "ImportReceipts",
            component: () => import("@/views/import-receipts/List.vue"),
            meta: {
            }
          },
          {
            path: "create",
            name: "CreateImportReceipt",
            component: () => import("@/views/import-receipts/CreateUpdate.vue"),
            meta: {
            }
          },
          {
            path: ":id/update",
            name: "UpdateImportReceipt",
            component: () => import("@/views/import-receipts/CreateUpdate.vue"),
            meta: {
            }
          },
          {
            path: ":id/detail",
            name: "DetailImportReceipt",
            component: () => import("@/views/import-receipts/Detail.vue"),
            meta: {
            }
          }
        ]
      },
      {
        path: "/handover-receipts",
        component: { render: () => h(RouterView) },
        meta: {
          requiredAuth: true,
          roles: [ROLE_ADMIN, ROLE_QTTB, ROLE_BGH, ROLE_LDK],
        },
        children: [
          {
            path: "",
            name: "HandoverReceipts",
            component: () => import("@/views/handover-receipts/List.vue"),
            meta: {
            }
          },
          {
            path: "create",
            name: "CreateHandoverReceipt",
            component: () => import("@/views/handover-receipts/CreateUpdate.vue"),
            meta: {
            }
          },
          {
            path: ":id/update",
            name: "UpdateHandoverReceipt",
            component: () => import("@/views/handover-receipts/CreateUpdate.vue"),
            meta: {
            }
          },
          {
            path: ":id/detail",
            name: "DetailHandoverReceipt",
            component: () => import("@/views/handover-receipts/Detail.vue"),
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
  },
  {
    path: "/access-denied",
    name: "AccessDenied",
    component: () => import("@/views/AccessDenied.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => { 
  const token = localStorage.getItem("token");
  if (token && typeof token === 'string') {
    try {
      const roles = useAuthStore().getRole();
      console.log(roles);
      
      if (to.path === "/login" && useAuthStore().isAuth()) {
        next({name: 'Dashboard'})
      } else if (to.meta.requiredAuth && !useAuthStore().isAuth()) {
        next({name: 'Login'})
      } else {
        next()
      }
    } catch (error) {
      next()
    }
  } else {
    if (to.meta.requiredAuth) {
      next({ name: 'Login' });
    } else {
      next();
    }
  }
});

export default router;