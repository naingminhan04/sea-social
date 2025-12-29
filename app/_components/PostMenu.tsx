"use client";

import { useState } from "react";
import { Ellipsis } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { PostType } from "@/types/post";
import { deletePostAction } from "../_actions/postAction";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const PostMenu = ({ post }: { post: PostType }) => {
  const queryClient = useQueryClient();
  const auth = useAuthStore();
  const user = auth.user?.id;
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);

  const handleDelete = () => {
    setOpen(false);
    setDel(true);
  };

  const handleConfirmDelete = () => {
    deletePostAction(post.id).then(() =>
      toast.success("Post Deleted Successfully")
    );

    queryClient.invalidateQueries({ queryKey: ["posts"] });
    setDel(false);
  };

  return (
    <>
      {user === post.author.id && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="ml-auto cursor-pointer text-2xl"
          >
            <Ellipsis />
          </button>

          {open && (
            <>
              <div
                className="fixed inset-0 z-60 bg-black/40"
                onClick={() => setOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 z-60 bg-neutral-800 text-white">
                <div className="flex flex-col justify-around items-center w-full h-30">
                  <button
                    onClick={() => setEdit(true)}
                    className="w-full h-full cursor-pointer hover:bg-black"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full h-full cursor-pointer hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
          {del && (
            <>
              <div
                className="fixed inset-0 z-60 bg-black/40"
                onClick={() => setDel(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 z-60 bg-neutral-800 text-white">
                <div className="flex flex-col justify-around items-center w-full h-30">
                  <button
                    onClick={handleConfirmDelete}
                    className="w-full h-full cursor-pointer hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDel(false)}
                    className="w-full h-full cursor-pointer hover:bg-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default PostMenu;
