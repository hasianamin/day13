import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './pages/home/Home'
import ManageAdmin from './pages/admin/Admin'
import {Switch, Route} from 'react-router-dom'
import Login from './pages/login/Login'
import {connect} from 'react-redux'
import {LoginFunc} from './redux/actions'
import Axios from 'axios'
import { API_URL } from './helpers/idrformat';
import ReactLoading from 'react-loading';

function App(props, { type, color }) {
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    var id=localStorage.getItem('id')
    if(id){
      Axios.get(`${API_URL}/users/${id}`)
      .then((res)=>{
        props.LoginFunc(res.data)
      }).catch((err)=>console.log(err))
      .finally(()=>{
        setLoading(false)
      })
    }else{
      setLoading(false)
    }
  },[])
  if(loading){
    return(
      <div>
        <ReactLoading type={type} color={color} height={'20%'} width={'20%'} />
      </div>
    )
  }
  return (
    <div>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/ManageAdmin' component={ManageAdmin}/>
        <Route exact path='/Login' component={Login}/>
      </Switch>
    </div>
  );
}

export default connect(null,{LoginFunc})(App);
