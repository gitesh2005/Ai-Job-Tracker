import { Response } from 'express';
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

  const application = await getApplicationById(req.params.id, req.user.userId);
  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  ApiResponse.success(res, application);
};

export const createNewApplication = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { company, role, jobDescription, jdLink, notes, dateApplied, salaryRange, requiredSkills, niceToHaveSkills, seniority, location } = req.body;

  if (!company || !role) {
    throw new ApiError(400, 'Company and role are required');
  }

  const application = await createApplication(req.user.userId, {
    company,
    role,
    jobDescription,
    jdLink,
    notes,
    dateApplied,
    salaryRange,
    requiredSkills,
    niceToHaveSkills,
    seniority,
    location,
  });

  ApiResponse.created(res, application, 'Application created successfully');
};

export const updateExistingApplication = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const application = await updateApplication(
    req.params.id,
    req.user.userId,
    req.body
  );

  ApiResponse.success(res, application, 'Application updated successfully');
};

export const deleteExistingApplication = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  await deleteApplication(req.params.id, req.user.userId);
  ApiResponse.success(res, null, 'Application deleted successfully');
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { status } = req.body;
  const validStatuses: ApplicationStatus[] = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const application = await updateApplicationStatus(
    req.params.id,
    req.user.userId,
    status
  );

  ApiResponse.success(res, application, 'Status updated successfully');
};