import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "@/redux/hooks/redux-hook";

type SuperAdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: SuperAdminRouteProps) => {
  const user = useAppSelector((state) => state.auth.user);

  console.log("SuperAdminRoute -> User:", user);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    // Logged in but NOT super admin
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;

// // src/routes/AdminRoute.tsx
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { ReactNode } from "react";
// import { AppRootState } from "@/redux/store";

// type AdminRouteProps = {
//   children: ReactNode;
// };

// const AdminRoute = ({ children }: AdminRouteProps) => {
//   const user = useSelector((state: AppRootState) => state.auth.user);
//   console.log("Admin Data:", user);

//   if (!user || user.role !== "admin") {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

// export default AdminRoute;
