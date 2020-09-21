import React, { Component, createRef } from 'react';
import Header from '../../components/Header';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import { Paper } from '@material-ui/core';
import Axios from 'axios';
import { connect } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import {Modal, ModalHeader, ModalBody} from 'reactstrap'
import ButtonUi from './../../components/Button'
import Swal from 'sweetalert2'
import { API_URL } from '../../helpers/idrformat';
import { Redirect } from 'react-router-dom';


class Profile extends Component {
    state = { 
        isOpen:false,
        refPassOld: createRef(),
        refPassNew: createRef()
     }

    editPassword=()=>{
        this.setState({isOpen:true})
    }

    confirmEdit=()=>{
        const { refPassNew, refPassOld }=this.state
        var passNew = refPassNew.current.value
        var passOld = refPassOld.current.value
        if(this.props.Auth.password === passOld){
            Axios.patch(`${API_URL}/users/${this.props.Auth.id}`,{
                password:passNew
            }).then(()=>{
                Swal.fire(
                    'Sukses!',
                    'Password berhasil diganti',
                    'success'
                )
                this.setState({isOpen:false})

            }).catch((err)=>console.log(err))
        } else{
            Swal.fire(
                'Error!',
                'Password lama tidak sesuai',
                'error'
            )
        }
    }

    render() { 
        if(this.props.Auth.isLogin){
            return (
                <div>
                    <Header/>
                    <Modal style={{top:'86px'}} isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen:false})}>
                        <ModalHeader toggle={()=>this.setState({isOpen:false})}>Detail Transaction</ModalHeader>
                        <ModalBody>
                            <input ref={this.state.refPassOld} className='form-control mt-3' placeholder='Masukkan Password Lama'/>
                            <input ref={this.state.refPassNew} className='form-control mt-3' placeholder='Masukkan Password Baru'/>
                            <ButtonUi className='mt-3' onClick={()=>this.confirmEdit()}>Edit</ButtonUi>
                        </ModalBody>
                    </Modal>
                    <div style={{marginTop:'94px'}} className='container'>
                        <Paper>
                            <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Username</TableCell>
                                            <TableCell>{this.props.Auth.username}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Password</TableCell>
                                            <TableCell>
                                                {this.props.Auth.password} &nbsp;&nbsp;&nbsp;
                                                <span className='btn btn-outline-primary' onClick={()=>this.editPassword()}><EditIcon/></span>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                    <TableFooter>
    
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                </div>
    
             );
        }else{
            return(
                <div>
                    <Redirect to='/'/>
                </div>
            )
        }
    }
}

const MapstatetoProps=(state)=>{
    return{
        Auth:state.Auth
    }
}

export default connect(MapstatetoProps)(Profile);