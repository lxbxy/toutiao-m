// 请求模块

import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'



// JSONBig 可以处理数据中超出 Javascript 安全整数范围的问题
// JSONBig.parse() 把json格式的字符串转为 JavaScript对象
// JSONBig.stringify() 把JavaScript对象 转为 json格式的字符串

const request = axios.create({
    // baseURL:'http://ttapi.research.itcast.cn/'//接口的基准路径
    baseURL: 'http://toutiao-app.itheima.net',
   
   
   //自定义后端返回的原始数据
    transformResponse:[function(data){
      try{
        return JSONBig.parse(data)
      }catch(err){
        return data
      }
    }]
})

//请求拦截器
request.interceptors.request.use(function (config) {
    // Do something before request is sent
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    if (config.url.startsWith('/app')) {
      config.url = config.url.slice(4)
    }

    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })
  

//相应拦截器


export default request