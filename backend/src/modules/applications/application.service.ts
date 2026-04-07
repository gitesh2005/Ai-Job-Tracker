import mongoose from 'mongoose';
import Application, { IApplication, ApplicationStatus } from './application.model';
import ApiError from '../../utils/apiError';
import { CreateApplicationInput, UpdateApplicationInput } from './application.types';

export const getApplications = async (userId: string): Promise<IApplication[]> => {
  return Application.find({ userId }).sort({ createdAt: -1 });
};

export const getApplicationById = async (
  id: string,
  userId: string
): Promise<IApplication | null> => {
  const application = await Application.findOne({
    _id: id,
    userId,
  });
  return application;
};

export const createApplication = async (
  userId: string,
  input: CreateApplicationInput
): Promise<IApplication> => {
  return Application.create({
    userId: new mongoose.Types.ObjectId(userId),
    ...input,
    status: 'Applied',
    dateApplied: input.dateApplied || new Date(),
  });
};

export const updateApplication = async (
  id: string,
  userId: string,
  input: UpdateApplicationInput
): Promise<IApplication> => {
  const application = await Application.findOneAndUpdate(
    { _id: id, userId },
    { $set: input },
    { new: true, runValidators: true }
  );

  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  return application;
};

export const deleteApplication = async (
  id: string,
  userId: string
): Promise<void> => {
  const result = await Application.deleteOne({ _id: id, userId });
  if (result.deletedCount === 0) {
    throw new ApiError(404, 'Application not found');
  }
};

export const updateApplicationStatus = async (
  id: string,
  userId: string,
  status: ApplicationStatus
): Promise<IApplication> => {
  const application = await Application.findOneAndUpdate(
    { _id: id, userId },
    { $set: { status } },
    { new: true, runValidators: true }
  );

  if (!application) {
    throw new ApiError(404, 'Application not found');
  }

  return application;
};