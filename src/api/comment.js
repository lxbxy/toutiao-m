// 评论请求模块

import request from "@/utils/request"


// 获取文章评论列表
export function getComments(params) {
    return request({
      method: "GET",
      url: "/app/v1_0/comments",
      params
    });
  }

  // 评论点赞
  export const addCommentLike = target => {
    return request ({
      method:'POST',
      url:'/app/v1_0/comment/likings',
      data :{
        target
      }
    })
  }

  // 取消评论点赞
  export const deleteCommentLike = target => {
    return request ({
      method:'DELETE',
      url:`/app/v1_0/comment/likings/${target}`
    })
  }

  // 发布评论
  export function addComment (data) {
    return request({
      method: 'POST',
      url: '/app/v1_0/comments',
      data
    })
  }