import React, { Component, createRef } from 'react';
import './Login.css'
import {Alert} from 'reactstrap'
import TextField from '@material-ui/core/TextField';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {LoginThunk, ClearError, UpdateCartFunc} from './../../redux/actions'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import ButtonUi from './../../components/Button'
import FlightTakeOff from '@material-ui/icons/FlightTakeoff'
import Axios from 'axios';
import { API_URL } from '../../helpers/idrformat';
import Swal from 'sweetalert2'


class Login extends Component {
    state = { 
        username: createRef(),
        password: createRef(),
        visible: this.props.Auth.error,
        activeTab: '1',
        regUsername: createRef(),
        regPass: createRef(),
        regConfirmPass: createRef(),
        userData: [],
        alertReg: false,
        alertLogin: false,
        alertPass: false,
        alertUsername: false,
        alertPassStrength: false
    }

    toggle = (tab) => {
        if(this.state.activeTab !== tab)this.setState({activeTab:tab});
    }

    focusLogin=()=>{
        this.state.username.current.focus()
    }
    
    focusSignup=()=>{
        this.state.regUsername.current.focus()
    }

    componentDidMount = () => {
        this.focusLogin()
        Axios.get(`${API_URL}/users`)
        .then((res)=>{
            this.setState({userData:res.data})
        }).catch((err)=>console.log(err))
        if(this.props.Auth.isLogin){   
            this.props.UpdateCartFunc()
        }
    }

    componentDidUpdate=()=>{
        if(this.state.activeTab === '2') this.focusSignup()
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

    onKeyuphandlerRegister = (e) => {
        if(e.keyCode === 13){
            this.state.regPass.current.focus()
        }
    }

    onKeyuphandlerPassword = (e) => {
        if(e.keyCode === 13){
            this.state.regConfirmPass.current.focus()
        }
    }

    onKeyuphandlerConfirmPassword = (e) => {
        if(e.keyCode === 13){
            this.onRegisterClick()
        }
    }

    onDismiss = () => {
        this.props.ClearError()
        this.setState({alertLogin:false})
    }

    onDismissUser = () => {
        this.setState({alertUsername:false})
    }

    onDismissStrength = () => {
        this.setState({alertPassStrength:false})
    }

    onDismissLength = () => {
        this.setState({alertPassLength:false})
    }

    onDismissReg = (x)=>{
        if(x==='pass'){
            this.setState({alertPass:false})
        } else{
            this.setState({alertReg:false})
        }
    }
    
    onLoginClick=()=> {
        const {username, password} = this.state
        var uname = username.current.value
        var pass = password.current.value
        if(uname === '' || pass === ''){
            this.setState({alertLogin:true})
        } else{
            this.props.LoginThunk(uname,pass)
        }
    }

    onRegisterClick=()=>{
        this.onDismiss()
        this.onDismissUser()
        this.onDismissReg('pass')
        this.onDismissReg()
        this.onDismissStrength()
        const {regUsername, regPass, regConfirmPass} = this.state
        var regU = regUsername.current.value
        var regP = regPass.current.value
        var regConfP = regConfirmPass.current.value
        if(regU === '' || regP === '' || regConfP === ''){
            this.setState({alertReg:true})
        } else{
            var checkUser = this.state.userData.filter((val)=>{
                return val.username === regU
            })
            if(checkUser.length === 0){
                // var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})")
                var strongRegex = new RegExp("^(?=.*[a-z]||[A-Z])(?=.*[0-9])(?=.{6,})")
                // var strongRegex = new RegExp("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$")
                var checkPassword = regP.match(strongRegex)
                console.log(checkPassword)
                if(checkPassword){
                    if(regP === regConfP){
                        var obj = {
                            username: regU,
                            password: regP,
                            role: "user"
                        }
                        Axios.post(`${API_URL}/users`,obj)
                        .then(()=>{
                            this.setState({regStatus:true})
                            Swal.fire(
                            'Successfuly Sign Up!',
                            'Please login',
                            'success'
                            )
                            regUsername.current.value = ''
                            regPass.current.value = ''
                            regConfirmPass.current.value = ''
                            this.toggle('1')
                            this.focusLogin()
                        }).catch((err)=>console.log(err))
                    } else{
                        this.setState({alertPass:true})
                    }
                }else{
                    this.setState({alertPassStrength:true})
                }
            } else{
                this.setState({alertUsername:true})
            }
        }
    }
    
    render() { 
        if(this.props.Auth.isLogin){
            this.props.UpdateCartFunc()
            return <Redirect to='/'/>
        }
        return ( 
            <div className='row m-0 p-0'>
                <div className='col-md-8 homescreen' width='100%'/>
                <div className='col-md-4' style={{background:'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}>
                    <div className='bg-light rounded' style={{marginTop:'150px'}}>
                        <Nav tabs className='mt-5'>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggle('1'); }}
                                >
                                    {
                                        this.state.activeTab === '1'?
                                        <span style={{color:'black'}}>Login</span>
                                        :
                                        <span style={{color:'grey'}}>Login</span>
                                    }
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggle('2'); }}
                                >
                                    {
                                        this.state.activeTab === '2'?
                                        <span style={{color:'black'}}>Sign Up</span>
                                        :
                                        <span style={{color:'grey'}}>Sign Up</span>
                                    }
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col>
                                        <Card body>
                                            <CardTitle className='h3 mt-4'>Welcome to &nbsp;<FlightTakeOff className='logo-img'/>JoinTrip</CardTitle>
                                            <TextField
                                                inputRef={this.state.username} 
                                                label="Username" 
                                                fullWidth='true' 
                                                variant="outlined" 
                                                size='large'
                                                onKeyUp={this.onKeyuphandler}
                                                className='mt-3'
                                            />
                                            <TextField 
                                                inputRef={this.state.password} 
                                                type="password"  
                                                label="Password" 
                                                fullWidth='true' 
                                                variant="outlined" 
                                                size='large' 
                                                onKeyUp={this.onKeyuphandlerSubmit}
                                                className='mt-3'
                                            />
                                            <div className='mt-3'>
                                                <Alert color="danger" isOpen={this.props.Auth.error} toggle={this.onDismiss}>
                                                    Invalid username or password
                                                </Alert>
                                                <Alert color="danger" isOpen={this.state.alertLogin} toggle={this.onDismiss}>
                                                    Data cannot be empty
                                                </Alert>
                                            </div>
                                            <div className='my-2 align-self-end'>
                                                <ButtonUi onClick={this.onLoginClick} className='px-3 py-2 rounded text-white'>
                                                    Login
                                                </ButtonUi>
                                            </div>
                                        </Card>
                                        <p className='text-center mt-3' style={{color:'grey'}}>Belum memiliki akun? <br/> Segera daftarkan diri anda, klik <span style={{color:'blue'}} onClick={() => { this.toggle('2'); }}>di sini</span></p>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col>
                                        <Card body>
                                            <CardTitle className='h3 mt-4'>Ayo bergabung bersama kami di <br/><FlightTakeOff className='logo-img'/>JoinTrip</CardTitle>
                                            <TextField
                                                inputRef={this.state.regUsername} 
                                                label="Username" 
                                                fullWidth='true' 
                                                variant="outlined" 
                                                size='large'
                                                onKeyUp={this.onKeyuphandlerRegister}
                                                className='mt-3'
                                            />
                                            <TextField 
                                                inputRef={this.state.regPass} 
                                                type="password"  
                                                label="Password" 
                                                fullWidth='true' 
                                                variant="outlined" 
                                                size='large' 
                                                onKeyUp={this.onKeyuphandlerPassword}
                                                className='mt-3'
                                            />
                                            <TextField 
                                                inputRef={this.state.regConfirmPass} 
                                                type="password"  
                                                label="Confirm Password" 
                                                fullWidth='true' 
                                                variant="outlined" 
                                                size='large' 
                                                onKeyUp={this.onKeyuphandlerConfirmPassword}
                                                className='mt-3'
                                            />
                                            <div className='mt-3'>
                                                <Alert color="danger" isOpen={this.state.alertReg} toggle={this.onDismissReg}>
                                                    Please fill all the field
                                                </Alert>
                                                <Alert color="danger" isOpen={this.state.alertPass} toggle={()=>this.onDismissReg('pass')}>
                                                    Password confirmation did not match
                                                </Alert>
                                                <Alert color="danger" isOpen={this.state.alertUsername} toggle={this.onDismissUser}>
                                                    Username has been used by someone
                                                </Alert>
                                                <Alert color="danger" isOpen={this.state.alertPassStrength} toggle={this.onDismissStrength}>
                                                    Password length minimum should be 6 character and contain letter and number
                                                </Alert>
                                            </div>
                                            <div className='my-2 align-self-end'>
                                                <ButtonUi onClick={this.onRegisterClick} className='px-3 py-2 rounded text-white'>
                                                    Sign Up
                                                </ButtonUi>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
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

export default connect(Mapstatetoprops,{LoginThunk, ClearError, UpdateCartFunc})(Login);