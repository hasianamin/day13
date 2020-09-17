const INITIAL_STATE = {
    username:'',
    password:'',
    id:0,
    role:'',
    isLogin: false,
    error:false,
    isLoading:false
}

export default (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case 'LOGIN':
            return {...state, ...action.payload, isLogin:true, isLoading:false}
        case 'ERROR':
            return {...state,error:true,isLoading:false}
        case 'CLEAR':
            return {...state,error:false,isLoading:false}
        case 'LOADING':
            return {...state,isLoading:true}    
        case 'LOGOUT':
            return {...state, ...action.payload}
        default:
            return state
    }
}