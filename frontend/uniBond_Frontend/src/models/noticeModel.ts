import { mockGetNotices } from "@/utils/mockNoticeApi";
import type { Notice } from "@/types/notice";

export const getNotices = async (): Promise<Notice[]> => {
  return await mockGetNotices();
};