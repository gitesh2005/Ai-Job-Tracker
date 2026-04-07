import mongoose, { Schema, Document } from 'mongoose';

export type ApplicationStatus = 
  | 'Applied' 
  | 'Phone Screen' 
  | 'Interview' 
  | 'Offer' 
  | 'Rejected';

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  jobDescription?: string;
  jdLink?: string;
  notes?: string;
  dateApplied?: Date;
  status: ApplicationStatus;
  salaryRange?: string;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
  location?: string;
  resumeSuggestions?: string[];
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    jobDescription: {
      type: String,
    },
    jdLink: {
      type: String,
    },
    notes: {
      type: String,
    },
    dateApplied: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    salaryRange: {
      type: String,
    },
    requiredSkills: [{
      type: String,
    }],
    niceToHaveSkills: [{
      type: String,
    }],
    seniority: {
      type: String,
    },
    location: {
      type: String,
    },
    resumeSuggestions: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ userId: 1, createdAt: -1 });

const Application = mongoose.model<IApplication>('Application', applicationSchema);

export default Application;