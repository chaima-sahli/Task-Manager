import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF4E3' }}>
        <div className="text-2xl animate-pulse" style={{ color: '#131214' }}>loading...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {!user ? <Login /> : <Dashboard />}
    </>
  );
}

export default App;