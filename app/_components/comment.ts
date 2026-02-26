import type { CommentType } from "@/types/comment";

export type CommentFormMode = "create" | "reply" | "edit";

export interface CommentCardProps {
  comment: CommentType;
  postId: string;
  isDel: string[];
  isOwner: boolean;
  onDelete: (id: string) => void;
  onReply: () => void;
  onEdit: () => void;
}

export interface RepliesProps {
  commentId: string;
  postId: string;
  userId?: string;
  onReply: (comment: CommentType) => void;
  onEdit: (comment: CommentType) => void;
}

export interface CommentFormProps {
  postId: string;
  mode?: CommentFormMode;
  /** The comment this action is targeting (replying to or editing). */
  targetComment?: CommentType;
  /** For edit: the existing comment being edited. */
  commentToEdit?: CommentType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

