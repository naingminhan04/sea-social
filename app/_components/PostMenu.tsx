"use client";

import { useState } from "react";
import { Ellipsis } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { PostType } from "@/types/post";
import { deletePostAction } from "../_actions/postAction";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import EditPostForm from "./EditPostForm";
import toast from "react-hot-toast";

const PostMenu = ({ post }: { post: PostType }) => {
  const queryClient = useQueryClient();
  const auth = useAuthStore();
  const user = auth.user?.id;

  const [open, setOpen] = useState(false);
  const [del, setDel] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isDel, setIsDel] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deletePostAction(post.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post Deleted Successfully");
    },
    onError: () => {toast.error("Failed to delete post"); setIsDel(false);},
  });

  const handleDel = () => {
    setIsDel(true);
    deleteMutation.mutate();
    setDel(false);
  };

  const isDeleting = deleteMutation.isPending;

  return (
    <>
      {isDel ? (
        <div className="absolute gap-2 z-20 bg-black/40 flex justify-center items-center right-0 top-0 w-full h-full">
          <span className="w-10 h-10 rounded-full border-4 border-white/40 border-t-transparent animate-spin" />Deleting Post
        </div>
      ) : (
        user === post.author.id && (
          <div className="relative ml-auto">
            <button
              disabled={isDeleting}
              onClick={() => setOpen((p) => !p)}
              className="text-2xl disabled:opacity-50"
            >
              <Ellipsis />
            </button>

            {open && (
              <><div
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 z-50 w-48 rounded-xl bg-black shadow-lg"
              >
                <button
                  disabled={isDeleting}
                  onClick={() => {
                    setOpen(false);
                    setEdit(true);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-800 rounded-t-xl"
                >
                  Edit
                </button>

                <button
                  disabled={isDeleting}
                  onClick={() => {
                    setOpen(false);
                    setDel(true);
                  }}
                  className="w-full px-4 py-3 text-left text-red-500 hover:bg-neutral-800 rounded-b-xl"
                >
                  Delete
                </button>
              </div></>
            )}

            {del && (
              <><div
                className="fixed inset-0 z-40"
                onClick={() => setDel(false)}
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 z-50 w-48 rounded-xl bg-black shadow-lg"
              >
                <button
                  disabled={isDeleting}
                  onClick={handleDel}
                  className="w-full px-4 py-3 text-left text-red-500 hover:bg-neutral-800 rounded-t-xl"
                >
                  Delete Permanently
                </button>

                <button
                  disabled={isDeleting}
                  onClick={() => setDel(false)}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-800 rounded-b-xl"
                >
                  Cancel
                </button>
              </div></>
            )}

            {edit && (
              <EditPostForm post={post} onClose={() => setEdit(false)} />
            )}
          </div>
        )
      )}
    </>
  );
};

export default PostMenu;
