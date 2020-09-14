import React, { Component, createRef } from 'react';
import './Login.css'
import {Alert} from 'reactstrap'
import Foto from './../../assets/homescreen.webp'
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import { API_URL } from '../../helpers/idrformat';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {LoginFunc} from './../../redux/actions'

const Styles = {
    root:{
        '& label.Mui-focused': {
            color: 'white',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'white',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
              border:'3px solid '
            },
          },
          width:'100%'
    }
}

class Login extends Component {
    state = { 
        username: createRef(),
        password: createRef(),
        visible: false,
    }

    componentDidMount = () => {
        this.state.username.current.focus()
    }

    onKeyuphandler = (e) => {
        if(e.keyCode === 13){
            this.state.password.current.focus()
        }
    }

    onKeyuphandlerSubmit = (e) => {
        if(e.keyCode === 13){
            this.onLoginClick()
        }
    }

    onDismiss = () => this.setState({visible: false})

    onLoginClick=()=> {
        const {username, password} = this.state
        var uname = username.current.value
        var pass = password.current.value
        axios.get(`${API_URL}/users?username=${uname}&password=${pass}`)
        .then((res)=>{
            console.log(res.data)
            if(res.data.length){
                localStorage.setItem('id',res.data[0].id)
                this.props.LoginFunc(res.data[0])
            }else{
                this.setState({visible:true})
            }

        }).catch((err)=> console.log(err))
    }
    
    render() { 
        const { classes } = this.props
        console.log(this.props.Auth)
        if(this.props.Auth.isLogin){
            return <Redirect to='/'/>
        }
        return ( 
            <div className='row m-0 p-0'>
                <div className='col-md-8 p-0 m-0' width='100%'>
                    <img style={{width: '100%', objectFit: 'cover'}} src={Foto} alt={Foto}/>
                </div>
                <div className='col-md-4 p-0 m-0 d-flex justify-content-center align-items-center' style={{background:'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}>
                    <div className='login-kotak d-flex px-4'>
                        <h1 className='align-self-center'>Login</h1>
                        <div className='mt-4'>
                            <TextField inputRef={this.state.username}  onKeyUp={this.onKeyuphandler}  className={classes.root} label="Username" />
                        </div>
                        <div className='mt-4'>
                            <TextField inputRef={this.state.password} onKeyUp={this.onKeyuphandlerSubmit} className={classes.root} label="Password" type='password' />
                        </div>
                        <div className='mt-4'>
                            <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                                Invalid username or password
                            </Alert>
                        </div>
                        <div className='mt-3 align-self-end'>
                            <button onClick={this.onLoginClick} className='px-3 py-2 rounded text-white' style={{border:'1px solid white', backgroundColor:'transparent'}}>
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
const Mapstatetoprops=(state)=>{
    return{
        Auth:state.Auth
    }
}

export default withStyles(Styles)(connect(Mapstatetoprops,{LoginFunc})(Login));