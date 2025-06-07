import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

const RedirectPage = async () => {
  const session = await auth();

  if (session?.user.role === "STOREONE") {
    redirect("/dashboard/cashier_one");
  }
  if (session?.user.role === "STORETWO") {
    redirect("/dashboard/cashier_two");
  }
  if (session?.user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  return;
};

export default RedirectPage;
