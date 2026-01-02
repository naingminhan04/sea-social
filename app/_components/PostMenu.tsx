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

  // ✅ useMutation for delete
  const deleteMutation = useMutation({
    mutationFn: () => deletePostAction(post.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post Deleted Successfully");
      setDel(false);
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const handleDeleteClick = () => {
    setOpen(false);
    setDel(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteMutation.isPending) deleteMutation.mutate();
  };

  const isDeleting = deleteMutation.isPending;

  return (
    <>
      {user === post.author.id && (
        <>
          {/* Menu trigger */}
          <button
            disabled={isDeleting}
            onClick={() => !isDeleting && setOpen(!open)}
            className="ml-auto cursor-pointer text-2xl disabled:opacity-50"
          >
            <Ellipsis />
          </button>

          {/* Action menu */}
          {open && (
            <>
              <div
                className="fixed inset-0 z-60 bg-black/40"
                onClick={() => !isDeleting && setOpen(false)}
              />
              <div className="absolute z-60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-800 text-white rounded-xl w-64 shadow-lg">
                <div className="flex flex-col w-full">
                  <button
                    disabled={isDeleting}
                    onClick={() => {
                      setOpen(false);
                      setEdit(true);
                    }}
                    className="py-3 hover:bg-black disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    disabled={isDeleting}
                    onClick={handleDeleteClick}
                    className="py-3 bg-red-700 hover:bg-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Delete confirm */}
          {del && (
            <>
              <div
                className="fixed inset-0 z-60 bg-black/40"
                onClick={() => !isDeleting && setDel(false)}
              />
              <div className="absolute z-60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-800 text-white rounded-xl w-64 shadow-lg">
                <div className="flex flex-col w-full">
                  <button
                    disabled={isDeleting}
                    onClick={handleConfirmDelete}
                    className="py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete Permanently"}
                  </button>

                  <button
                    disabled={isDeleting}
                    onClick={() => setDel(false)}
                    className="py-3 hover:bg-black disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Edit modal */}
          {edit && (
            <EditPostForm
              post={post}
              onClose={() => setEdit(false)}
            />
          )}

          {/* HARD UI LOCK while deleting */}
          {isDeleting && (
            <div className="fixed inset-0 z-9999 bg-black/60 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                Deleting post…
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PostMenu;
