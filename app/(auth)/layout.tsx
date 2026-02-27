import { getCurrentUser } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import "../globals.css";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (currentUser.success) return redirect("/");
  return (
    <html>
      <body>
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </body>
    </html>
  );
};
export default Layout;
