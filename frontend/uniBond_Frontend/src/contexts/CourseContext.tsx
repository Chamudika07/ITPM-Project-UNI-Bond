import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Course = {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  dateAdded: string;
  price: number;
  pdfUrl: string;
  videoUrl: string;
  creatorId: string;
};

export type CourseRegistration = {
  courseId: string;
  studentId: string;
  studentName: string;
  receiptUrl: string;
  status: "pending" | "approved"; // Mock status
  registeredAt: string;
};

type CourseContextType = {
  courses: Course[];
  registrations: CourseRegistration[];
  addCourse: (course: Omit<Course, "id" | "dateAdded">) => void;
  updateCourse: (id: string, updatedCourse: Omit<Course, "id" | "dateAdded">) => void;
  deleteCourse: (id: string) => void;
  registerForCourse: (courseId: string, studentId: string, studentName: string, receiptUrl: string) => void;
  getRegistrationStatus: (courseId: string, studentId: string) => CourseRegistration | undefined;
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_COURSES = "uniBond_courses";
const LOCAL_STORAGE_KEY_COURSE_REG = "uniBond_course_registrations";

const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    title: "Advanced React Patterns",
    description: "Learn how to build scalable React applications using advanced patterns and hooks.",
    instructorName: "Dr. Alan Turing",
    dateAdded: "2026-03-10",
    price: 49.99,
    pdfUrl: "https://example.com/react-patterns.pdf",
    videoUrl: "https://example.com/react-video.mp4",
    creatorId: "mock-lecturer-id"
  },
  {
    id: "c2",
    title: "Introduction to Machine Learning",
    description: "A comprehensive guide to understanding ML models, training, and deployment.",
    instructorName: "Prof. Ada Lovelace",
    dateAdded: "2026-03-15",
    price: 99.00,
    pdfUrl: "https://example.com/ml-guide.pdf",
    videoUrl: "https://example.com/ml-video.mp4",
    creatorId: "mock-lecturer-id"
  }
];

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COURSES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return MOCK_COURSES; }
    }
    return MOCK_COURSES;
  });

  const [registrations, setRegistrations] = useState<CourseRegistration[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COURSE_REG);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_COURSE_REG, JSON.stringify(registrations));
  }, [registrations]);

  const addCourse = (courseData: Omit<Course, "id" | "dateAdded">) => {
    const newCourse: Course = {
      ...courseData,
      id: "course_" + Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const updateCourse = (id: string, updatedCourse: Omit<Course, "id" | "dateAdded">) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...updatedCourse, id, dateAdded: c.dateAdded } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setRegistrations(prev => prev.filter(r => r.courseId !== id));
  };

  const registerForCourse = (courseId: string, studentId: string, studentName: string, receiptUrl: string) => {
    const newReg: CourseRegistration = {
      courseId,
      studentId,
      studentName,
      receiptUrl,
      status: "approved", // Automatically approved for the mock showcase
      registeredAt: new Date().toISOString()
    };
    setRegistrations(prev => [...prev.filter(r => !(r.courseId === courseId && r.studentId === studentId)), newReg]);
  };

  const getRegistrationStatus = (courseId: string, studentId: string) => {
    return registrations.find(r => r.courseId === courseId && r.studentId === studentId);
  };

  return (
    <CourseContext.Provider value={{
      courses,
      registrations,
      addCourse,
      updateCourse,
      deleteCourse,
      registerForCourse,
      getRegistrationStatus
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourseContext() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
}
