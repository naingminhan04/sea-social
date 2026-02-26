import { Metadata, ImageType, PostImageType } from "./post"
import { UserType } from "./user"

export interface CommentResponseType {
  metadata: Metadata
  comments: CommentType[]
}

export interface CommentType {
  id: string
  userId: string
  postId: string
  replyId: string | null
  createdAt: string
  updatedAt: string
  content: string
  isEdited: boolean
  isDeleted: boolean
  user: Pick<UserType, 'id' | 'name' | 'username' | 'profilePic'>
  images: PostImageType[]
  stats: {
    reactions: number
    replies: number
  }
  isReacted: boolean
}

export interface AddCommentType {
  content: string
  replyId?: string | null
  images: Array<{
    key: string
    fileName: string
    mimeType: string
    fileSize: number
  }>
}

export type CommentFormMode = "create" | "reply" | "edit";

export interface CommentCardProps {
  comment: CommentType;
  postId: string;
  isDel: string[];
  isOwner: boolean;
  onDelete: (id: string) => void;
  onReply: () => void;
  onEdit: () => void;
  onViewImage?: (url: string) => void;
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
  /** If true, autofocus the textarea when the form mounts. */
  autoFocus?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  onViewImage?: (url: string) => void;
}

