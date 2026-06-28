import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (!isLogin) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast.error('Password must be 8+ characters with uppercase, lowercase, number, and special character');
        return;
      }
    }
    
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
    <div
      className='min-h-screen flex items-center justify-center p-4'
      style={{ backgroundColor: "#FAF4E3" }}
    >
      {/* Background elements */}
      <div
        className='fixed top-0 left-0 w-64 h-64'
        style={{
          backgroundColor: "#F7B7DA",
          transform: "rotate(-15deg) translate(-30px, -30px)",
        }}
      ></div>
      <div
        className='fixed bottom-0 right-0 w-96 h-96'
        style={{
          backgroundColor: "#B6CAEC",
          transform: "rotate(25deg) translate(40px, 40px)",
        }}
      ></div>

      <div className='relative w-full max-w-md'>
        {/* Sticker/decal */}
        <div className='absolute -top-6 -right-6 z-10 rotate-12'>
          <div
            className='px-3 py-1 text-xs font-bold uppercase'
            style={{ backgroundColor: "#F6D76A", border: "2px solid #131214" }}
          >
            Organized Chaos ✨
          </div>
        </div>

        {/* Main card */}
        <div
          className='relative bg-white border-4 border-black p-8'
          style={{ boxShadow: "12px 12px 0 0 #131214" }}
        >
          <div className='text-center mb-8'>
            <div className='inline-block mb-4'>
              <div className='text-7xl transform -rotate-6 hover:rotate-0 transition-transform'>
                📒
              </div>
            </div>
            <h1
              className='text-6xl font-black mb-2 uppercase tracking-tighter'
              style={{ color: "#131214" }}
            >
              taskor
            </h1>
            <div className='flex items-center justify-center gap-2 mt-3'>
              <div className='w-2 h-2 bg-black'></div>
              <p className='text-xs font-mono uppercase tracking-wider'>
                beta v1.0
              </p>
              <div className='w-2 h-2 bg-black'></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {!isLogin && (
              <div>
                <label className='block text-xs font-bold uppercase mb-1 tracking-wider'>
                  Username
                </label>
                <input
                  type='text'
                  placeholder='e.g., chaim'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='w-full px-4 py-3 border-2 border-black bg-white font-mono'
                  style={{ boxShadow: "inset 2px 2px 0 0 rgba(0,0,0,0.1)" }}
                  required
                />
              </div>
            )}
            <div>
              <label className='block text-xs font-bold uppercase mb-1 tracking-wider'>
                Email
              </label>
              <input
                type='email'
                placeholder='hello@post.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 border-2 border-black bg-white font-mono'
                style={{ boxShadow: "inset 2px 2px 0 0 rgba(0,0,0,0.1)" }}
                required
              />
            </div>
            <div>
              <label className='block text-xs font-bold uppercase mb-1 tracking-wider'>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-3 border-2 border-black bg-white font-mono transition-all duration-200 pr-12'
                  style={{ boxShadow: "inset 2px 2px 0 0 rgba(0,0,0,0.1)" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:scale-110 transition-transform"
                  style={{ color: '#131214', opacity: 0.5 }}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs mt-1 font-mono" style={{ color: '#131214', opacity: 0.4 }}>
                  Must be 8+ chars with uppercase, lowercase, number, and special character
                </p>
              )}
            </div>
            <button
              type='submit'
              className='w-full py-4 font-black uppercase tracking-wider text-lg border-4 border-black'
              style={{
                backgroundColor: "#F6D76A",
                boxShadow: "6px 6px 0 0 #131214",
              }}
            >
              {isLogin ? "→ enter ←" : "→ create ←"}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className='w-full mt-6 text-sm font-mono underline hover:no-underline'
            style={{ color: "#131214" }}
          >
            {isLogin
              ? "[ no account? start one ]"
              : "[ already have one? sign in ]"}
          </button>
        </div>

        {/* Footer note */}
        <div className='text-center mt-8'>
          <p
            className='text-xs font-mono'
            style={{ color: "#131214", opacity: 0.6 }}
          >
            made with ☕ and chai
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;