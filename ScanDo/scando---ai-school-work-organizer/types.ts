
export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export interface TaskItem {
  id: string;
  description: string;
  priority: Priority;
  isCompleted: boolean;
  category?: string;
  dueDate?: string; // ISO Date string YYYY-MM-DD
}

export interface StudySession {
  topic: string;
  duration: string;
  activity: string;
  technique: string;
}

export interface StudyDay {
  day: string;
  sessions: StudySession[];
}

export interface StudyPlan {
  overview: string;
  prerequisites: string[];
  schedule: StudyDay[];
  tips: string[];
}

export interface ScannedDocument {
  id: string;
  title: string;
  summary: string;
  originalFileUrl: string; // Base64 or Object URL
  fileType: 'image' | 'pdf';
  tasks: TaskItem[];
  createdAt: number;
  status: 'processing' | 'completed' | 'error';
  studyPlan?: StudyPlan;
}

export interface AnalysisResponse {
  title: string;
  summary: string;
  tasks: {
    description: string;
    priority: Priority;
    category: string;
    dueDate?: string;
  }[];
  studyPlan?: StudyPlan;
}
