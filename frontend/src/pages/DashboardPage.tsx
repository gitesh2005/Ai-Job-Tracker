import { useState, useMemo } from 'react';
import { useApplications } from '../features/applications/applications.hooks';
import KanbanBoard from '../components/kanban/KanbanBoard';
import ApplicationForm from '../components/applications/ApplicationForm';
import ApplicationDetailModal from '../components/applications/ApplicationDetailModal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { Application, ApplicationStatus } from '../types';

const STATUS_FILTERS: { value: ApplicationStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Phone Screen', label: 'Phone Screen' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
];

export default function DashboardPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');

  const { data: applications = [], isLoading, error, refetch } = useApplications();

  const filteredApplications = useMemo(() => {
    let filtered = applications;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.company.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query) ||
        app.notes?.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    return filtered;
  }, [applications, searchQuery, statusFilter]);

  const getStats = () => {
    const total = applications.length;
    const inProgress = applications.filter(a => a.status === 'Applied' || a.status === 'Phone Screen' || a.status === 'Interview').length;
    const interviews = applications.filter(a => a.status === 'Interview').length;
    const offers = applications.filter(a => a.status === 'Offer').length;
    const rejected = applications.filter(a => a.status === 'Rejected').length;
    return { total, inProgress, interviews, offers, rejected };
  };

  const handleExportCSV = () => {
    const headers = ['Company', 'Role', 'Status', 'Date Applied', 'Location', 'Seniority', 'Notes'];
    const rows = applications.map(app => [
      app.company,
      app.role,
      app.status,
      app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : '',
      app.location || '',
      app.seniority || '',
      app.notes || '',
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const stats = getStats();

  const handleCardClick = (application: Application) => {
    setSelectedApplicationId(application._id);
  };

  const handleCloseDetail = () => {
    setSelectedApplicationId(null);
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner className="w-10 h-10 mb-4 text-primary-500" />
        <p className="text-gray-500 font-medium">Loading your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-900 font-semibold mb-2">Failed to load applications</p>
        <p className="text-gray-500 text-sm mb-4">Please try again</p>
        <Button onClick={() => refetch()} variant="secondary" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font--bold text-gray-900 dark:text-white tracking-tight">Job Applications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your job search progress</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleExportCSV}
            variant="secondary"
            className="!px-4 !py-2.5"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </Button>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="!px-5 !py-2.5 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Write Application
          </Button>
        </div>
      </div>

      {applications.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg">
              <p className="text-blue-100 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 shadow-lg">
              <p className="text-amber-100 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.inProgress}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-lg">
              <p className="text-purple-100 text-sm font-medium">Interviews</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.interviews}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-5 shadow-lg">
              <p className="text-emerald-100 text-sm font-medium">Offers</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.offers}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-5 shadow-lg">
              <p className="text-gray-300 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.rejected}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by company, role, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
            >
              {STATUS_FILTERS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No applications yet</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
            Start tracking your job search by adding your first application. Use the AI feature to parse job descriptions automatically!
          </p>
          <Button onClick={() => setShowAddForm(true)} className="!px-6">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Application
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <KanbanBoard
            applications={filteredApplications}
            onCardClick={handleCardClick}
          />
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ApplicationForm
              onSuccess={handleFormSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {selectedApplicationId && (
        <ApplicationDetailModal
          applicationId={selectedApplicationId}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}