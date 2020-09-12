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