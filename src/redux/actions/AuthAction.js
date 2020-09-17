import Axios from 'axios'
import { API_URL } from '../../helpers/idrformat'

export const LoginFunc=(obj)=>{
    return{
        type:'LOGIN',
        payload:obj
    }
}

export const LogoutFunc=(obj)=>{
    return{
        type:'LOGOUT',
        payload:obj
    }
}

export const LoginThunk=(username, password)=>{
    return(dispatch)=>{
        dispatch({type:'LOADING'})
        Axios.get(`${API_URL}/users`,{
            params:{
                username:username,
                password:password
            }
        }).then((res)=>{
            if(res.data.length){
                localStorage.setItem('id',res.data[0].id)
                dispatch({type:'LOGIN',payload:res.data[0]})
            }else{
                dispatch({type:'ERROR'})
            }
        }).catch(()=>{
            dispatch({type:'ERROR'})
        })
    }
}

export const ClearError=()=>{
    return{
        type:'CLEAR'
    }
}
