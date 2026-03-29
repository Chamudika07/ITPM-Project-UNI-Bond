import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Session = {
  id: string;
  title: string;
  speaker: string;
  date: string;
  time: string;
  description: string;
  link: string;
  tags: string[];
  creatorId: string; // To allow only the creator to edit/delete
};

export type Attendee = {
  sessionId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  registeredAt: string;
};

type ProfessionalCommunicationContextType = {
  sessions: Session[];
  attendees: Attendee[];
  addSession: (session: Omit<Session, "id">) => void;
  updateSession: (id: string, updatedSession: Omit<Session, "id">) => void;
  deleteSession: (id: string) => void;
  registerStudent: (sessionId: string, studentId: string, studentName: string, studentEmail: string) => void;
  getAttendeesForSession: (sessionId: string) => Attendee[];
  isStudentRegistered: (sessionId: string, studentId: string) => boolean;
};

const ProfessionalCommunicationContext = createContext<ProfessionalCommunicationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_SESSIONS = "uniBond_prof_sessions";
const LOCAL_STORAGE_KEY_ATTENDEES = "uniBond_prof_attendees";

const MOCK_INITIAL_SESSIONS: Session[] = [
  {
    id: "1",
    title: "Navigating Tech Careers in 2026",
    speaker: "Jane Doe",
    date: "2026-03-25",
    time: "18:00",
    description: "An open session to discuss the current tech landscape and how to effectively build your career.",
    link: "https://meet.google.com/xyz-abc-def",
    tags: ["Career", "Tech", "Q&A"],
    creatorId: "mock-tech-leader-id" // This should match a tech leader's ID or we just rely on role for demo
  },
  {
    id: "2",
    title: "Mastering System Design Interviews",
    speaker: "John Smith",
    date: "2026-04-02",
    time: "17:30",
    description: "Deep dive into system design principles and how to approach common interview problems.",
    link: "https://zoom.us/j/123456789",
    tags: ["System Design", "Interview Prep"],
    creatorId: "mock-tech-leader-id"
  }
];

export function ProfessionalCommunicationProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SESSIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_INITIAL_SESSIONS;
      }
    }
    return MOCK_INITIAL_SESSIONS;
  });

  const [attendees, setAttendees] = useState<Attendee[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ATTENDEES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ATTENDEES, JSON.stringify(attendees));
  }, [attendees]);

  const addSession = (sessionData: Omit<Session, "id">) => {
    const newSession: Session = {
      ...sessionData,
      id: Date.now().toString()
    };
    setSessions(prev => [newSession, ...prev]);
  };

  const updateSession = (id: string, updatedSession: Omit<Session, "id">) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...updatedSession, id } : s));
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    // Also remove attendees for this session
    setAttendees(prev => prev.filter(a => a.sessionId !== id));
  };

  const registerStudent = (sessionId: string, studentId: string, studentName: string, studentEmail: string) => {
    const newAttendee: Attendee = {
      sessionId,
      studentId,
      studentName,
      studentEmail,
      registeredAt: new Date().toISOString()
    };
    setAttendees(prev => [...prev, newAttendee]);
  };

  const getAttendeesForSession = (sessionId: string) => {
    return attendees.filter(a => a.sessionId === sessionId);
  };

  const isStudentRegistered = (sessionId: string, studentId: string) => {
    return attendees.some(a => a.sessionId === sessionId && a.studentId === studentId);
  };

  return (
    <ProfessionalCommunicationContext.Provider
      value={{
        sessions,
        attendees,
        addSession,
        updateSession,
        deleteSession,
        registerStudent,
        getAttendeesForSession,
        isStudentRegistered
      }}
    >
      {children}
    </ProfessionalCommunicationContext.Provider>
  );
}

export function useProfessionalCommunication() {
  const context = useContext(ProfessionalCommunicationContext);
  if (context === undefined) {
    throw new Error("useProfessionalCommunication must be used within a ProfessionalCommunicationProvider");
  }
  return context;
}
