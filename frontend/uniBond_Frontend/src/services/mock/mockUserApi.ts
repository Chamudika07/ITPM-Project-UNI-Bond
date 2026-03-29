import type { DiscoverUser, Role, User } from "@/types/user";

const buildAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e5e7eb&color=374151`;

const buildProfilePath = (userId: string) => `/profile/${userId}`;

const mockUsers: User[] = [
  {
    id: "101",
    firstname: "Nadeesha",
    lastname: "Fernando",
    email: "nadeesha.fernando@unibond.test",
    password: "",
    role: "student",
    city: "Colombo",
    country: "Sri Lanka",
    mobile: "0770000001",
    school: "NSBM",
    education: "Bachelor",
    avatar: buildAvatar("Nadeesha Fernando"),
    access_status: "active",
  },
  {
    id: "102",
    firstname: "Ishara",
    lastname: "Perera",
    email: "ishara.perera@unibond.test",
    password: "",
    role: "lecturer",
    city: "Kandy",
    country: "Sri Lanka",
    mobile: "0770000002",
    school: "SLIIT",
    education: "Master",
    avatar: buildAvatar("Ishara Perera"),
    access_status: "active",
  },
  {
    id: "103",
    firstname: "Apex",
    lastname: "Labs",
    email: "apex.labs@unibond.test",
    password: "",
    role: "company",
    city: "Galle",
    country: "Sri Lanka",
    mobile: "0770000003",
    companyName: "Apex Labs",
    industry: "Software",
    companySize: "50-100",
    avatar: buildAvatar("Apex Labs"),
    access_status: "active",
  },
  {
    id: "104",
    firstname: "Dinuka",
    lastname: "Jayasinghe",
    email: "dinuka.j@unibond.test",
    password: "",
    role: "tech_lead",
    city: "Matara",
    country: "Sri Lanka",
    mobile: "0770000004",
    industryExpertise: "Frontend Engineering",
    yearsOfExperience: "8",
    avatar: buildAvatar("Dinuka Jayasinghe"),
    access_status: "active",
  },
];

const toDiscoverUser = (user: User): DiscoverUser => {
  const fullName = `${user.firstname} ${user.lastname}`.trim();
  const location = [user.city, user.country].filter(Boolean).join(", ");

  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    fullName,
    email: user.email,
    role: user.role as Role,
    avatar: user.avatar || buildAvatar(fullName || user.email),
    city: user.city,
    country: user.country,
    location: location || undefined,
    profilePath: buildProfilePath(user.id),
    isFollowing: false,
  };
};

export const mockGetDiscoverUsers = async (limit = 5): Promise<DiscoverUser[]> => {
  return mockUsers.slice(0, limit).map(toDiscoverUser);
};

export const mockGetUserById = async (userId: string): Promise<User> => {
  const user = mockUsers.find((entry) => entry.id === userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
