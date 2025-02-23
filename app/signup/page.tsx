import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <main 
      className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 mt-8"
      data-testid="signup-page"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          data-testid="signup-heading"
          role="heading"
          aria-level={1}
        >
          Create your account
        </h2>
      </div>
      <SignUpForm />
    </main>
  );
}