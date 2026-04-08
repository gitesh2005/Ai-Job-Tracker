import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Application, ApplicationStatus } from '../../types';
import ApplicationCard from './ApplicationCard';
import { cn } from '../../utils/cn';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  onCardClick: (application: Application) => void;
}

const columnTitles: Record<ApplicationStatus, string> = {
  'Applied': 'Applied',
  'Phone Screen': 'Phone Screen',
  'Interview': 'Interview',
  'Offer': 'Offer',
  'Rejected': 'Rejected',
};

const columnColors: Record<ApplicationStatus, string> = {
  'Applied': 'from-blue-500/10 to-blue-500/5 border-blue-200',
  'Phone Screen': 'from-yellow-500/10 to-yellow-500/5 border-yellow-200',
  'Interview': 'from-purple-500/10 to-purple-500/5 border-purple-200',
  'Offer': 'from-green-500/10 to-green-500/5 border-green-200',
  'Rejected': 'from-red-500/10 to-red-500/5 border-red-200',
};

const headerColors: Record<ApplicationStatus, string> = {
  'Applied': 'bg-blue-50 text-blue-700',
  'Phone Screen': 'bg-yellow-50 text-yellow-700',
  'Interview': 'bg-purple-50 text-purple-700',
  'Offer': 'bg-green-50 text-green-700',
  'Rejected': 'bg-red-50 text-red-700',
};

export default function KanbanColumn({ status, applications, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-1 min-w-[300px] max-w-[340px] rounded-2xl border-2 transition-all duration-200',
        'bg-gradient-to-b from-gray-50 to-gray-100/50',
        columnColors[status],
        isOver && 'scale-[1.02] shadow-xl'
      )}
    >
      <div className={cn(
        'p-4 rounded-t-xl border-b border-gray-100/50',
        headerColors[status]
      )}>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">{columnTitles[status]}</h2>
          <span className={cn(
            'px-3 py-1 rounded-full text-sm font-semibold',
            headerColors[status],
            'opacity-80'
          )}>
            {applications.length}
          </span>
        </div>
      </div>

      <div className="p-3 space-y-3 min-h-[300px]">
        <SortableContext items={applications.map(a => a._id)} strategy={verticalListSortingStrategy}>
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onClick={() => onCardClick(application)}
            />
          ))}
        </SortableContext>
        
        {applications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm font-medium">No applications</p>
          </div>
        )}
      </div>
    </div>
  );
}