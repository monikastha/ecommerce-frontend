// import React, { useState } from 'react';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Login attempt with:', { email, password });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-500 flex items-center justify-center overflow-hidden relative">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff33_0%,transparent_50%)]" />
//       <div className="absolute top-8 left-8 flex items-center gap-2 text-white">
//         <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-xl">E</div>
//         <span className="text-2xl font-semibold tracking-tight">Ebot</span>
//       </div>
//       <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md mx-4 p-10">
//         <div className="flex justify-center mb-6">
//           <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
//             <span className="text-4xl">👋</span>
//           </div>
//         </div>
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign in with email</h1>
//           <p className="text-gray-600 text-[15px] leading-relaxed">Make a new start to bring your words, data,<br />and teams together. For free.</p>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
//             <div className="relative">
//               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</div>
//               <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400" required />
//             </div>
//           </div>
//           <div>
//             <div className="flex justify-between items-center mb-1.5">
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <a href="#" className="text-sm text-blue-600 font-medium">Forgot password?</a>
//             </div>
//             <div className="relative">
//               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</div>
//               <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-gray-900 placeholder:text-gray-400" required />
//             </div>
//           </div>
//           <button type="submit" className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 text-base">Get Started</button>
//         </form>
//         <div className="flex items-center gap-4 my-8">
//           <div className="flex-1 h-px bg-gray-200"></div>
//           <span className="text-gray-500 text-sm font-medium">Or sign in with</span>
//           <div className="flex-1 h-px bg-gray-200"></div>
//         </div>
//         <div className="grid grid-cols-3 gap-3">
//           <button className="flex items-center justify-center border border-gray-200 py-3 rounded-2xl">
//             <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-5 h-5" />
//           </button>
//           <button className="flex items-center justify-center border border-gray-200 py-3 rounded-2xl">
//             <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center text-white text-xs font-bold">f</div>
//           </button>
//           <button className="flex items-center justify-center border border-gray-200 py-3 rounded-2xl">
//             <span className="text-xl">🍎</span>
//           </button>
//         </div>
//       </div>
//       <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
//     </div>
//   );
// };

// export default LoginPage;