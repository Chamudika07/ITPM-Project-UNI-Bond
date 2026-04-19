export const APP_NAME = "UniBond";

export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  GROUPS: "/groups",
  NOTICES: "/notices",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  PROFILE_USER: "/profile/:userId",
  PROFESSIONAL_COMMUNICATION: "/professional-communication",
  REGISTERED_PROFESSIONAL_SESSIONS: "/professional-communication/registered",
  COMPANY_TASKS: "/tasks",
  KUPPY_SESSIONS: "/kuppy-sessions",
  CREATE_POST: "/create-post",
  EDIT_POST: "/edit-post/:id",
  COURSES: "/courses",
  CREATE_COURSE: "/courses/create",
  CREATE_COURSE_LEGACY: "/create-course",
  CREATE_PROFESSIONAL_SESSION: "/professional-communication/create",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
} as const;
