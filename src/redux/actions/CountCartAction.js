
import Axios from 'axios'
import {API_URL} from './../../helpers/idrformat'

export const UpdateCartFunc=()=>{
    return(dispatch)=>{
        Axios.get(`${API_URL}/carts?userId=${localStorage.getItem('id')}`)
        .then((res)=>{
          dispatch({type:'UPDATE', payload:res.data.length})
        }).catch((err)=>console.log(err))
    }   
}

export const ResetCartFunc=()=>{
  return{
    type: 'RESET',
    payload: 0
  }
}