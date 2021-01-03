import Vue from "vue";
import VueRouter from "vue-router";
import AuthService from "@/services/auth";

import Login from "@/views/pages/auth/Login";
import Register from "@/views/pages/auth/Register";
import Logout from "@/views/pages/auth/Logout";

import AuthLayout from "@/views/layouts/AuthLayout";
import MainLayout from "@/views/layouts/MainLayout";
import AdminLayout from "@/views/layouts/AdminLayout";

import NotFoundPage from "@/views/pages/errors/404.vue";
import ForbiddenPage from "@/views/pages/errors/403.vue";

// pages
import Home from "@/views/pages/home/Index.vue";
import Detail from '@/views/pages/home/Detail';

import Motel from "@/views/pages/motel/Motel.vue";
import MotelIndex from "@/views/pages/motel/Index.vue";
import MotelDetail from "@/views/pages/motel/Detail.vue";

import Profile from "@/views/pages/profile/Profile.vue";
import ProfileInfo from "@/views/pages/profile/Info.vue";
import CreatePost from "@/views/pages/profile/CreatePost.vue";
import ListMotel from '@/views/pages/profile/ListMotel.vue';

import store from "@/store/index";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};


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
    path: "/admin",
    component: AdminLayout,
    name: "admin",
    children: [
      {
        path: "login",
        component: Login,
        name: "login"
      },
    ]
  },


  // {
  //   path: "/",
  //   component: Home,
  // },

  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: Home,
        name: "home",
        redirect: '/motels',
      },
      {
        path: "motels",
        component: Motel,

        children: [
          {
            path: "/",
            component: MotelIndex,
            name: "motelIndex",
          },
          {
            path: "detail/:id",
            component: MotelDetail,
            name: "motelDetail"
          }
        ]
      },

      {
        path: "profile",
        component: Profile,
        name: "profile",
        meta: {
          requireAuth: true
        },
        children: [
          {
            path: "info",
            component: ProfileInfo,
            name: "profileInfo"
          },
          {
            path: "create_post",
            component: CreatePost,
            name: "createPost"
          },
          {
            path: "list_motel",
            component: ListMotel,
            name: "listMotel"
          }
        ]
      }
    ]
  },

  {
    path: "/forbidden",
    component: ForbiddenPage,
    name: "forbidden"
  },

  // { path: "*", component: NotFoundPage }
];

const router = new VueRouter({
  routes,
  mode: "history",
  linkActiveClass: "active",
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
 const tokenUser = $cookies.get("accessToken");

  if (to.matched.some(m => m.meta.requireAuth)) {
    if (to.name !== "login" && !tokenUser) {
      $cookies.remove("accessToken");
      $cookies.remove("userInfo");
      store.dispatch("SOCKET_REMOVE_USER");
      next({ name: "login" });
    } else {
      next();
    }
    return next();
  }
  return next();
});

export default router;
