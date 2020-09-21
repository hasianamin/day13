import Axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from './../../components/Header'
import { API_URL } from '../../helpers/idrformat';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ButtonUi from './../../components/Button'
import Swal from 'sweetalert2'


class ConfirmPayment extends Component {
    state = {  
        transaction:[]
    }

    componentDidMount(){
        Axios.get(`${API_URL}/transactions?status=waitingAdminConfirm`)
        .then((res)=>{
            this.setState({transaction:res.data})
            console.log(res.data)
        }).catch((err)=>console.log(err))
    }

    onConfirm=(id)=>{
        Axios.patch(`${API_URL}/transactions/${id}`,{
            status:"completed"
        })
        .then(()=>{
            Swal.fire(
                'Sukses!',
                'Pembayaran telah di konfirmasi',
                'success'
            )
            this.componentDidMount()
        }).catch((err)=>console.log(err))
    }

    renderBody=()=>{
        return this.state.transaction.map((val,index)=>{
            return (
                <TableRow>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{val.buktiPembayaran}</TableCell>
                    <TableCell>{val.buktiPembayaran}</TableCell>
                    <TableCell><ButtonUi onClick={()=>this.onConfirm(val.id)}>Accept</ButtonUi></TableCell>
                </TableRow>
            )
        })
    }

    render() { 
        if(this.props.Auth.role==='admin'){
            return ( 
                <div>
                    <Header/>
                    <div style={{marginTop:'94px'}} className='container'>
                        <Paper>
                            <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Bukti Pembayaran</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderBody()}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                </div>
             );
        } else{
            return (
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
 
export default connect(MapstatetoProps)(ConfirmPayment);