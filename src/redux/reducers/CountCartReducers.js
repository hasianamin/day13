const INITIAL_STATE = {
    jmlCart:0
}

export default (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case 'UPDATE':
            return {...state, jmlCart:action.payload}
        case 'RESET':
            return {...state, jmlCart:action.payload}
        default:
            return state
    }
}