"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "nextjs-toploader/app";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import verifyAction from "../_actions/verify";

const Verify = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60);

  const user = useAuthStore((state) => state.user);
  const code = useAuthStore((state) => state.tmpVerificationCode);
  const setUser = useAuthStore((state) => state.setUser);
  const setCode = useAuthStore((state) => state.setTmpVerificationCode);

  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (resendCooldown === 0) return;

    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  const verifyMutation = useMutation({
    mutationFn: async (verificationCode: string) => {
      if (!user?.email) throw new Error("Missing email");
      const result = await verifyAction(user.email, verificationCode);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setCode(null);
      router.replace("/home");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const verifyHandler = () => {
    if (otp.length !== 6) return;
    verifyMutation.mutate(otp);
  };

  if (!user || user.isVerified) return null;

  return (
    <main className="min-h-dvh w-dvw flex flex-col items-center p-5 gap-5">
      <div className="flex flex-col items-center justify-center w-full gap-5 pt-5">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
          We sent a 6-digit verification code to{" "}
          <b className="text-blue-600 dark:text-blue-300">{user.email}</b>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          placeholder={code || ""}
          className="w-full border border-gray-300 dark:border-neutral-700 outline-0 focus:border-black dark:focus:border-white p-4 text-3xl text-center text-black dark:text-white"
        />

        {verifyMutation.isError && (
          <p className="text-xs text-red-600 dark:text-red-500 text-center">
            {error}
          </p>
        )}

        <button
          onClick={verifyHandler}
          disabled={verifyMutation.isPending || otp.length !== 6}
          className="p-2 w-full font-bold bg-black dark:bg-neutral-50 disabled:opacity-50 text-white dark:text-black cursor-pointer"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify"}
        </button>
      </div>

      <p className="absolute bottom-3 text-center text-sm">
        Verification Code will expire in 5 minutes.
      </p>
    </main>
  );
};

export default Verify;
