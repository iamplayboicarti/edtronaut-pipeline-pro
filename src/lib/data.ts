export type Stage =
  | "Sim Sent"
  | "Sim Completed"
  | "Awaiting Review"
  | "Shortlisted"
  | "Interviewed"
  | "Offered";

export type Role = "Business Analyst" | "Marketing Analyst" | "CRM Coordinator";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: Role;
  score: number;
  stage: Stage;
  competencies: { taskAccuracy: number; softSkills: number; speed: number; communication: number };
}

export const candidates: Candidate[] = [
  { id: "minh-khoa",   name: "Minh Khoa",   email: "minh.khoa@talentpool.vn",   role: "Business Analyst",  score: 84, stage: "Shortlisted",     competencies: { taskAccuracy: 86, softSkills: 78, speed: 82, communication: 80 } },
  { id: "thu-huong",   name: "Thu Huong",   email: "thu.huong@talentpool.vn",   role: "Marketing Analyst", score: 71, stage: "Awaiting Review", competencies: { taskAccuracy: 74, softSkills: 68, speed: 71, communication: 65 } },
  { id: "duc-anh",     name: "Duc Anh",     email: "duc.anh@talentpool.vn",     role: "CRM Coordinator",   score: 58, stage: "Sim Completed",   competencies: { taskAccuracy: 60, softSkills: 55, speed: 62, communication: 54 } },
  { id: "lan-phuong",  name: "Lan Phuong",  email: "lan.phuong@talentpool.vn",  role: "Business Analyst",  score: 91, stage: "Shortlisted",     competencies: { taskAccuracy: 93, softSkills: 88, speed: 90, communication: 92 } },
  { id: "thanh-nam",   name: "Thanh Nam",   email: "thanh.nam@talentpool.vn",   role: "Marketing Analyst", score: 63, stage: "Sim Sent",        competencies: { taskAccuracy: 65, softSkills: 60, speed: 64, communication: 62 } },
  { id: "bao-ngoc",    name: "Bao Ngoc",    email: "bao.ngoc@talentpool.vn",    role: "CRM Coordinator",   score: 77, stage: "Awaiting Review", competencies: { taskAccuracy: 79, softSkills: 74, speed: 76, communication: 78 } },
  { id: "quang-minh",  name: "Quang Minh",  email: "quang.minh@talentpool.vn",  role: "Business Analyst",  score: 88, stage: "Interviewed",     competencies: { taskAccuracy: 90, softSkills: 84, speed: 86, communication: 89 } },
  { id: "phuong-mai",  name: "Phuong Mai",  email: "phuong.mai@talentpool.vn",  role: "Marketing Analyst", score: 95, stage: "Offered",         competencies: { taskAccuracy: 96, softSkills: 92, speed: 94, communication: 97 } },
  { id: "hoang-long",  name: "Hoang Long",  email: "hoang.long@talentpool.vn",  role: "CRM Coordinator",   score: 52, stage: "Sim Completed",   competencies: { taskAccuracy: 54, softSkills: 48, speed: 56, communication: 50 } },
];

export const ROLES: Role[] = ["Business Analyst", "Marketing Analyst", "CRM Coordinator"];
export const STAGES: Stage[] = ["Sim Sent", "Sim Completed", "Awaiting Review", "Shortlisted", "Interviewed", "Offered"];
export const SIM_STATUS = ["Any", "Not started", "In progress", "Completed"] as const;

export const funnelStages = [
  { label: "Applied",       count: 248, color: "funnel-1" as const },
  { label: "Sim Sent",      count: 180, color: "funnel-2" as const },
  { label: "Sim Completed", count: 142, color: "funnel-3" as const },
  { label: "Shortlisted",   count: 38,  color: "funnel-4" as const },
  { label: "Interviewed",   count: 14,  color: "funnel-5" as const },
  { label: "Offered",       count: 4,   color: "funnel-6" as const },
];

export function scoreColorClass(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-danger";
}

export function scoreBgClass(score: number) {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-danger";
}

export function stageBadgeClass(stage: Stage) {
  switch (stage) {
    case "Sim Sent":         return "bg-secondary text-foreground";
    case "Sim Completed":    return "bg-primary-soft text-accent-foreground";
    case "Awaiting Review":  return "bg-warning-soft text-warning";
    case "Shortlisted":      return "bg-success-soft text-success";
    case "Interviewed":      return "bg-primary-soft text-accent-foreground";
    case "Offered":          return "bg-success text-success-foreground";
  }
}
