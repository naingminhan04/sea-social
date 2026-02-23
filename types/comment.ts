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
  images: ImageType[]
}