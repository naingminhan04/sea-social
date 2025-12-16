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
    images: ImageType[]
    stats: PostStats

}


interface Author {
    id: string;
    username: string;
    name: string;
    email: string;
    nickname: string;
    profilePic: string;
}

 interface ImageType {
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


 



 