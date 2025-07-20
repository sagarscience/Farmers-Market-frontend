import { useAuth } from "../context/AuthContext";
import BuyerDashboard from "./BuyerDashboard";
import FarmerDashboard from "./FarmerDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { auth } = useAuth();

  if (auth.role === "buyer") return <BuyerDashboard />;
  if (auth.role === "farmer") return <FarmerDashboard />;
  if (auth.role === "admin") return <AdminDashboard />;

  return <p className="p-6 text-red-500">Invalid role or not authorized</p>;
}
