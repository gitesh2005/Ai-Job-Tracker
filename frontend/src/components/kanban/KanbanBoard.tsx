import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Application, ApplicationStatus } from '../../types';
import KanbanColumn from './KanbanColumn';
import { useUpdateStatus } from '../../features/applications/applications.hooks';

const COLUMNS: ApplicationStatus[] = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

interface KanbanBoardProps {
  applications: Application[];
  onCardClick: (application: Application) => void;
}

export default function KanbanBoard({ applications, onCardClick }: KanbanBoardProps) {
  const updateStatus = useUpdateStatus();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter(app => app.status === status);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const applicationId = active.id as string;
    const newStatus = over.id as ApplicationStatus;

    const application = applications.find(app => app._id === applicationId);
    if (!application || application.status === newStatus) return;

    updateStatus.mutate({ id: applicationId, status: newStatus });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={getApplicationsByStatus(status)}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </DndContext>
  );
}
