    import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    // Add your login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-500 flex items-center justify-center overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff33_0%,transparent_50%)]" />
      
      {/* Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2 text-white">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-xl">
          E
        </div>
        <span className="text-2xl font-semibold tracking-tight">Ebot</span>
      </div>

      {/* Main Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md mx-4 p-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">👋</span>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Sign in with email
          </h1>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Make a new start to bring your words, data,<br />
            and teams together. For free.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
<<<<<<< HEAD
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ✉️
=======
            <h2> Hello!</h2>
            <p className="subtitle">Login into your dashboard</p>

            <div className="form-content">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                />
              </div>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
                <button
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </button>
>>>>>>> f78f14e33f13c1077d4a575ffc3e55cd796d3d48
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

<<<<<<< HEAD
          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 text-base shadow-lg shadow-black/20 active:scale-[0.985]"
          >
            Get Started
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-500 text-sm font-medium">Or sign in with</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 py-3 rounded-2xl transition-colors">
            <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 py-3 rounded-2xl transition-colors">
            <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center text-white text-xs font-bold">f</div>
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 py-3 rounded-2xl transition-colors">
            <span className="text-xl"></span>
=======
          <button className="btn" onClick={handleLogin} disabled={loading}>
            {loading ? <span className="spinner"></span> : "Login "}
>>>>>>> f78f14e33f13c1077d4a575ffc3e55cd796d3d48
          </button>
        </div>
      </div>

      {/* Subtle cloud-like decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
    </div>
  );
<<<<<<< HEAD
};

export default LoginPage;
=======
}
>>>>>>> f78f14e33f13c1077d4a575ffc3e55cd796d3d48
