import {combineReducers} from 'redux'
import AuthReducers from './AuthReducers'
import CountCartReducers from './CountCartReducers'

export default combineReducers({
    Auth: AuthReducers,
    CountCart: CountCartReducers
})