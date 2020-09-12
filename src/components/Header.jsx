import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FlightTakeOff from '@material-ui/icons/FlightTakeoff'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {LogoutFunc} from './../redux/actions'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Swal from 'sweetalert2'
import {Redirect} from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  warna:{
      backgroundColor:'red',
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
  }
}));

function ButtonAppBar(props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState(false)
  const toggle = () => setDropdownOpen(prevState => !prevState);
  
  const classes = useStyles();
  const logout = () => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear()
        props.LogoutFunc(
          {
            username:'',
            password:'',
            id:0,
            isLogin: false
          }
        )
        Swal.fire(
          'Goodbye!',
          'You just logout',
          'success'
          )
        return <Redirect to='/'/>
      }
    })
  }

  useEffect(()=>{
    if(props.Auth.role === 'admin'){
      setRole(true)
    }
  },[])
  
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.warna}>
        <Toolbar>
          <a href='http://localhost:3000/'>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <FlightTakeOff style={{color:'white'}}/>
              </IconButton>
          </a>
          <Typography variant="h6" className={classes.title}>
            JoinTrip
          </Typography>
          <Link to='/' style={{textDecoration:'none',color:'white'}}>
            <Button color="inherit">Home</Button>
          </Link>
          {
            props.Auth.isLogin?
            <Dropdown isOpen={dropdownOpen} toggle={toggle} size="sm">
              <DropdownToggle caret className='d-flex align-items-center justify-content-center' color='link' style={{color:'white', textDecoration:'none'}}>
                <AccountCircleIcon/>
                <div className='mx-1' style={{textTransform:'uppercase'}}>{props.Auth.username}</div>
              </DropdownToggle>
              <DropdownMenu right>
                {
                  role?
                  <DropdownItem>
                    <Link to='/ManageAdmin' style={{textDecoration:'none'}}>
                      Manage Dashboard
                    </Link>
                  </DropdownItem>
                  :
                  <DropdownItem>Profile</DropdownItem>
                }
                <DropdownItem onClick={logout}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            :
            <Link to='/Login' style={{textDecoration:'none'}}>
              <Button color="inherit" style={{color:'white'}}>Login</Button>
            </Link>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

const Mapstatetoprops=(state)=>{
  return{
      Auth:state.Auth
  }
}

export default connect(Mapstatetoprops,{LogoutFunc})(ButtonAppBar)