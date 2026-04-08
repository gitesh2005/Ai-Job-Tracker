export type ApplicationStatus = 
  | 'Applied' 
  | 'Phone Screen' 
  | 'Interview' 
  | 'Offer' 
  | 'Rejected';

export interface User {
  id: string;
  email: string;
}

export interface Application {
  _id: string;
  userId: string;
  company: string;
  role: string;
  jobDescription?: string;
  jdLink?: string;
  notes?: string;
  dateApplied?: string;
  status: ApplicationStatus;
  salaryRange?: string;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
  location?: string;
  resumeSuggestions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationInput {
  company: string;
  role: string;
  jobDescription?: string;
  jdLink?: string;
  notes?: string;
  dateApplied?: string;
  status?: ApplicationStatus;
  salaryRange?: string;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
  location?: string;
  resumeSuggestions?: string[];
}

export interface UpdateApplicationInput {
  company?: string;
  role?: string;
  jobDescription?: string;
  jdLink?: string;
  notes?: string;
  dateApplied?: string;
  status?: ApplicationStatus;
  salaryRange?: string;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
  location?: string;
  resumeSuggestions?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface ParsedJobData {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
  resumeSuggestions: string[];
}
