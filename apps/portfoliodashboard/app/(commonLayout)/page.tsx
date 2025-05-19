import { LoginForm } from "@/components/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const page = async() => {
      // Check if user is already logged in
  const isAuthenticated = (await cookies()).has("auth-token")

  if (isAuthenticated) {
    redirect("/dashboard")
  }
    return (
        <main>
             <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-800">Welcome Back</h1>
          <p className="text-green-600">Sign in to access your dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
        </main>
    );
};

export default page;