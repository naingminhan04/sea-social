import { Metadata, ImageType,PostImageType, ReactionCountType, ReactionType, PostReactionUserType } from "./post"
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
  _count: {
    replies: number
  }
  user: UserType
  images: PostImageType[]
  likes: PostReactionUserType[]
  reply: CommentType | null
  stats: {
    reactions: ReactionCountType
    replies: number
  }
  isReacted: boolean
  reaction:
    | {
        id: string
        reactionType: ReactionType
      }
    | null
}

export interface AddCommentType {
  content: string
  replyId?: string | null
  images: ImageType[]
}