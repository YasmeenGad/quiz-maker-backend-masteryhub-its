export const API_ROUTES = {
  QUIZ: {
    ROOT: 'quiz',
    TEACHER: 'teacher',
    STUDENT: 'student',
    DELETE: (id: string) => `quiz/${id}`,
  },
};