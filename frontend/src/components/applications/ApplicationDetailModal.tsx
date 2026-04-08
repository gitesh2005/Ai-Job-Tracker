import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Spinner from '../ui/Spinner';
import ConfirmDialog from '../common/ConfirmDialog';
import ResumeSuggestions from './ResumeSuggestions';
import { UpdateApplicationInput, ApplicationStatus } from '../../types';
import { applicationsApi } from '../../features/applications/applications.api';
import { formatDate } from '../../utils/formatDate';

interface ApplicationDetailModalProps {
  applicationId: string | null;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: 'Applied', label: 'Applied' },
  { value: 'Phone Screen', label: 'Phone Screen' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
];

const SENIORITY_OPTIONS = [
  { value: 'Intern', label: 'Intern' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Mid', label: 'Mid-Level' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Lead', label: 'Lead' },
  { value: 'Principal', label: 'Principal' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Director', label: 'Director' },
];

const statusColors: Record<ApplicationStatus, { bg: string; text: string }> = {
  'Applied': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Phone Screen': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Interview': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Offer': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'Rejected': { bg: 'bg-red-100', text: 'text-red-700' },
};

export default function ApplicationDetailModal({ applicationId, onClose }: ApplicationDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationsApi.getById(applicationId!),
    enabled: !!applicationId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationInput }) =>
      applicationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => applicationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      onClose();
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateApplicationInput>();

  useEffect(() => {
    if (application) {
      reset({
        company: application.company,
        role: application.role,
        jobDescription: application.jobDescription,
        jdLink: application.jdLink,
        notes: application.notes,
        status: application.status,
        salaryRange: application.salaryRange,
        location: application.location,
        seniority: application.seniority,
        requiredSkills: application.requiredSkills,
        niceToHaveSkills: application.niceToHaveSkills,
        resumeSuggestions: application.resumeSuggestions,
      });
    }
  }, [application, reset]);

  const onSubmit = (data: UpdateApplicationInput) => {
    if (applicationId) {
      updateMutation.mutate({ id: applicationId, data });
    }
  };

  const handleDelete = () => {
    if (applicationId) {
      deleteMutation.mutate(applicationId);
    }
  };

  if (!applicationId) return null;

  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Loading...">
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner className="w-10 h-10 mb-4" />
          <p className="text-gray-500 font-medium">Loading application details...</p>
        </div>
      </Modal>
    );
  }

  if (error || !application) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Error">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">Failed to load details</p>
          <p className="text-gray-500 text-sm">Please try again</p>
        </div>
      </Modal>
    );
  }

  const statusStyle = statusColors[application.status];

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        title={isEditing ? 'Edit Application' : undefined}
        className="max-w-2xl"
      >
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="company"
                label="Company"
                {...register('company', { required: 'Company is required' })}
                error={errors.company?.message}
              />
              <Input
                id="role"
                label="Role"
                {...register('role', { required: 'Role is required' })}
                error={errors.role?.message}
              />
            </div>

            <Textarea
              id="jobDescription"
              label="Job Description"
              rows={4}
              {...register('jobDescription')}
            />

            <Input id="jdLink" label="Job Link" {...register('jdLink')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="status"
                label="Status"
                options={STATUS_OPTIONS}
                {...register('status')}
              />
              <Select
                id="seniority"
                label="Seniority"
                options={SENIORITY_OPTIONS}
                {...register('seniority')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="location" label="Location" {...register('location')} />
              <Input id="salaryRange" label="Salary Range" {...register('salaryRange')} />
            </div>

            <Input
              id="dateApplied"
              type="date"
              label="Date Applied"
              defaultValue={application.dateApplied?.split('T')[0]}
              {...register('dateApplied')}
            />

            <Textarea
              id="notes"
              label="Notes"
              rows={3}
              {...register('notes')}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={updateMutation.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{application.company}</h2>
                <p className="text-gray-600 font-medium">{application.role}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                {application.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Applied</span>
                <p className="text-gray-900 font-medium mt-1">{formatDate(application.dateApplied)}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</span>
                <p className="text-gray-900 font-medium mt-1">{application.location || 'N/A'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Seniority</span>
                <p className="text-gray-900 font-medium mt-1">{application.seniority || 'N/A'}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Salary Range</span>
                <p className="text-gray-900 font-medium mt-1">{application.salaryRange || 'N/A'}</p>
              </div>
            </div>

            {application.jdLink && (
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Link</span>
                <a
                  href={application.jdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm block mt-1 truncate group"
                >
                  {application.jdLink}
                  <svg className="w-4 h-4 inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {application.jobDescription && (
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Description</span>
                <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap leading-relaxed">{application.jobDescription}</p>
              </div>
            )}

            {application.notes && (
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Notes</span>
                <p className="text-gray-700 text-sm mt-2">{application.notes}</p>
              </div>
            )}

            {(application.requiredSkills && application.requiredSkills.length > 0) && (
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Required Skills</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {application.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="text-sm bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg font-medium border border-primary-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(application.niceToHaveSkills && application.niceToHaveSkills.length > 0) && (
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nice to Have</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {application.niceToHaveSkills.map((skill, idx) => (
                    <span key={idx} className="text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium border border-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ResumeSuggestions suggestions={application.resumeSuggestions} />

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </Button>
              <Button onClick={() => setIsEditing(true)} className="!px-5">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Application"
        message={`Are you sure you want to delete the application for ${application.company}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}