'use server'

import api from "@/libs/axios";
import { AddCommentType } from "@/types/comment";

export async function getCommentAction(postId : string,page :number) {
    const res = await api.get(`/comments/${postId}`, {
        params : {
            page
        }
    })
    return res.data
}

export async function addCommentAction(commentData : AddCommentType,postId : string) {
    const res = await api.post(`/comments/${postId}`,{
        content: commentData.content || "",
      replyId: commentData.replyId || null,
      images: commentData.images,
    })
    return res.data
}

export async function deleteCommentAction(commentId : string) {
    const res = await api.delete(`/comments/${commentId}`)
    return res.data
}

export async function getReplyAction(commentId : string) {
    const res = await api.get(`/comments/${commentId}`)
    return res.data
}