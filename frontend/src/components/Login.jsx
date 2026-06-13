import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(username, email, password);
    }
    
    if (result.success) {
      toast.success(isLogin ? 'Welcome back! ✨' : 'Account created! 🎉');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAF4E3' }}>
      <div className="max-w-md w-full">
        {/* Decorative shapes */}
        <div className="relative">
          <div className="absolute top-0 -left-16 w-32 h-32 rounded-full" style={{ backgroundColor: '#F7B7DA', opacity: 0.3 }}></div>
          <div className="absolute bottom-0 -right-16 w-40 h-40 rounded-full" style={{ backgroundColor: '#B6CAEC', opacity: 0.3 }}></div>
          
          {/* Main card  */}
          <div className="relative bg-white p-10" style={{ border: '2px solid #131214' }}>
            {/* Hand-drawn style header */}
            <div className="text-center mb-10">
              <div className="inline-block mb-4">
                <div className="relative">
                  <div className="text-6xl">✨</div>
                  <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full" style={{ backgroundColor: '#F6D76A' }}></div>
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-2" style={{ color: '#131214', letterSpacing: '-0.02em' }}>
                taskorbit
              </h1>
              <p className="text-sm" style={{ color: '#131214', opacity: 0.6 }}>organize the chaos</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#131214' }}>
                    what should we call you?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., chaim"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 transition-all duration-200"
                    style={{ borderColor: '#131214', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = '#F7B7DA'}
                    onBlur={(e) => e.target.style.borderColor = '#131214'}
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#131214' }}>
                  email
                </label>
                <input
                  type="email"
                  placeholder="hello@post.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 transition-all duration-200"
                  style={{ borderColor: '#131214', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = '#F7B7DA'}
                  onBlur={(e) => e.target.style.borderColor = '#131214'}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#131214' }}>
                  password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 transition-all duration-200"
                  style={{ borderColor: '#131214', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = '#F7B7DA'}
                  onBlur={(e) => e.target.style.borderColor = '#131214'}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 font-medium transition-all duration-200 hover:translate-x-1"
                style={{ backgroundColor: '#F6D76A', color: '#131214', border: '2px solid #131214' }}
              >
                {isLogin ? '→ let me in ←' : '→ create account ←'}
              </button>
            </form>
            
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full mt-5 text-sm transition-all duration-200 hover:underline"
              style={{ color: '#131214', opacity: 0.7 }}
            >
              {isLogin ? "no account? start one" : "already have one? sign in"}
            </button>
          </div>
        </div>
        
        {/* Quirky footer */}
        <p className="text-center text-xs mt-6" style={{ color: '#131214', opacity: 0.5 }}>
          made with ☕ and bad ideas
        </p>
      </div>
    </div>
  );
};

export default Login;