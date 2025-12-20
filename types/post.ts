interface Metadata {
    page: number;
    nextPage: number | null;
    totalPages: number;
    size: number;
    totalElements: number;
}

export interface PostType {
    id: string;
    content: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    author: Author
    images: PostImageType[]
    stats: PostStats

}


interface Author {
    id: string;
    username: string;
    name: string;
    email: string;
    nickname: string;
    profilePic: string | null;
}

 interface PostImageType {
    id: string;
    path: string;
    imageId: string;
    fullPath: string;
    url: string;
 }


 interface PostStats {
    reactions: {
        total: number;
        like: number;
        angry: number;
        love: number;
        haha: number;
        wow: number;
        sad: number;
    };
    comments: number;
    sharedCount: number;
    isReacted: boolean;
    reaction: {
        id: string;
        reactionType: ReactionType 
    } | null
 }


 enum ReactionType {
    like = "LIKE",
    love = "LOVE",
    wow = "WOW",
    haha = "HAHA",
    angry = "ANGRY",
    sad = "SAD",
 }


 export interface PostsResponseType {
    metadata: Metadata,
    posts: PostType[]
 }

export interface ImageKitResponse {
  "url": string;
  "thumbnailUrl": string;
  "fileId": string;
  "name": string;
  "size": number;
  "type": string;
  "height": number;
  "width": number;
  "path": string;
}

export interface ImageType {
    id: string;
    path: string;
    fullPath: string;
}
export interface AddPostType {
    content: string | null;
    sharedPostId?: string | null;
    images: ImageType[];
}
 



 