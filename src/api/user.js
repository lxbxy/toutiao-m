//用户请求模块
import request from '@/utils/request'

export const login = data => {
    return request ({
        method:'POST',
        url:'/app/v1_0/authorizations',
        data
    })
}


export const sendSms = mobile => {
    return request ({
        method:'GET',
        url:`/app/v1_0/sms/codes/${mobile}`,
    })
}

//获取用户信息
export const getUserInfo = () => {
    return request ({
        method:'GET',
        url:'/app/v1_0/user',
        // headers: {
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}

//获取频道列表
export const getUserChannels = () => {
    return request({
      method: 'GET',
      url: '/app/v1_0/user/channels'
    })
  }

  //关注用户
  export const addFollow = target => {
    return request({
      method: 'POST',
      url: '/app/v1_0/user/followings',
      data: {//post请求方式，要传递的数据，放入data对象中
        target  //target关注目标（被关注的用户id）
      }
    })
  }
  
  /**
   * 取消关注用户
   */
  export const deleteFollow = target => { 
    return request({
      method: 'DELETE', 
      url: `/app/v1_0/user/followings/${target}`//target目标用户（被取消关注的用户id）
    })
  }
  
//获取用户信息
  export const getUserProfile = () => { 
    return request({
      method: 'GET', 
      url: '/app/v1_0/user/profile'//target目标用户（被取消关注的用户id）
    })
  }

//编辑用户信息
  
  export const updateUserProfile = (data) => { 
    return request({
      method: 'PATCH', 
      url: '/app/v1_0/user/profile',//target目标用户（被取消关注的用户id）
      data

    })
  }

//更新用户照片资料
export const updateUserPhoto = (data) => { 
    return request({
      method: 'PATCH', 
      url: '/app/v1_0/user/photo',//target目标用户（被取消关注的用户id）
      data
    })
  }
