import type { Role } from "@/types/user";
import type { TaskFormData } from "@/components/tasks/TaskForm";

export type ValidationResult<T extends string = string> = {
  isValid: boolean;
  error?: string;
  errors: Partial<Record<T, string>>;
};

type RegisterFormValues = Record<string, string>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^0\d{9}$/;
const LETTERS_AND_SPACES_REGEX = /^[A-Za-z\s'-]+$/;

const createResult = <T extends string>(errors: Partial<Record<T, string>>): ValidationResult<T> => {
  const firstError = Object.values(errors).find((value): value is string => typeof value === "string" && value.length > 0);

  return {
    isValid: !firstError,
    error: firstError,
    errors,
  };
};

export const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim());

export const validateMobile = (mobile: string): boolean => MOBILE_REGEX.test(mobile.trim());

export const validateName = (value: string): boolean => LETTERS_AND_SPACES_REGEX.test(value.trim());

export const validateSearch = (query: string): { isValid: boolean; error?: string } => {
  const trimmed = query.trim();
  if (!trimmed) {
    return { isValid: false, error: "Search query is required" };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: "Search query must be at least 2 characters" };
  }
  return { isValid: true };
};

export const validatePost = (
  content: string,
  mediaUrl?: string,
  mediaType?: "image" | "video"
): { isValid: boolean; error?: string } => {
  const trimmedContent = content.trim();
  if (!trimmedContent && !mediaUrl) {
    return { isValid: false, error: "Post must have content or media" };
  }
  if (trimmedContent.length > 1000) {
    return { isValid: false, error: "Content must be less than 1000 characters" };
  }
  if (mediaUrl && !mediaType) {
    return { isValid: false, error: "Media type is required if media URL is provided" };
  }
  if (mediaType && !["image", "video"].includes(mediaType)) {
    return { isValid: false, error: "Invalid media type" };
  }
  return { isValid: true };
};

export const validateLogin = (
  email: string,
  password: string
): ValidationResult<"email" | "password"> => {
  const errors: Partial<Record<"email" | "password", string>> = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!validateEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password.trim()) {
    errors.password = "Password is required.";
  } else if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return createResult(errors);
};

export const validateRegisterForm = (
  form: RegisterFormValues,
  role: Role
): ValidationResult<string> => {
  const errors: Record<string, string> = {};
  const firstname = form.firstname?.trim() ?? "";
  const lastname = form.lastname?.trim() ?? "";
  const email = form.email?.trim() ?? "";
  const password = form.password ?? "";
  const city = form.city?.trim() ?? "";
  const country = form.country?.trim() ?? "";
  const mobile = form.mobile?.trim() ?? "";
  const school = form.school?.trim() ?? "";
  const education = form.education?.trim() ?? "";
  const companyName = form.companyName?.trim() ?? "";
  const industry = form.industry?.trim() ?? "";
  const companySize = form.companySize?.trim() ?? "";
  const industryExpertise = form.industryExpertise?.trim() ?? "";
  const yearsOfExperience = form.yearsOfExperience?.trim() ?? "";

  if (!firstname) {
    errors.firstname = "First name is required.";
  } else if (firstname.length < 2) {
    errors.firstname = "First name must be at least 2 characters.";
  } else if (!validateName(firstname)) {
    errors.firstname = "Use letters only for the first name.";
  }

  if (!lastname) {
    errors.lastname = "Last name is required.";
  } else if (lastname.length < 2) {
    errors.lastname = "Last name must be at least 2 characters.";
  } else if (!validateName(lastname)) {
    errors.lastname = "Use letters only for the last name.";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password.trim()) {
    errors.password = "Password is required.";
  } else if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!city) {
    errors.city = "City is required.";
  } else if (city.length < 2) {
    errors.city = "City must be at least 2 characters.";
  }

  if (!country) {
    errors.country = "Country is required.";
  } else if (country.length < 2) {
    errors.country = "Country must be at least 2 characters.";
  }

  if (!mobile) {
    errors.mobile = "Mobile number is required.";
  } else if (!validateMobile(mobile)) {
    errors.mobile = "Mobile must be 10 digits and start with 0.";
  }

  if (role === "student" || role === "lecturer") {
    if (!school) {
      errors.school = "School or university is required.";
    }
    if (!education) {
      errors.education = "Education level is required.";
    }
  }

  if (role === "company") {
    if (!companyName) {
      errors.companyName = "Company name is required.";
    }
    if (!industry) {
      errors.industry = "Industry is required.";
    }
    if (!companySize) {
      errors.companySize = "Company size is required.";
    }
  }

  if (role === "tech_lead") {
    if (!industryExpertise) {
      errors.industryExpertise = "Industry expertise is required.";
    }

    if (!yearsOfExperience) {
      errors.yearsOfExperience = "Years of experience is required.";
    } else if (Number.isNaN(Number(yearsOfExperience)) || Number(yearsOfExperience) < 0 || Number(yearsOfExperience) > 50) {
      errors.yearsOfExperience = "Enter a valid number between 0 and 50.";
    }
  }

  return createResult(errors);
};

export const validateTaskForm = (
  formData: TaskFormData
): ValidationResult<"title" | "description" | "contactEmail" | "skills" | "studentsNeeded" | "startDate" | "deadline" | "tags"> => {
  const errors: Partial<Record<"title" | "description" | "contactEmail" | "skills" | "studentsNeeded" | "startDate" | "deadline" | "tags", string>> = {};

  if (!formData.title.trim()) {
    errors.title = "Task title is required.";
  } else if (formData.title.trim().length < 5) {
    errors.title = "Task title should be at least 5 characters.";
  }

  if (!formData.description.trim()) {
    errors.description = "Description is required.";
  } else if (formData.description.trim().length < 20) {
    errors.description = "Description should explain the task in at least 20 characters.";
  }

  if (!formData.contactEmail.trim()) {
    errors.contactEmail = "Contact email is required.";
  } else if (!validateEmail(formData.contactEmail)) {
    errors.contactEmail = "Enter a valid contact email address.";
  }

  if (formData.skills.length === 0) {
    errors.skills = "Add at least one required skill.";
  }

  if (formData.projectType === "Group" && formData.studentsNeeded < 2) {
    errors.studentsNeeded = "Group projects should request at least 2 students.";
  }

  if (!formData.startDate) {
    errors.startDate = "Start date is required.";
  }

  if (!formData.deadline) {
    errors.deadline = "Deadline is required.";
  }

  if (formData.startDate && formData.deadline) {
    const startDate = new Date(formData.startDate);
    const deadlineDate = new Date(formData.deadline);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(deadlineDate.getTime())) {
      errors.startDate = "Enter a valid project date.";
    } else if (deadlineDate <= startDate) {
      errors.deadline = "Deadline must be after the start date.";
    }
  }

  if (formData.tags.some((tag) => tag.trim().length < 2)) {
    errors.tags = "Each tag should contain at least 2 characters.";
  }

  return createResult(errors);
};

export const validateClassroomForm = (
  title: string,
  description: string,
  maxStudents: number
): ValidationResult<"title" | "description" | "maxStudents"> => {
  const errors: Partial<Record<"title" | "description" | "maxStudents", string>> = {};

  if (!title.trim()) {
    errors.title = "Classroom title is required.";
  } else if (title.trim().length < 5) {
    errors.title = "Title should be at least 5 characters.";
  }

  if (!description.trim()) {
    errors.description = "Description is required.";
  } else if (description.trim().length < 20) {
    errors.description = "Description should be at least 20 characters.";
  }

  if (!Number.isFinite(maxStudents) || maxStudents < 1 || maxStudents > 500) {
    errors.maxStudents = "Maximum students must be between 1 and 500.";
  }

  return createResult(errors);
};

export const validateKuppyForm = (
  title: string,
  description: string,
  datetime: string
): ValidationResult<"title" | "description" | "datetime"> => {
  const errors: Partial<Record<"title" | "description" | "datetime", string>> = {};

  if (!title.trim()) {
    errors.title = "Topic is required.";
  } else if (title.trim().length < 5) {
    errors.title = "Topic should be at least 5 characters.";
  }

  if (!description.trim()) {
    errors.description = "Description is required.";
  } else if (description.trim().length < 15) {
    errors.description = "Description should be at least 15 characters.";
  }

  if (!datetime) {
    errors.datetime = "Date and time are required.";
  } else {
    const scheduledAt = new Date(datetime);
    if (Number.isNaN(scheduledAt.getTime())) {
      errors.datetime = "Enter a valid date and time.";
    } else if (scheduledAt <= new Date()) {
      errors.datetime = "Please schedule the session for a future time.";
    }
  }

  return createResult(errors);
};

export const validateGroupForm = (
  name: string,
  description: string
): ValidationResult<"name" | "description"> => {
  const errors: Partial<Record<"name" | "description", string>> = {};

  if (!name.trim()) {
    errors.name = "Group name is required.";
  } else if (name.trim().length < 3) {
    errors.name = "Group name should be at least 3 characters.";
  }

  if (!description.trim()) {
    errors.description = "Description is required.";
  } else if (description.trim().length < 12) {
    errors.description = "Description should be at least 12 characters.";
  }

  return createResult(errors);
};
