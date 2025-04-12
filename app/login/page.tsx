"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main 
      className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      data-testid="login-page"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 
          className="mt-8 text-center text-3xl font-extrabold text-gray-900"
          data-testid="login-heading"
          role="heading"
          aria-level={1}
        >
          Sign in to your account
        </h2>
      </div>
      <LoginForm />
    </main>
  );
}