import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Header />
      <main className="p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}