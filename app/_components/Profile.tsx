"use client";

import {
  getUserAction,
  checkUniqueUsernameAction,
  updateUsernameAction,
  updateCoverPicAction,
} from "../_actions/user";
import { uploadFiles } from "@/utils/uploadUtils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowBigLeft,
  ShieldCheck,
  PencilLine,
  X,
  Camera,
  Check,
} from "lucide-react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import PostReel from "./PostReel";
import { useState } from "react";
import ImageViewer from "./ImageViewer";
import DummyProfile from "./DummyProfile";

const Profile = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const viewer = useAuthStore((state) => state.user);
  const viewerId = viewer?.id;
  const [menu, setMenu] = useState(false);
  const [editCover, setEditCover] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(
    null,
  );
  const [isPending, setIsPending] = useState(false);
  const [imageView, setImageView] = useState<"cover" | "profile" | null>(null);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const result = await getUserAction(userId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });

  if (isLoading) return <DummyProfile />;
  if (error)
    return (
      <div className="flex justify-center items-center lg:h-dvh h-[calc(100dvh-60px)]">
        Error{error.message}{" "}
        <button onClick={() => refetch()}>Retry</button>{" "}
      </div>
    );

  const isOwner = viewerId === user?.id;

  return (
    <main className="bg-white relative text-sm sm:text-base dark:bg-neutral-900 lg:min-h-dvh min-h-[calc(100dvh-60px)]">
      <div className="flex w-full sticky top-15 bg-white dark:bg-neutral-900 lg:top-0 z-10 justify-between h-12 lg:h-15 font-semibold">
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <ArrowBigLeft fill="black" className="dark:fill-white" />{" "}
          </button>
          <span className="text-lg">{user?.name}&apos;s Profile</span>
        </div>
        {isOwner && (
          <div className="flex justify-center items-center">
            <button
              className="p-2"
              onClick={() => {
                setMenu(!menu);
              }}
            >
              {menu ? <X size={22} /> : <PencilLine size={22} />}
            </button>
            {menu && (
              <div className="absolute backdrop-blur-sm flex flex-col w-full top-1/1 right-0">
                <button className="h-12 w-20">Yes</button>
                <button className="h-12 w-20">Yes</button>
                <button className="h-12 w-20">Yes</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="relative mb-[10vw] md:mb-[6vw] lg:mb-[clamp(10px,5vw,60px)]">
        <div className="w-full aspect-5/2 relative bg-gray-300">
          {coverPreviewUrl ? (
            <Image src={coverPreviewUrl} onClick={()=>setImageView("cover")} fill alt="cover photo preview" className="object-cover" />
          ) : (
            user?.coverPic && <Image src={user.coverPic} onClick={()=>setImageView("cover")} fill alt="cover photo" className="object-cover" />
          )}
          {isOwner &&
            (editCover ? (
              <div className="absolute right-2 bottom-2 flex gap-2">
                <button
                  className="backdrop-blur-sm p-2 bg-blue-400 dark:bg-neutral-900 hover:bg-blue-300 dark:hover:bg-black rounded-lg"
                  onClick={async () => {
                    if (!selectedFile) return;

                    setIsPending(true);
                    const toastId = toast.loading("Updating cover photo...");
                    setEditCover(false);
                    try {
                      const uploadedImages = await uploadFiles([
                        selectedFile,
                      ]);
                      if (!uploadedImages || uploadedImages.length === 0) {
                        throw new Error("Upload failed");
                      }

                      const uploadedImage = uploadedImages[0];
                      const imageData = {
                        key: uploadedImage.key,
                        fileName: uploadedImage.fileName,
                        fileSize: uploadedImage.fileSize,
                        mimeType: uploadedImage.mimeType,
                      };

                      const updateResult =
                        await updateCoverPicAction(imageData);
                      if (!updateResult.success) {
                        throw new Error(updateResult.error);
                      }

                      await queryClient.invalidateQueries({
                        queryKey: ["user", userId],
                      });

                      toast.success("Cover photo updated successfully!", {
                        id: toastId,
                      });

                      setSelectedFile(null);
                      if (coverPreviewUrl) {
                        URL.revokeObjectURL(coverPreviewUrl);
                        setCoverPreviewUrl(null);
                      }
                    } catch (error) {
                      toast.error(
                        `Failed to update cover photo: ${error instanceof Error ? error.message : "Unknown error"}`,
                        { id: toastId },
                      );
                    }
                    setIsPending(false);
                  }}
                >
                  <Check className="w-[6vw] md:w-[3.5vw] lg:w-[clamp(20px,3.5vw,30px)] h-[6vw] md:h-[3.5vw] lg:h-[clamp(20px,3.5vw,30px)]" />
                </button>
                <button
                  className="backdrop-blur-sm p-2 bg-gray-400 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded-lg"
                  onClick={() => {
                    setEditCover(false);
                    setSelectedFile(null);
                    if (coverPreviewUrl) {
                      URL.revokeObjectURL(coverPreviewUrl);
                      setCoverPreviewUrl(null);
                    }
                  }}
                >
                  <X className="w-[6vw] md:w-[3.5vw] lg:w-[clamp(20px,3.5vw,30px)] h-[6vw] md:h-[3.5vw] lg:h-[clamp(20px,3.5vw,30px)]" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="coverPic"
                className="absolute right-2 bottom-2 p-2 backdrop-blur-md bg-white/50 dark:bg-black/50 cursor-pointer rounded-lg"
              >
                <Camera className="w-[6vw] md:w-[3.5vw] lg:w-[clamp(20px,3.5vw,30px)] h-[6vw] md:h-[3.5vw] lg:h-[clamp(20px,3.5vw,30px)]" />
                <input
                  disabled={isPending}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      const url = URL.createObjectURL(file);
                      setCoverPreviewUrl(url);
                      setEditCover(true);
                    }
                  }}
                  id="coverPic"
                  className="hidden"
                />
              </label>
            ))}
        </div>
        <div className="absolute w-3/14 -bottom-2/9 left-1/10">
          <Image
            src={
              profilePreviewUrl
                ? profilePreviewUrl
                : user?.profilePic || "/default-avatar.png"
            }
            alt="Profile Picture"
            width={200}
            height={200}
            className="object-cover border-[1vw] md:border-[0.6vw] lg:border-[clamp(5px,1vw,7px)] border-white dark:border-neutral-900 bg-gray-300 w-full aspect-square relative rounded-full"
            onClick={() =>
              (user?.profilePic || profilePreviewUrl) && setImageView("profile")
            }
          />
          <span
            className={`absolute bottom-1/10 right-1/10 border w-[3vw] md:w-[1.8vw] lg:w-[clamp(17px,3vw,1px)] aspect-square bg-green-500 rounded-full`}
          ></span>
        </div>
      </div>
      <section className="px-4 pb-5 space-y-6">
        <div className="flex justify-between">
          <div>
            <h1 className="font-semibold flex items-center text-[6vw] md:text-[3.5vw] lg:text-[clamp(20px,3.5vw,30px)] text-black dark:text-white">
              {user?.name}
              {user?.role === "ADMIN" && (
                <span
                  onClick={() => {
                    toast("This User is An Admin", {
                      icon: (
                        <ShieldCheck className="text-blue-500 dark:text-green-400" />
                      ),
                      id: "admin",
                      duration: 2000,
                    });
                  }}
                  className="ml-1 text-blue-500 dark:text-green-400"
                >
                  <ShieldCheck className="w-[6vw] md:w-[3.5vw] lg:w-[clamp(20px,3.5vw,30px)] h-[6vw] md:h-[3.5vw] lg:h-[clamp(20px,3.5vw,30px)]" />
                </span>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-[4vw] md:text-[2.5vw] lg:text-[clamp(15px,2.5vw,18px)]">
              @{user?.username}
            </p>
          </div>
        </div>

        {user?.bio && (
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-xl">
            {user.bio}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Posts", value: user?.postsCount },
            { label: "Likes", value: user?.likesCount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-black/5 dark:border-white/10 p-4 flex flex-col items-center justify-center bg-black/5 dark:bg-white/3"
            >
              <span className="text-lg font-semibold">{item.value}</span>
              <span className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-100 dark:bg-neutral-950 md:-mx-2">
        <PostReel userId={user?.id} />
      </section>
      {imageView && (
        <ImageViewer
          images={
            (imageView === "cover" &&
              (coverPreviewUrl ? coverPreviewUrl : user?.coverPic)) ||
            (imageView === "profile" &&
              (profilePreviewUrl ? profilePreviewUrl : user?.profilePic)) ||
            []
          }
          onClose={() => setImageView(null)}
        />
      )}
    </main>
  );
};

export default Profile;
