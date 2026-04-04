export type ModerationStatus = "allowed" | "review" | "rejected";

export type ModerationCheckResponse = {
  has_text: boolean;
  has_image: boolean;
  final_status: ModerationStatus;
  is_allowed: boolean;
  reasons: string[];
  explanation: string;
};
