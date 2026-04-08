import Spinner from '../ui/Spinner';

export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="w-12 h-12" />
    </div>
  );
}
