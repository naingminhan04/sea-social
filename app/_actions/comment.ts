'use server'

import api from "@/libs/axios";

export async function getCommentAction(postId : string,page :number) {
    const res = await api.get(`/comments/${postId}`, {
        params : {
            page
        }
    })
    return res.data
}