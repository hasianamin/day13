
import React, { Component, createRef } from 'react';
import Header from '../../components/Header'
import { Breadcrumb, BreadcrumbItem,Modal,ModalBody,ModalFooter} from 'reactstrap';
import {Link,Redirect} from 'react-router-dom'
import Axios from 'axios'
import ButtonUi from './../../components/Button'
import { API_URL,dateFormat } from '../../helpers/idrformat';
import {connect} from 'react-redux'
import './detailprod.css'
import Swal from 'sweetalert2'
import {UpdateCartFunc} from './../../redux/actions'


class DetailProd extends Component {
    state = { 
        loading:true,
        products:{},
        qty:createRef(),
        isOpen:false,
        keLogin:false,
        userCart:[] 
    }

    componentDidMount(){
        Axios.get(`${API_URL}/products/${this.props.match.params.id}`)
        .then((res)=>{
            this.setState({products:res.data, loading:false})
        }).catch((err)=>console.log(err))
    }

    onAddToCart=()=>{
        if(this.props.role ==='admin'){
            alert('jangan beli lu kan admin')
        }else if(this.props.role ==='user'){
            if(this.state.qty.current.value === '' || this.state.qty.current.value === 0){
                Swal.fire(
                    'Error!',
                    'Silahkan masukkan jumlah tiket',
                    'error'
                )
            } else{
                Axios.get(`${API_URL}/carts?userId=${localStorage.getItem('id')}`)
                .then((res1)=>{
                    this.setState({userCart:res1.data})
                    var checkProdItem = this.state.userCart.filter((val)=>{
                        return val.productId === this.state.products.id
                    })
                    console.log(checkProdItem.length)
                    if(checkProdItem.length){
                        console.log(checkProdItem.length)
                        console.log('masuk sini')
                        //ini masih error bsk tanya ke mas dino
                        Axios.patch(`${API_URL}/carts?productId=${this.state.products.id}`,{
                            qty:parseInt(this.state.qty.current.value)+this.state.userCart[0].qty
                        }).then(()=>{
                            this.props.UpdateCartFunc()
                            Swal.fire(
                                'Cart ditambahkan!',
                                'Silahkan cek cart mu',
                                'success'
                            )
                        }).catch((err)=>console.log(err))
                    }else{
                        Axios.post(`${API_URL}/carts`,{
                            userId:this.props.id,
                            productId:this.state.products.id,
                            qty:parseInt(this.state.qty.current.value)
                        }).then(()=>{
                            this.props.UpdateCartFunc()
                            Swal.fire(
                                'Cart ditambahkan!',
                                'Silahkan cek cart mu',
                                'success'
                            )
                        })
                    }
                })
            }
        }else{
            this.setState({isOpen:true})
        }
    }

    onRedirectToLogin=()=>{
        this.setState({isOpen:false,keLogin:true})
    }

    render() {
        const {products, isOpen} = this.state
        if(this.state.loading){
            return (
                <div>Loading...</div>
            )
        }
        if(this.state.keLogin){
            return (
                <Redirect to='/Login'/>
            )
        } else{
            return ( 
                <div style={{marginTop:'92px'}}>
                    <Modal className='modal-position' isOpen={isOpen} toggle={()=>this.setState({isOpen:false})}>
                        <ModalBody>
                            login dulu bro baru bisa beli cuy
                        </ModalBody>
                        <ModalFooter>
                            <ButtonUi onClick={this.onRedirectToLogin}>
                                Ok
                            </ButtonUi>
                        </ModalFooter>
                    </Modal>
                    <Header/>
                    <Breadcrumb className='tranparant m-0 px-2'>
                        <BreadcrumbItem ><Link className='link-class' to="/">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem ><Link className='link-class' to="/Products">Products</Link></BreadcrumbItem>
                        <BreadcrumbItem active >{this.state.products.namaTrip}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="pt-3 px-4">
                        <div style={{width:'100%',height:400,}}>
                            <img src={products.gambar} style={{objectFit:'cover',objectPosition:'bottom'}} height='100%' width='100%' alt={"foo"}/>
                        </div>
                        <h5 className='mt-2'>Tanggal mulai :{dateFormat(products.tanggalMulai)}</h5>
                        <h5 className='mt-2'>Tanggal berakhir :{dateFormat(products.tanggalBerakhir)}</h5>
                        <h2 className='mt-2'>
                            {products.namaTrip}
                        </h2>
                        <label>jumlah tiket</label><br/>
                        <input type="number" className={'form-control'} placeholder='qty' style={{width:200}} ref={this.state.qty}/>
                        <ButtonUi className='mt-2' onClick={this.onAddToCart}>
                            Add to cart
                        </ButtonUi>
                        <div className=' mt-3 mb-5'>
                            {products.deskripsi}
                        </div>
                    </div>
                </div>
             );
        }
    }
}

const MapstatetoProps=({Auth})=>{
    return{
        ...Auth
    }
}
 
export default connect(MapstatetoProps,{UpdateCartFunc})(DetailProd);