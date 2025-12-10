"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/libs/axios";
import { useAuthStore } from "@/store/auth";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterPayload = Omit<Inputs, "confirmPassword">;

const Register = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const mutation = useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const res = await api.post("/auth/register", data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      console.log("Register Successful:", data);
    },
    onError: (err: Error) => {
      console.error("Register failed:", err.message);
    },
  });

  const onSubmit: SubmitHandler<RegisterPayload> = ({ name, email, password}) => {
    mutation.mutate({ name, email, password});
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 w-120"
    >
      <div className="relative">
        <input
          type="text"
          placeholder=" "
          className="peer w-full border border-neutral-700 outline-0 focus:border-white p-4 text-white"
          {...register("name", { required: "Please enter your name" })}
        />
        <label
          className="absolute bg-background px-2 left-4 top-4 text-gray-400 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-200 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-200
        "
        >
          Full Name
        </label>
        {errors.name && (
          <p className="text-red-500 text-sm px-1">{errors.name.message}</p>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder=" "
          className="peer w-full border border-neutral-700 outline-0 focus:border-white p-4 text-white"
          {...register("email", { required: "Please enter your email" })}
        />
        <label
          className="absolute bg-background px-2 left-4 top-4 text-gray-400 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-200 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-200
        "
        >
          Email address
        </label>
        {errors.email && (
          <p className="text-red-500 text-sm px-1">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <input
          type="password"
          placeholder=" "
          className="peer w-full border border-neutral-700 outline-0 focus:border-white p-4 text-white"
          {...register("password", { required: "Please enter your password" })}
        />
        <label
          className="absolute bg-background px-2 left-4 top-4 text-gray-400 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-200 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-200
        "
        >
          Password
        </label>
        {errors.password && (
          <p className="text-red-500 text-sm px-1">{errors.password.message}</p>
        )}
      </div>

      <div className="relative">
        <input
          type="password"
          placeholder=" "
          className="peer w-full border border-neutral-700 outline-0 focus:border-white p-4 text-white"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value, formValues) =>
              value === formValues.password || "Passwords do not match",
          })}
        />
        <label
          className="absolute bg-background px-2 left-4 top-4 text-gray-400 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-200 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-200
        "
        >
          Confirm Password
        </label>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm px-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="p-2 font-bold bg-neutral-200 cursor-pointer hover:bg-neutral-50 text-black"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Creating an account..." : "Sign up"}
      </button>

      {mutation.isError && (
        <p className="text-red-500 text-sm mt-1">
          Register failed, please try again.
        </p>
      )}
    </form>
  );
};

export default Register;
