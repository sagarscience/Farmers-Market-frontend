import { useAuth } from "../context/AuthContext";
import BuyerDashboard from "./BuyerDashboard";
import FarmerDashboard from "./FarmerDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { auth } = useAuth();

  if (!auth?.role) {
    return <p className="p-6 text-red-500">⚠️ Not authorized or role missing.</p>;
  }

  switch (auth.role) {
    case "buyer":
      return <BuyerDashboard />;
    case "farmer":
      return <FarmerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <p className="p-6 text-red-500">⚠️ Unknown role: {auth.role}</p>;
  }
}
