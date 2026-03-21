import { Group, DiscussionMessage } from "@/types/group";

let groups: Group[] = [
  {
    id: "g1",
    name: "React Study Group",
    description: "Discussing frontend architecture and React ecosystem.",
    members: ["u1", "u2"],
    discussions: [
      { id: "msg1", authorId: "u1", authorName: "Alice", content: "Who wants to build the new module?", timestamp: new Date(Date.now() - 100000).toISOString() }
    ],
  }
];

export const mockGetGroups = async (): Promise<Group[]> => {
  return [...groups];
};

export const mockGetGroupById = async (id: string): Promise<Group | undefined> => {
  return groups.find(g => g.id === id);
};

export const mockCreateGroup = async (name: string, description: string, creatorId: string): Promise<Group> => {
  const newGroup: Group = {
    id: "grp-" + Math.random().toString(36).substring(2, 9),
    name,
    description,
    members: [creatorId],
    discussions: [],
  };
  groups.push(newGroup);
  return newGroup;
};

export const mockJoinGroup = async (groupId: string, userId: string): Promise<Group> => {
  const group = groups.find(g => g.id === groupId);
  if (!group) throw new Error("Group not found");
  if (!group.members.includes(userId)) {
      group.members.push(userId);
  }
  return { ...group };
};

export const mockAddDiscussionMessage = async (groupId: string, authorId: string, authorName: string, content: string): Promise<DiscussionMessage> => {
  const group = groups.find(g => g.id === groupId);
  if (!group) throw new Error("Group not found");
  
  const msg: DiscussionMessage = {
    id: "msg-" + Math.random().toString(36).substring(2, 9),
    authorId,
    authorName,
    content,
    timestamp: new Date().toISOString(),
  };
  group.discussions.push(msg);
  return msg;
};
