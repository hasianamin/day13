import React, { Component } from 'react';
import Header from './../../components/Header'
import './listprod.css'
import Axios from 'axios'
import { API_URL, priceFormatter } from '../../helpers/idrformat';
import { Breadcrumb, BreadcrumbItem, Card, CardImg} from 'reactstrap';
import {Link} from 'react-router-dom'

class ListProd extends Component {
    state = {
        Products:[]
     }

    componentDidMount(){
        Axios.get(`${API_URL}/products?_sort=namaTrip&_order=asc`)
        .then((res)=>{
            this.setState({Products:res.data})
        }).catch((err)=>console.log(err))
    }

    renderCard = () => {
        var z = new Date().getTime()
        var temp = this.state.Products.filter((val)=>{
            return val.tanggalMulai >= z
        })
        return temp.map((val)=>{
            return(
                <div key={val.id} className="col-md-3 px-2 py-2">
                    <Link to={'/products/'+val.id}>
                        <Card className='kartu card-rounded'>
                            <CardImg top width="100%" className='card-rounded' height={200} src={val.gambar} alt="Card image cap" />
                            <div class="overlay card-rounded">
                                <div class="text">
                                    <div>
                                        {val.namaTrip}
                                    </div>
                                    <div>
                                        {priceFormatter(val.harga)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            )
        })
    }

    render() { 
        return ( 
            <div style={{marginTop:'80px'}}>
                <Header/>
                <div className='pt-3 px-4'>
                    <Breadcrumb className='tranparant m-0 px-2'>
                        <BreadcrumbItem ><Link className='link-class' to="/">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Products</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="row p-0 m-0">
                        {this.renderCard()}
                    </div>
                </div>
            </div>
         );
    }
}
 
export default ListProd;