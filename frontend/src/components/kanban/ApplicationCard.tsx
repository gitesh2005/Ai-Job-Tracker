import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Application, ApplicationStatus } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { cn } from '../../utils/cn';

interface ApplicationCardProps {
  application: Application;
  onClick: () => void;
}

const statusColors: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
  'Applied': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Phone Screen': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Interview': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Offer': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Rejected': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

export default function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  const statusStyle = statusColors[application.status];
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'group bg-white rounded-xl border border-gray-200 p-4 cursor-grab active:cursor-grabbing',
        'transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
        isDragging && 'shadow-xl ring-2 ring-primary-500 scale-105 opacity-80 z-50'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-primary-700 transition-colors">
          {application.company}
        </h3>
        <span className={cn('shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold', statusStyle.bg, statusStyle.text)}>
          {application.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 font-medium">{application.role}</p>
      
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-medium">{formatDate(application.dateApplied)}</span>
        
        {application.location && (
          <>
            <span className="text-gray-300">•</span>
            <span className="truncate max-w-[100px]">{application.location}</span>
          </>
        )}
      </div>

      {application.requiredSkills && application.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {application.requiredSkills.slice(0, 4).map((skill, idx) => (
            <span 
              key={idx} 
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg font-medium border border-gray-200"
            >
              {skill}
            </span>
          ))}
          {application.requiredSkills.length > 4 && (
            <span className="text-xs text-gray-400 font-medium">+{application.requiredSkills.length - 4}</span>
          )}
        </div>
      )}
    </div>
  );
}