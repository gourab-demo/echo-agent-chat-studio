
export interface Message {
  role: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
  status?: "success" | "error" | "loading";
}
