/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { LoginResponse } from "@/redux/types/auth.type";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result: LoginResponse = await login({ email, password }).unwrap();
      const from = location.state?.from?.pathname || '/profile';

      if (result.data.isTwoStepVerification) {
        navigate("/verify-2fa", {
          state: { userId: result.data.user.id, from },
          replace: true,
        });
        return;
      }

      if (result.data.user.role === "ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else if (
        result.data.user.role === "ATHLATE" ||
        result.data.user.role === "PARENT"
      ) {
        navigate(from, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      toast.error(
        err?.data?.message || err?.error || "Login failed. Check credentials.",
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and password to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email*
            </label>
            <div className="mt-1.5">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password*
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 py-3 text-center font-semibold hover:bg-green-700 disabled:bg-green-700 text-white px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Don't have an account?
          <Link
            to="/signup"
            className="text-green-600 hover:text-green-700 cursor-pointer text-base ml-1"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;

// import { useState } from "react";
// import React from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { setUser } from "@/redux/features/auth/authSlice";
// import { useAppDispatch } from "@/redux/hooks/redux-hook";
// import { LoginResponse } from "@/redux/types/auth.type";
// import { useLoginMutation } from "@/redux/features/auth/authApi";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const [login, { isLoading }] = useLoginMutation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const result: LoginResponse = await login({ email, password }).unwrap();

//       dispatch(
//         setUser({
//           user: {
//             id: result.user.id,
//             email: result.user.email,
//             name: `${result.user.firstName} ${result.user.lastName}`,
//             role: result.user.role,
//           },
//           token: result.accessToken,
//         }),
//       );

//       // Role-based redirect
//       // switch (result.user.role) {
//       //   case "ADMIN":
//       //     navigate("/admin-dashboard");
//       //     break;
//       //   case "DOCTOR":
//       //   case "NURSE":
//       //   case "LAB_TECHNICIAN":
//       //   case "RECEPTIONIST":
//       //   case "MODERATOR":
//       //   case "PATIENT":
//       //   case "USER":
//       //     navigate("/staff-dashboard");
//       //     break;
//       //   default:
//       //     navigate("/");
//       // }
//       // Role-based redirect
//       if (result.user.role === "ADMIN") {
//         navigate("/admin-dashboard");
//       } else {
//         navigate("/user-dashboard");
//       }
//     } catch (err: any) {
//       console.error("Login failed:", err);
//       alert(
//         err?.data?.message || err?.error || "Login failed. Check credentials.",
//       );
//     }
//   };

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-white px-4">
//       <div className="w-full max-w-xl">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
//           <p className="mt-2 text-sm text-gray-600">
//             Enter your email and password to access your account
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email Input */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email*
//             </label>
//             <div className="mt-1.5">
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
//               />
//             </div>
//           </div>

//           {/* Password Input */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password*
//             </label>
//             <div className="relative mt-1.5">
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className="flex items-center justify-between">
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//                 className="h-4 w-4 rounded border-gray-300 accent-green-700 cursor-pointer"
//               />

//               <span className="text-sm text-gray-600">Remember me</span>
//             </label>
//             <a
//               href="#"
//               className="text-sm text-green-600 hover:text-green-700 cursor-pointer"
//             >
//               Forgot Password?
//             </a>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-green-600 py-3 text-center font-semibold hover:bg-green-700 disabled:bg-green-700 text-white px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//         <p className="text-sm text-gray-400 mt-4 text-center">
//           Don’t have an account?
//           <Link
//             to="/signup"
//             className="text-green-600 hover:text-green-700 cursor-pointer text-base ml-1"
//           >
//             Register
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// };

// export default LoginPage;

// import { useState } from "react";
// import React from "react";
// import { Eye, EyeOff } from "lucide-react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     console.log("Login attempt:", { email, password, rememberMe });
//     setIsLoading(false);
//   };

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-white px-4">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
//           <p className="mt-2 text-sm text-gray-600">
//             Enter your email and password to access your account
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email Input */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email*
//             </label>
//             <div className="mt-1.5">
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
//               />
//             </div>
//           </div>

//           {/* Password Input */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password*
//             </label>
//             <div className="relative mt-1.5">
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className="flex items-center justify-between">
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//                 className="h-4 w-4 rounded border-gray-300 accent-green-700 cursor-pointer"
//               />

//               <span className="text-sm text-gray-600">Remember me</span>
//             </label>
//             <a
//               href="#"
//               className="text-sm text-green-600 hover:text-green-700 cursor-pointer"
//             >
//               Forgot Password?
//             </a>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-green-600 py-3 text-center font-semibold hover:bg-green-700 disabled:bg-green-700 text-white px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }
