import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './pages/home/Home'
import ManageAdmin from './pages/admin/Admin'
import {Switch, Route} from 'react-router-dom'
import Login from './pages/login/Login'
import {connect} from 'react-redux'
import {LoginFunc, UpdateCartFunc} from './redux/actions'
import Axios from 'axios'
import { API_URL } from './helpers/idrformat';
import NotFound from './pages/404Pages'
import ListProd from './pages/listprod'
import DetailProd from './pages/detailprod'
import Cart from './pages/carts'
import Loading from './components/Loading'

function App(props) {
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    var id=JSON.parse(localStorage.getItem('id'))
    if(id){
      Axios.get(`${API_URL}/users/${id}`)
      .then((res)=>{
        props.LoginFunc(res.data)
        props.UpdateCartFunc()
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
        <Loading/>
      </div>
    )
  }

  const renderProtectedroutesadmin = () => {
    if(props.Auth.role==='admin')
    {
      return(
        <>
          <Route exact path='/ManageAdmin' component={ManageAdmin}/>
        </>
      )
    } else{
      return(
        <>
          <NotFound/>
        </>
      )
    }
  }

  return (
    <div>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/Login' component={Login}/>
        <Route exact path='/Products' component={ListProd}/>
        <Route exact path='/Cart' component={Cart} />
        <Route path='/Products/:id' component={DetailProd}/>
        {renderProtectedroutesadmin()}
        <Route path='*' component={NotFound}/>
      </Switch>
    </div>
  );
}

const Mapstatetoprops=(state)=>{
  return{
      Auth:state.Auth
  }
}

export default connect(Mapstatetoprops,{LoginFunc, UpdateCartFunc})(App);
