export const API_ROUTES = {
  AUTH: {
    ROOT: 'auth',
    REGISTER: 'register',
    LOGIN: 'login',
    LOGOUT: 'logout',
    PROFILE: 'profile',
  },

  QUIZ: {
    ROOT: 'quiz',
    TEACHER: 'teacher',
    STUDENT: 'student',
    DELETE: (id: string) => `quiz/${id}`,
  },
};
