// import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F7]">
      {/* <SignIn /> */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In Disabled</h1>
        <p>Authentication is currently disabled.</p>
      </div>
    </div>
  );
}
