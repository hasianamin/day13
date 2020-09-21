import React, { Component } from 'react';
import Header from '../../components/Header';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import { Paper } from '@material-ui/core';
import Loading from '../../components/Loading';
import Axios from 'axios';
import { API_URL } from '../../helpers/idrformat';
import ButtonUi from './../../components/Button'
import {Modal, ModalHeader, ModalBody} from 'reactstrap'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';


class History extends Component {
    state = { 
        transaction:null,
        isOpen:false,
        transactionDetail:[],
        product:null
     }

    componentDidMount(){
        Axios.get(`${API_URL}/transactions?userId=${localStorage.getItem('id')}&status=completed`)
        .then((res)=>{
            this.setState({transaction:res.data})
        }).catch((err)=>console.log(err))
        Axios.get(`${API_URL}/products`)
        .then((res1)=>{
            this.setState({product:res1.data})
            console.log(this.state.product)
        }).catch((err)=>console.log(err))
    }

    dateFormat=(n)=>{
        var today = new Date(n);
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
    
        today = yyyy + '-' + mm + '-' + dd;
        return today
    }

    seeDetails=(transactionId)=>{
        this.setState({isOpen:true})
        Axios.get(`${API_URL}/transactionsdetails?transactionId=${transactionId}`)
        .then((res)=>{
            this.setState({transactionDetail:res.data})
            this.renderDetail()
        }).catch((err)=>console.log(err))
    }

    renderDetail=()=>{
        return this.state.transactionDetail.map((val,index)=>{
            return (
                <TableRow>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{this.state.product[val.productId].namaTrip}</TableCell>
                    <TableCell>{this.dateFormat(val.tanggalPembayaran)}</TableCell>
                    <TableCell><ButtonUi onClick={()=>{this.seeDetails(val.id)}}>Details</ButtonUi></TableCell>
                </TableRow>
            )
        })
    }

    renderHistory=()=>{
        return this.state.transaction.map((val, index)=>{
            return(
                <TableRow>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{val.metode}</TableCell>
                    <TableCell>{this.dateFormat(val.tanggalPembayaran)}</TableCell>
                    <TableCell><ButtonUi onClick={()=>{this.seeDetails(val.id)}}>Details</ButtonUi></TableCell>
                </TableRow>
            )
        })
    }

    render() { 
        if(this.props.Auth.isLogin){
            if(this.state.transaction===null){
                return(
                    <div>
                        <Loading/>
                    </div>
                )
            } else{
                return ( 
                    <>
                        <Header/>
                        <Modal style={{top:'86px'}} isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen:false})}>
                            <ModalHeader toggle={()=>this.setState({isOpen:false})}>Detail Transaction</ModalHeader>
                            <ModalBody>
                                <Paper>
                                    <TableContainer>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableCell>No</TableCell>
                                                <TableCell>Nama Trip</TableCell>
                                                <TableCell>Gambar</TableCell>
                                                <TableCell>Qty</TableCell>
                                                <TableCell>Harga</TableCell>
                                                <TableCell>Subtotal</TableCell>
                                            </TableHead>
                                            <TableBody>
                                                {this.renderDetail()}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </ModalBody>
                        </Modal>
                        <div style={{marginTop:'94px'}} className='container'>
                            <Paper>
                                <TableContainer>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Metode Pembayaran</TableCell>
                                            <TableCell>Tanggal Pembayaran</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableHead>
                                        <TableBody>
                                            {this.renderHistory()}
                                        </TableBody>
                                        <TableFooter>
        
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </div>    
                    </>
                );
            }
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

export default connect(MapstatetoProps)(History);