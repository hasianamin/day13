import Axios from 'axios';
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { API_URL, priceFormatter } from '../../helpers/idrformat';
import Header from './../../components/Header'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import ButtonUi from './../../components/Button'
import {Modal, ModalHeader, ModalBody, ModalFooter, Alert} from 'reactstrap'
import {ResetCartFunc, UpdateCartFunc} from './../../redux/actions'
import { Link, Redirect } from 'react-router-dom';
import './cart.css'
import Swal from 'sweetalert2'
import {FaCartArrowDown} from 'react-icons/fa'
import Loading from './../../components/Loading'


class Cart extends Component {
    state = { 
        cart:null,
        isOpen:false,
        pilihan:0,
        bukti: createRef(),
        cc: createRef(),
        alertCC: false
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

    increaseQty = (productId) => {
        Axios.get(`${API_URL}/carts?userId=${localStorage.getItem('id')}`)
        .then((res)=>{
            var temp = res.data
            var z = temp.filter((val)=>{
                return val.productId === productId
            })
            var inc = 1 + z[0].qty 
            Axios.patch(`${API_URL}/carts/${z[0].id}`,{
                qty:inc
            }).then(()=>{
                this.componentDidMount()
            })
        }).catch((err)=>console.log(err))
    }

    decreaseQty = (productId, rowId) => {
        Axios.get(`${API_URL}/carts?userId=${localStorage.getItem('id')}`)
        .then((res)=>{
            var temp = res.data
            var z = temp.filter((val)=>{
                return val.productId === productId
            })
            if(z[0].qty > 1){
                var inc = z[0].qty - 1 
                Axios.patch(`${API_URL}/carts/${z[0].id}`,{
                    qty:inc
                }).then(()=>{
                    this.componentDidMount()
                })
            } else{
                this.onDeleteRow(rowId)
            }
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
              <TableCell width='300px' className='text-center'>
                <span style={{fontSize:12, cursor:'pointer'}} className='btn btn-outline-primary mr-3' onClick={()=>this.increaseQty(val.product.id)}>+</span>
                  {val.qty}
                <span style={{fontSize:12, cursor:'pointer'}} className='btn btn-outline-primary ml-3' onClick={()=>this.decreaseQty(val.product.id, val.id)}>-</span>
              </TableCell>
              <TableCell>{priceFormatter(val.product.harga)}</TableCell>
              <TableCell>{priceFormatter(val.product.harga*val.qty)}</TableCell>
              <TableCell>
                  <button className='btn btn-outline-danger' onClick={()=>this.onDeleteRow(val.id)}>Delete</button>
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
        var ccValidation = this.isValidCreditCard(this.state.cc.current.value)
        if(ccValidation){
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
                            Swal.fire(
                                'Sukses!',
                                'Pembayaran telah selesai',
                                'success'
                              )
                        }).catch((err)=>console.log(err))
                    }).catch((err)=>console.log(err))
                }).catch((err)=>console.log(err))
            }).catch((err)=>console.log(err))
        } else{
            this.setState({alertCC:true})
        }
    }

    isValidCreditCard(value) {
        // Accept only digits, dashes or spaces
          if (/[^0-9-\s]+/.test(value)) return false;
          // The Luhn Algorithm. It's so pretty.
          let nCheck = 0, bEven = false;
          value = value.replace(/\D/g, "");
          for (var n = value.length - 1; n >= 0; n--) {
              var cDigit = value.charAt(n),
                    nDigit = parseInt(cDigit, 10);
              if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
              nCheck += nDigit;
              bEven = !bEven;
          }
          return (nCheck % 10) == 0;
    }

    onDismiss = () => {
        this.setState({alertCC:false})
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

    onDeleteRow=(id)=>{
        Swal.fire({
            title: 'Apakah kamu ingin menghapus item ini dari keranjang?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete!'
          }).then((result) => {
            if (result.isConfirmed) {
                Axios.delete(`${API_URL}/carts/${id}`)
                .then(()=>{
                    Swal.fire(
                    'Berhasil!',
                    'Item berhasil dihapus',
                    'success'
                    )
                    this.componentDidMount()
                    this.props.UpdateCartFunc()
                }).catch((err)=>console.log(err))
            }
        })
    }

    render() {
        if(this.props.role==='user'){
            if(this.state.cart === null){
                return (
                    <div>
                        <Header/>
                        <Loading/>
                    </div>
                )
            } else{
                if(this.state.cart.length){
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
                                    <Alert color="danger" isOpen={this.state.alertCC} toggle={this.onDismiss} className='my-3'>
                                        Credit card is not valid
                                    </Alert>
                                </ModalBody>
                                <ModalFooter>
                                    <p className='text-center'>{priceFormatter(this.renderTotalHarga())}</p>
                                </ModalFooter>
                                <ButtonUi className='mx-3 my-2' onClick={this.onBayarClick}>Bayar</ButtonUi>
                            </Modal>
                            <Header/>
                            <div style={{marginTop:'94px'}} className='container py-3'>
                                <div>
                                    <h2><FaCartArrowDown/>&nbsp;Keranjang belanja</h2>
                                </div>
                            <Paper>
                                <TableContainer>
                                    <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Nama Trip</TableCell>
                                        <TableCell style={{width:'200px'}}>Gambar</TableCell>
                                        <TableCell className='text-center'>Jumlah</TableCell>
                                        <TableCell>Harga</TableCell>
                                        <TableCell>Subtotal Harga</TableCell>
                                        <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderCart()}
                                    </TableBody>
                                    <TableFooter>
                                        <TableCell colSpan={4}></TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell style={{fontWeight:'bold',fontSize:'22px',color:'black'}}>{priceFormatter(this.renderTotalHarga())}</TableCell>
                                        <TableCell></TableCell>
                                    </TableFooter>
                                    </Table>
                                </TableContainer>
                                <div className='d-flex flex-row-reverse py-2 mr-2'>
                                    <ButtonUi onClick={this.onCheckOutClick}>Check Out</ButtonUi>
                                </div>
                            </Paper>
                            </div>
                        </div>
                     );
                } else{
                    return (
                        <div style={{marginTop:'94px'}} className='pt-3'>
                            <Header/>
                            <div className='empty-cart'></div>
                            <div className='text-center'>
                                <h3 style={{color:'#403C56'}}>Keranjang belanja mu masih kosong<br/>klik tombol di bawah untuk berbelanja</h3>
                                <Link to='/products' className='mt-2'>
                                    <ButtonUi>Belanja</ButtonUi>
                                </Link>
                            </div>
                        </div>
                    )
                }
            }
        }else{
            return (
                <div>
                    <Redirect to='/'/>
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

export default connect(MapstatetoProps,{ResetCartFunc, UpdateCartFunc})(Cart);