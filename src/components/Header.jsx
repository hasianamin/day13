import React, {useEffect, useState} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FlightTakeOff from '@material-ui/icons/FlightTakeoff'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {LogoutFunc, ResetCartFunc} from './../redux/actions'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Swal from 'sweetalert2'
import './Header.css'
import Badge from '@material-ui/core/Badge';
import {FaCartArrowDown} from 'react-icons/fa'


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

const StyledBadge = withStyles(() => ({
  badge: {
    right: -3,
    top: 5,
    color:'white',
    fontSize:11,
    background: 'red'
  },
}))(Badge);

const ButtonAppBar = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState(false)
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const [onLogout, setOnLogout] = useState(false)
 
  const classes = useStyles();
  const logout = () => {
    setOnLogout(true)
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
            role:'',
            id:0,
            isLogin: false
          }
        )
        props.ResetCartFunc()
        Swal.fire(
          'Goodbye!',
          'You just logout',
          'success'
        )
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
      <AppBar className={classes.warna}>
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
            <Button color="inherit" className='edit-focus'>Home</Button>
          </Link>
          {
            role?
            null
            :
            props.Auth.isLogin?
            <Link to='/Cart' style={{textDecoration:'none',color:'white'}}>
              <Button color="inherit">
                <StyledBadge badgeContent={props.Cart.jmlCart} color='secondary' >
                  <span style={{fontSize:20}}>
                    <FaCartArrowDown />
                  </span>
                </StyledBadge>
              </Button>
            </Link>
            :
            null
          }
          {
            props.Auth.isLogin?
            <Dropdown isOpen={dropdownOpen} toggle={toggle} size="sm">
              <DropdownToggle color='link'>
                <Button className='d-flex align-items-center justify-content-center edit-focus' style={{color:'white', textDecoration:'none !important'}}>
                  <AccountCircleIcon/>
                  <div className='mx-1' style={{textTransform:'uppercase'}}>{props.Auth.username}</div>
                </Button>
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
      Auth:state.Auth,
      Cart:state.CountCart
  }
}

export default connect(Mapstatetoprops,{LogoutFunc,ResetCartFunc})(ButtonAppBar)