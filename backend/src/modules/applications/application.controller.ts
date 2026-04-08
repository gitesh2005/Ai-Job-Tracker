import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/auth.middleware';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
} from './application.service';
import ApiResponse from '../../utils/apiResponse';
import ApiError from '../../utils/apiError';
import { ApplicationStatus } from './application.model';

const VALID_STATUSES: ApplicationStatus[] = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const applications = await getApplications(req.user.userId);
  ApiResponse.success(res, applications);
};

export const getApplication = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid ID format');
  }

  const application = await getApplicationById(id, req.user.userId);
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  ApiResponse.success(res, application);
};

export const createNewApplication = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { company, role, jobDescription, jdLink, notes, dateApplied, salaryRange, requiredSkills, niceToHaveSkills, seniority, location, resumeSuggestions } = req.body;

  if (!company || !role) {
    throw new ApiError(400, 'Company and role are required');
  }

  if (typeof company !== 'string' || typeof role !== 'string') {
    throw new ApiError(400, 'Company and role must be strings');
  }

  if (company.trim().length === 0 || role.trim().length === 0) {
    throw new ApiError(400, 'Company and role cannot be empty');
  }

  const application = await createApplication(req.user.userId, {
    company: company.trim(),
    role: role.trim(),
    jobDescription,
    jdLink,
    notes,
    dateApplied,
    salaryRange,
    requiredSkills,
    niceToHaveSkills,
    seniority,
    location,
    resumeSuggestions,
  });

  ApiResponse.created(res, application, 'Application created successfully');
};

export const updateExistingApplication = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid ID format');
  }

  const application = await updateApplication(
    id,
    req.user.userId,
    req.body
  );

  ApiResponse.success(res, application, 'Application updated successfully');
};

export const deleteExistingApplication = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid ID format');
  }

  await deleteApplication(id, req.user.userId);
  ApiResponse.success(res, null, 'Application deleted successfully');
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid ID format');
  }

  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const application = await updateApplicationStatus(
    id,
    req.user.userId,
    status
  );

  ApiResponse.success(res, application, 'Status updated successfully');
};