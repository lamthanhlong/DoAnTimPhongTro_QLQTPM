import Vue from "vue";
import VueRouter from "vue-router";
import AuthService from "./services/auth";

import Login from "./views/pages/auth/Login";
import Register from "./views/pages/auth/Register";
import Logout from "./views/pages/auth/Logout";

import AuthLayout from "./views/layouts/AuthLayout";
import MainLayout from "./views/layouts/MainLayout";

import NotFoundPage from "./views/pages/errors/404.vue";
import ForbiddenPage from "./views/pages/errors/403.vue";

// pages
import Home from "./views/pages/home/Index.vue";

import store from "./store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    name: "auth",
    children: [
      {
        path: "login",
        component: Login,
        name: "login"
      },
      {
        path: "register",
        component: Register,
        name: "register"
      },
      {
        path: "logout",
        component: Logout,
        name: "logout"
      }
    ]
  },

  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: Home,
      }
    ]
  },

  {
    path: "/forbidden",
    component: ForbiddenPage,
    name: "forbidden"
  },

  { path: "*", component: NotFoundPage }
];

const router = new VueRouter({
  routes,
  mode: "history",
  linkActiveClass: "active",
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

// router.beforeEach((to, from, next) => {
//   const tokenUser = $cookies.get("accessToken");

//   if (to.matched.some(m => m.meta.requireAuth)) {
//     if (to.name !== "login" && !tokenUser) {
//       $cookies.remove("accessToken");
//       $cookies.remove("dataUser");
//       next({ name: "login" });
//     } else {
//       next();
//     }
//     return next();
//   }
//   return next();
// });

export default router;
