import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CreateApplicationInput } from '../../types';
import { aiApi } from '../../features/ai/ai.api';
import { useCreateApplication } from '../../features/applications/applications.hooks';

interface ApplicationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: 'Applied', label: 'Applied' },
  { value: 'Phone Screen', label: 'Phone Screen' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
];

const SENIORITY_OPTIONS = [
  { value: '', label: 'Select seniority' },
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

type FormData = CreateApplicationInput;

export default function ApplicationForm({ onSuccess, onCancel }: ApplicationFormProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [parseMessage, setParseMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const createApplication = useCreateApplication();

  const today = new Date().toISOString().split('T')[0];

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      status: 'Applied',
      dateApplied: today,
    },
  });

  useEffect(() => {
    setValue('dateApplied', today);
  }, [today, setValue]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createApplication.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess();
      },
      onError: (error) => {
        alert('Failed to create application: ' + (error as Error).message);
      },
    });
  };

  const jobDescription = watch('jobDescription', '');
  const requiredSkills = watch('requiredSkills', []) as string[] | undefined;
  const niceToHaveSkills = watch('niceToHaveSkills', []) as string[] | undefined;
  const resumeSuggestions = watch('resumeSuggestions', []) as string[] | undefined;

  const handleParseWithAI = async () => {
    if (!jobDescription || jobDescription.trim().length === 0) {
      setParseMessage({ type: 'error', text: 'Please enter a job description first' });
      return;
    }

    setIsParsing(true);
    setParseMessage({ type: 'success', text: 'Parsing job description...' });
    setAiFilledFields(new Set());

    try {
      const parsed = await aiApi.parseJobDescription(jobDescription);
      const filledFields = new Set<string>();
      
      if (parsed.company && parsed.company !== 'Not specified') {
        setValue('company', parsed.company);
        filledFields.add('company');
      }
      if (parsed.role && parsed.role !== 'Not specified') {
        setValue('role', parsed.role);
        filledFields.add('role');
      }
      if (parsed.requiredSkills && parsed.requiredSkills.length > 0) {
        setValue('requiredSkills', parsed.requiredSkills);
        filledFields.add('requiredSkills');
      }
      if (parsed.niceToHaveSkills && parsed.niceToHaveSkills.length > 0) {
        setValue('niceToHaveSkills', parsed.niceToHaveSkills);
        filledFields.add('niceToHaveSkills');
      }
      if (parsed.seniority && parsed.seniority !== 'Not specified') {
        setValue('seniority', parsed.seniority);
        filledFields.add('seniority');
      }
      if (parsed.location && parsed.location !== 'Not specified') {
        setValue('location', parsed.location);
        filledFields.add('location');
      }
      if (parsed.resumeSuggestions && parsed.resumeSuggestions.length > 0) {
        setValue('resumeSuggestions', parsed.resumeSuggestions);
        filledFields.add('resumeSuggestions');
      }
      
      setAiFilledFields(filledFields);
      setParseMessage({ type: 'success', text: 'AI extracted key job insights successfully!' });
    } catch (error) {
      setParseMessage({ type: 'error', text: 'Failed to parse. Please fill fields manually.' });
    } finally {
      setIsParsing(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg relative">
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Application</h2>
        <p className="text-sm text-gray-500 mt-1">Track your job application journey</p>
      </div>

      {parseMessage && (
        <div className={`mb-6 p-4 rounded-xl transition-all duration-200 ${
          parseMessage.type === 'error' 
            ? 'bg-red-50 border border-red-200 text-red-700' 
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {parseMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-800">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={aiFilledFields.has('company') ? 'bg-green-50 border border-green-200 rounded-xl p-1' : ''}>
              <Input
                id="company"
                label="Company *"
                placeholder="e.g. Google, Meta, Apple"
                {...register('company', { required: 'Company is required' })}
                error={errors.company?.message}
                className={aiFilledFields.has('company') ? 'bg-green-50 border-green-200' : ''}
              />
            </div>
            <div className={aiFilledFields.has('role') ? 'bg-green-50 border border-green-200 rounded-xl p-1' : ''}>
              <Input
                id="role"
                label="Role *"
                placeholder="e.g. Software Engineer, Product Manager"
                {...register('role', { required: 'Role is required' })}
                error={errors.role?.message}
                className={aiFilledFields.has('role') ? 'bg-green-50 border-green-200' : ''}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Job Description */}
        <div>
          <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-800">Job Description</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Description</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 resize-none"
                rows={5}
                placeholder="Paste the full job description here..."
                {...register('jobDescription')}
              />
            </div>
            <Input
              id="jdLink"
              label="Job Link"
              placeholder="e.g. https://careers.google.com/jobs/..."
              {...register('jdLink')}
            />
            <Button
              type="button"
              onClick={handleParseWithAI}
              isLoading={isParsing}
              className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200 font-medium"
            >
              {isParsing ? 'Analyzing Job Description...' : '✨ Parse with AI'}
            </Button>
          </div>
        </div>

        {/* Section 3: AI Insights */}
        {(requiredSkills && requiredSkills.length > 0 || niceToHaveSkills && niceToHaveSkills.length > 0) && (
          <div className="bg-gray-50 p-5 rounded-xl border mt-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">AI Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requiredSkills && requiredSkills.length > 0 && (
                <div className={aiFilledFields.has('requiredSkills') ? 'bg-green-50 border border-green-200 rounded-xl p-3' : 'bg-white p-3 rounded-xl border'}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {niceToHaveSkills && niceToHaveSkills.length > 0 && (
                <div className={aiFilledFields.has('niceToHaveSkills') ? 'bg-green-50 border border-green-200 rounded-xl p-3' : 'bg-white p-3 rounded-xl border'}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nice to Have</label>
                  <div className="flex flex-wrap gap-2">
                    {niceToHaveSkills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 4: Application Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-800">Application Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={aiFilledFields.has('seniority') ? 'bg-green-50 border border-green-200 rounded-xl p-1' : ''}>
              <Select
                id="status"
                label="Status"
                options={STATUS_OPTIONS}
                {...register('status')}
              />
            </div>
            <div className={aiFilledFields.has('seniority') ? 'bg-green-50 border border-green-200 rounded-xl p-1' : ''}>
              <Select
                id="seniority"
                label="Seniority"
                options={SENIORITY_OPTIONS}
                {...register('seniority')}
              />
            </div>
            <div className={aiFilledFields.has('location') ? 'bg-green-50 border border-green-200 rounded-xl p-1' : ''}>
              <Input
                id="location"
                label="Location"
                placeholder="e.g. Remote, San Francisco, New York"
                {...register('location')}
                className={aiFilledFields.has('location') ? 'bg-green-50 border-green-200' : ''}
              />
            </div>
            <Input
              id="salaryRange"
              label="Salary Range"
              placeholder="e.g. $120k - $180k"
              {...register('salaryRange')}
            />
            <Input
              id="dateApplied"
              type="date"
              label="Date Applied"
              {...register('dateApplied')}
            />
          </div>
        </div>

        {/* Section 5: AI Resume Suggestions */}
        {resumeSuggestions && resumeSuggestions.length > 0 && (
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-5 rounded-xl border border-primary-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">AI Resume Suggestions</h3>
            <div className="space-y-3">
              {resumeSuggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-white border rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => handleCopy(suggestion, index)}
                >
                  <span className="text-gray-700 text-sm">{suggestion}</span>
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                    {copiedIndex === index ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Notes */}
        <div>
          <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-800">Notes</h3>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 resize-none"
            rows={3}
            placeholder="e.g. Applied via LinkedIn, referral by John, follow-up scheduled..."
            {...register('notes')}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 px-4 py-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={createApplication.isPending}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            {createApplication.isPending ? 'Saving...' : 'Add Application'}
          </Button>
        </div>
      </form>
    </div>
  );
}