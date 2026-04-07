import { ApplicationStatus } from './application.model';

export interface CreateApplicationInput {
  company: string;
  role: string;
  jobDescription?: string;
  jdLink?: string;
  notes?: string;
  dateApplied?: Date;
  salaryRange?: string;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
  location?: string;
}

export interface UpdateApplicationInput {
  company?: string;
  role?: string;
  jobDescription?: string;
  jdLink?: string;
  notes?: string;
  dateApplied?: Date;
  status?: ApplicationStatus;
  salaryRange?: string;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
  location?: string;
  resumeSuggestions?: string[];
}