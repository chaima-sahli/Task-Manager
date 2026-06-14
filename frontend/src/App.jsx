import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF4E3' }}>
        <div className="text-center">
          <div className="text-4xl mb-2">🌀</div>
          <p style={{ color: '#131214', opacity: 0.7 }}>loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {user ? <Dashboard /> : <Login />}
    </>
  );
}

export default App;