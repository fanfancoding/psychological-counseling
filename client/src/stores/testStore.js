import { defineStore } from "pinia";

export const useTestStore = defineStore("test", {
  state: () => ({
    token: "",
    templateId: "",
    template: null,
    currentQuestionIndex: 0,
    answers: [],
    result: null,
    loading: false,
    error: null,
  }),

  getters: {
    currentQuestion: (state) => {
      if (!state.template || !state.template.questions) return null;
      return state.template.questions[state.currentQuestionIndex];
    },

    progress: (state) => {
      if (!state.template) return 0;
      return Math.round(
        (state.currentQuestionIndex / state.template.totalQuestions) * 100,
      );
    },

    isLastQuestion: (state) => {
      if (!state.template) return false;
      return state.currentQuestionIndex === state.template.questions.length - 1;
    },
  },

  actions: {
    setToken(token) {
      this.token = token;
    },

    setTemplate(template) {
      this.template = template;
      this.templateId = template.templateId;
    },

    selectAnswer(questionId, selectedKey) {
      const existingIndex = this.answers.findIndex(
        (a) => a.questionId === questionId,
      );

      if (existingIndex >= 0) {
        this.answers[existingIndex].selectedKey = selectedKey;
      } else {
        this.answers.push({ questionId, selectedKey });
      }
    },

    nextQuestion() {
      if (this.currentQuestionIndex < this.template.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },

    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },

    setResult(result) {
      this.result = result;
    },

    setLoading(loading) {
      this.loading = loading;
    },

    setError(error) {
      this.error = error;
    },

    reset() {
      this.currentQuestionIndex = 0;
      this.answers = [];
      this.result = null;
      this.error = null;
    },
  },
});
