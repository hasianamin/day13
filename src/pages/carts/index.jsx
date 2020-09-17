import Axios from 'axios';
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { API_URL, priceFormatter } from '../../helpers/idrformat';
import Header from './../../components/Header'
import NotFound from './../404Pages'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import ButtonUi from './../../components/Button'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import {ResetCartFunc} from './../../redux/actions'

class Cart extends Component {
    state = { 
        cart:[],
        isOpen:false,
        pilihan:0,
        bukti: createRef(),
        cc: createRef()
    }

    componentDidMount(){
        Axios.get(`${API_URL}/carts`,{
            params:{
                userId:this.props.id,
                _expand:'product'
            }
        })
        .then((res)=>{
            this.setState({cart:res.data})
        }).catch((err)=>console.log(err))
    }

    renderCart = () => {
        return this.state.cart.map((val, index) => {
          return(
            <TableRow key={val.id}>
              <TableCell>{index+1}</TableCell>
              <TableCell>{val.product.namaTrip}</TableCell>
              <TableCell>
                <div style={{width:'200px'}}>
                  <img alt='tes' width='100%' src={val.product.gambar}/>
                </div>
              </TableCell>
              <TableCell>
                <span style={{fontSize:12, cursor:'pointer'}} className='btn btn-outline-primary mr-3'>+</span>
                  {val.qty}
                <span style={{fontSize:12, cursor:'pointer'}} className='btn btn-outline-primary ml-3'>-</span>
              </TableCell>
              <TableCell>{priceFormatter(val.product.harga)}</TableCell>
              <TableCell>{priceFormatter(val.product.harga*val.qty)}</TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          )
        })
    }

    renderTotalHarga=()=>{
        var total = this.state.cart.reduce((total,num)=>{
            return total+(num.product.harga*num.qty)
        },0)
        return total
    }

    onCheckOutClick=()=>{
        this.setState({isOpen:true})
    }

    onBayarClick=()=>{
        const {pilihan}=this.state
        if(pilihan ==='1'){
            this.onBayarPakeBukti()
            this.props.ResetCartFunc()
        }else if(pilihan === '2'){
            this.onBayarPakeCC()
            this.props.ResetCartFunc()
        }else{
            alert('pilih jenis pembayaran dulu')
        }
    }

    onBayarPakeCC=()=>{
        Axios.post(`${API_URL}/transactions`,{
            status:'completed',
            userId: this.props.id,
            tanggalPembayaran: new Date().getTime(),
            metode: 'cc',
            buktiPembayaran:this.state.cc.current.value
        }).then((res)=>{
            var arr=[]
            this.state.cart.forEach((val)=>{
                arr.push(Axios.post(`${API_URL}/transactionsdetails`,{
                    transactionId:res.data.id,
                    productId:val.productId,
                    price:parseInt(val.product.harga),
                    qty: val.qty
                }))
            })
            Axios.all(arr).then(()=>{
                var deleteArr=[]
                this.state.cart.forEach((val)=>{
                    deleteArr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
                })
                Axios.all(deleteArr)
                .then(()=>{
                    Axios.get(`${API_URL}/carts`,{
                        params:{
                            userId:this.props.id,
                            _expand:'product'
                        }
                    })
                    .then((res3)=>{
                        this.setState({cart:res3.data, isOpen: false})
                    }).catch((err)=>console.log(err))
                }).catch((err)=>console.log(err))
            }).catch((err)=>console.log(err))
        }).catch((err)=>console.log(err))
    }

    onBayarPakeBukti=()=>{
        Axios.post(`${API_URL}/transactions`,{
            status:'waitingAdminConfirm',
            userId: this.props.id,
            tanggalPembayaran: new Date().getTime(),
            metode:'upload',
            buktiPembayaran:this.state.bukti.current.value
        }).then((res)=>{
            var arr=[]
            this.state.cart.forEach((val)=>{
                arr.push(Axios.post(`${API_URL}/transactionsdetails`,{
                    transactionId:res.data.id,
                    productId:val.productId,
                    price:parseInt(val.product.harga),
                    qty: val.qty
                }))
            })
            Axios.all(arr).then(()=>{
                var deleteArr=[]
                this.state.cart.forEach((val)=>{
                    deleteArr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
                })
                Axios.all(deleteArr)
                .then(()=>{
                    Axios.get(`${API_URL}/carts`,{
                        params:{
                            userId:this.props.id,
                            _expand:'product'
                        }
                    })
                    .then((res3)=>{
                        this.setState({cart:res3.data, isOpen: false})
                    }).catch((err)=>console.log(err))
                }).catch((err)=>console.log(err))
            }).catch((err)=>console.log(err))
        }).catch((err)=>console.log(err))
    }

    render() {
        if(this.props.role==='user'){
            return ( 
                <div>
                    <Modal style={{top:'86px'}} isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen:false})}>
                        <ModalHeader toggle={()=>this.setState({isOpen:false})}>Pembayaran</ModalHeader>
                        <ModalBody>
                            <select onChange={(e)=>this.setState({pilihan:e.target.value})} className='form-control mt-3'>
                                <option hidden>Pilih jenis pembayaran</option>
                                <option value='1'>Input bukti transfer</option>
                                <option value='2'>Credit Card</option>
                            </select>
                            {
                                this.state.pilihan === '2'?
                                <input ref={this.state.cc} className='form-control mt-3' placeholder='Masukkan Credit Card'/>
                                : this.state.pilihan === '1'?
                                <input ref={this.state.bukti} className='form-control mt-3' placeholder='Masukkan bukti pembayaran'/>
                                :
                                null    
                            }
                        </ModalBody>
                        <ModalFooter>
                            <p className='text-center'>{priceFormatter(this.renderTotalHarga())}</p>
                        </ModalFooter>
                        <ButtonUi className='mx-3 my-2' onClick={this.onBayarClick}>Bayar</ButtonUi>
                    </Modal>
                    <Header/>
                    <div style={{marginTop:'94px'}} className='pt-3'>
                    <Paper className='container'>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Nama Trip</TableCell>
                                <TableCell style={{width:'200px'}}>Gambar</TableCell>
                                <TableCell>Jumlah</TableCell>
                                <TableCell>Harga</TableCell>
                                <TableCell>Subtotal Harga</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.renderCart()}
                            </TableBody>
                            <TableFooter>
                                <TableCell colSpan={4}></TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell style={{fontWeight:'bold',fontSize:'22px',color:'black'}}>{priceFormatter(this.renderTotalHarga())}</TableCell>
                            </TableFooter>
                            </Table>
                        </TableContainer>
                        <ButtonUi onClick={this.onCheckOutClick} className='align-self-end'>Check Out</ButtonUi>
                    </Paper>
                    </div>
                </div>
             );
        }else{
            return (
                <div>
                    <NotFound/>
                </div>
            )
        }
    }
}

const MapstatetoProps=({Auth})=>{
    return{
        ...Auth
    }
}

export default connect(MapstatetoProps,{ResetCartFunc})(Cart);