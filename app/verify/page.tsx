"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "nextjs-toploader/app";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import api from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { setVerifyCookies, setCookies, clearVerifyCookies } from "../_actions/cookies";

interface Error {
  message : string,
  error : string,
  statusCode : string,
}

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
      const res = await api.post("/auth/verify", {
        email: user?.email,
        verificationCode,
      });
      return res.data;
    },
    onSuccess: (data) => {
      clearVerifyCookies();
      setCookies(data.access_token);
      setCode(null);
      setUser(data.user);
      setCode(null);
      router.replace("/home");
    },
    onError: (error: AxiosError<Error>) => {
      const message =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      setError(message);
    },
  });

  const verifyHandler = () => {
    if (otp.length !== 6) return;
    verifyMutation.mutate(otp);
  };

  const resendCode = useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post(`/auth/resend-code/${email}`);
      return res.data;
    },
    onSuccess: (data) => {
      setVerifyCookies();
      setResendCooldown(60);
      setCode(data.verificationCodeForTesting);
    },
  });

  if (!user || user.isVerified) return null;

  return (
    <main className="min-h-dvh w-dvw flex flex-col items-center p-5 gap-5">
      <div className="flex flex-col items-center justify-center w-full gap-5 pt-5">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-gray-300 text-sm text-center">
          We sent a 6-digit verification code to{" "}
          <b className="text-blue-300">{user.email}</b>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          placeholder={code || ""}
          className="w-full border border-neutral-700 outline-0 focus:border-white p-4 text-3xl text-center text-white"
        />

        {verifyMutation.isError && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}

        <button
          onClick={verifyHandler}
          disabled={verifyMutation.isPending || otp.length !== 6}
          className="p-2 w-full font-bold bg-neutral-200 disabled:opacity-50 disabled:hover:bg-neutral-200 hover:bg-neutral-50  text-black cursor-pointer"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify"}
        </button>

        <button
          className="p-2 w-full font-bold border cursor-pointer disabled:opacity-50"
          disabled={resendCode.isPending || resendCooldown !== 0}
          onClick={() => resendCode.mutate(user.email)}
        >
          {(resendCooldown && `Resend Code in ${resendCooldown}s`) ||
            (resendCode.isPending && "Resending") ||
            "Resend Code"}
        </button>
      </div>
      <p className="absolute bottom-3 text-center text-sm">
        Verification Code will expire in 5 minutes.
      </p>
    </main>
  );
};

export default Verify;
