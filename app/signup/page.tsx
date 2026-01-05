import Register from "../_components/RegisterForm";
import Image from "next/image";
import Link from "next/link";

const Signup = () => {
  return (
    <main className="h-dvh overflow-hidden w-dvw flex flex-col justify-center items-center p-5">
      <div className="overflow-scroll w-full scrollbar-none">
        <div className="flex flex-col items-center justify-center w-full pb-5">
        <Image
          src="/sea-logo.jpg"
          alt="Star Education Academy Logo"
          width={100}
          height={100}
          className="rounded-full mb-5"
        />
        <h1 className="text-2xl font-bold mb-1">Create Account</h1>
        <p className="text-gray-300 text-sm text-center">
          Join Star Education Academy and Start Your Journey
        </p>
      </div>
      <div className="mt-4 w-full flex justify-center">
        <Register />
      </div>
      <div className="flex justify-center items-center gap-1 mt-5">
        <p className="text-sm text-gray-300">Already have an account?</p>
        <Link href="/" className="text-blue-300 text-sm">
          Login
        </Link>
      </div>
      </div>
    </main>
  );
};

export default Signup;

