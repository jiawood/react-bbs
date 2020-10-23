import axios from 'axios';
import moment from 'moment';
moment.locale('zh-cn')

export function request(config){
  const instance = axios.create({
    baseURL: '',
    withCredentials: true
  })
  return instance(config)
}

export function parseTime(time){
  const now = moment(new Date().toISOString())
  const lastTime = moment(time)
  const diff = now.diff(lastTime)
  const diffDuration = moment.duration(diff)
  let timeArray = [
    diffDuration.days(),
    diffDuration.hours(),
    diffDuration.minutes()
  ]
  if (timeArray[0] > 0) {
    return `${timeArray[0]}天前`
  } else if (timeArray[1] > 0) {
    return `${timeArray[1]}小时${timeArray[2]}分钟前`
  } else if (timeArray[2] > 0) {
    return `${timeArray[2]}分钟前`
  } else {
    return `刚刚`
  }
}
