import { createRouter, createWebHistory } from "vue-router";
import ValidatePage from "../views/ValidatePage.vue";
import QuestionPage from "../views/QuestionPage.vue";
import ResultPage from "../views/ResultPage.vue";
import ErrorPage from "../views/ErrorPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/test",
      name: "Validate",
      component: ValidatePage,
    },
    {
      path: "/question",
      name: "Question",
      component: QuestionPage,
    },
    {
      path: "/result",
      name: "Result",
      component: ResultPage,
    },
    {
      path: "/error",
      name: "Error",
      component: ErrorPage,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/error",
    },
  ],
});

export default router;
