import { mockGetNotices } from "@/services/mock/mockNoticeApi";
import type { Notice } from "@/types/notice";

export const getNotices = async (): Promise<Notice[]> => {
  return await mockGetNotices();
};