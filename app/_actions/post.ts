'use server'

import api from "@/libs/axios";
import { PostsResponseType } from "@/types/post";

export async function getPostAction( nextPage: number = 1, limit:number = 10){
    const res = await api.get<PostsResponseType>("/posts", {
        params:{
            page: nextPage,
            size: limit,
        }
    });
    return res.data;
}