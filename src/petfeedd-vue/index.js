import Vue from "vue";
import VueRouter from "vue-router";
import VueToast from "vue-toast-notification";
import PortalVue from 'portal-vue'
import Axios from "axios";

// Import the base view.
import App from "./Views/App.vue";

// Import the bootstrap CSS.
import "bootstrap/dist/css/bootstrap.min.css";
import { Collapse } from "bootstrap";
import "vue-toast-notification/dist/theme-sugar.css";

// Add plugins.
Vue.use(VueRouter);
Vue.use(VueToast);
Vue.use(PortalVue);
Vue.prototype.$http = Axios;
Vue.prototype.$bootstrap = {
  Collapse,
};

// Disable caching on Axios calls.
Vue.prototype.$http.defaults.headers = {
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Expires: "0",
};

// Import all our views using promises.
const Home = () => import("./Views/Home.vue");
const Configuration = () => import("./Views/Configuration.vue");
const Feeds = () => import("./Views/Feeds.vue");
const Servos = () => import("./Views/Servos.vue");
const MQTT = () => import("./Views/MQTT.vue");
const Notifications = () => import("./Views/Notifications.vue");
const General = () => import("./Views/General.vue");
const Buttons = () => import("./Views/Buttons.vue");

// Create the routes.
const routes = [
  { path: "/", redirect: { name: "home" } },
  { path: "/home", component: Home, name: "home" },
  {
    path: "/configuration",
    component: Configuration,
    redirect: { name: "config.general" },
    name: "config",
    children: [
      {
        path: "general",
        meta: { title: "General Settings" },
        component: General,
        name: "config.general",
      },
      {
        path: "feeds",
        meta: { title: "Feeds" },
        component: Feeds,
        name: "config.feeds",
      },
      {
        path: "servos",
        meta: { title: "Servos" },
        component: Servos,
        name: "config.servos",
      },
      {
        path: "mqtt",
        meta: { title: "MQTT" },
        component: MQTT,
        name: "config.mqtt",
      },
      {
        path: "buttons",
        meta: { title: "Buttons" },
        component: Buttons,
        name: "config.buttons",
      },
      {
        path: "notifications",
        meta: { title: "Notifications" },
        component: Notifications,
        name: "config.notifications",
      },
    ],
  },
];

// Create the router.
const router = new VueRouter({
  routes,
  linkActiveClass: "active",
});

// Create a div to hold our app.
let app = document.createElement("div");
document.body.append(app);

// Create the vue app!
new Vue({
  router,
  render: (h) => h(App),
}).$mount(app);
