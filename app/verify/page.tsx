"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";

const Verify = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!user) {
      router.replace("/ ");
      return;
    }
    if (user?.isVerified) {
      router.replace("/home");
      return;
    }
  }, [user, router]);

  const verifyMutation = useMutation({
    mutationFn: async (verificationCode: string) => {
      const res = await api.post("/auth/verify", {
        email: user?.email,
        verificationCode,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      router.replace("/home");
    },
    onError: () => {},
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
        <p className="text-gray-300 text-sm text-center">
          We sent a 6-digit verification code to{" "}
          <b className="text-blue-300">{user?.email}</b>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          className="border w-full border-neutral-700 p-4 text-white text-3xl text-center"
        />

        {verifyMutation.isError && (
          <p className="text-xs text-red-500 text-center">
            Please enter the correct code
          </p>
        )}

        <button
          onClick={verifyHandler}
          disabled={verifyMutation.isPending}
          className="p-2 w-full font-bold bg-neutral-200 hover:bg-neutral-50 text-black"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify"}
        </button>
      </div>
    </main>
  );
};

export default Verify;
