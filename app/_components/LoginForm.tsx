"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import loginAction from "../_actions/login";
import { useState } from "react";
import { PiWarningCircle } from "react-icons/pi";

type Inputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setCode = useAuthStore((state) => state.setTmpVerificationCode);
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const mutation = useMutation({
    mutationFn: async (data: Inputs) => {
      const result = await loginAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      reset();
      setError("");

      if (data.user.isVerified) {
        setCode(null);
        setUser(data.user);
        router.replace("/home");
      } else {
        setUser(data.user);
        setCode(data.verificationCode || null);
        router.push("/verify");
      }
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  const renderError = (message?: string) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-2 bg-red-950/30 text-red-600 text-sm rounded-md px-3 py-1 mt-1 animate-fade-in">
        <PiWarningCircle className="w-4 h-4" />
        {message}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-120">

      <div className="relative">
        <input
          id="email"
          type="text"
          placeholder=" "
          className={`peer w-full border border-neutral-700 outline-0 p-4 text-white rounded-md ${
            errors.email ? "border-red-600" : "focus:border-white"
          }`}
          {...register("email", {
            required: "Please enter your email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email",
            },
          })}
        />
        <label
          htmlFor="email"
          className={`absolute bg-background px-2 left-4 top-4 text-gray-400 transition-all duration-200
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
            peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-200
            peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-200
            ${errors.email && "peer-focus:text-red-600 peer-not-placeholder-shown:text-red-600"}
          `}
        >
          Email address
        </label>
        {renderError(errors.email?.message)}
      </div>

      <div className="relative">
        <input
          id="password"
          type="password"
          placeholder=" "
          className={`peer w-full border border-neutral-700 outline-0 p-4 text-white rounded-md ${
            errors.password ? "border-red-600" : "focus:border-white"
          }`}
          {...register("password", {
            required: "Please enter your password",
          })}
        />
        <label
          htmlFor="password"
          className={`absolute bg-background px-2 left-4 top-4 text-gray-400 transition-all duration-200
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
            peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-200
            peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-200
            ${errors.password && "peer-focus:text-red-600 peer-not-placeholder-shown:text-red-600"}
          `}
        >
          Password
        </label>
        {renderError(errors.password?.message)}
      </div>

      <button
        type="submit"
        className="p-3 font-bold bg-neutral-300 cursor-pointer hover:bg-neutral-50 active:bg-neutral-200 text-black rounded-md"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Logging in..." : "Login"}
      </button>

      {mutation.isError && (
        <div className="flex items-center gap-2 bg-red-950/30 text-red-600 text-sm rounded-md px-3 py-1 mt-1 animate-fade-in">
          <PiWarningCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </form>
  );
};

export default LoginForm;
