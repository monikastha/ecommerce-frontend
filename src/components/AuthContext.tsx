// import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// type User = {
//   id: number;
//   email: string;
//   full_name: string;
//   role: string;
// };

// type AuthContextType = {
//   user: User | null;
//   isLoggedIn: boolean;
//   login: (userData: User, token: string) => void;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   // Load user data when app starts
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   const login = (userData: User, token: string) => {
//     localStorage.setItem("accessToken", token);
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };