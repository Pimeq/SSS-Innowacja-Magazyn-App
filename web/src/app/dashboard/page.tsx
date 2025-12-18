import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/__nextauth/authOptions";
import { redirect } from "next/navigation";

export default async function DashboardRoot() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  switch (role) {
    case "admin":
      redirect("/dashboard/admin");
      break;
    case "worker":
      redirect("/dashboard/worker");
      break;
    default:
      redirect("/"); 
      break;
  }
  
  return null;
}