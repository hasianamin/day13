import React, { Component } from 'react';
import Homescreen from './../../assets/homescreen.webp'
import ImgTravel1 from './../../assets/img1.svg'
import ImgTravel2 from './../../assets/img2.svg'
import Header from '../../components/Header'
import ButtonUi from '../../components/Button'
import Footer from './../../components/Footer'

class Home extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                <Header/>
                <div style={{width:'100%'}}>
                    <img alt='test' src={Homescreen} width='100%'/>
                </div>
                <div className='d-flex align-items-center justify-content-between px-5' style={{height:'8vh', background:'salmon', color:'whitesmoke'}}>
                    <div>Segera dapatkan paket promo dari kami</div>
                    <ButtonUi>Lihat promo</ButtonUi>
                </div>
                <div className='row p-0 m-0 mt-4'>
                    <div className='col-md-6 pl-5 m-0 py-5'>
                        <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores distinctio repudiandae quasi, fuga sint, reprehenderit sunt eligendi earum accusamus illum similique. Aperiam, velit.</h2>
                    </div>
                    <div className='col-md-6 pr-5 m-0' style={{height: '500px'}}>
                        <img src={ImgTravel1} alt='img1' width='100%    '/>
                    </div>
                </div>
                <div className='row p-0 m-0 mt-4'>
                    <div className='col-md-6 pl-5 m-0' style={{height: '500px'}}>
                        <img src={ImgTravel2} alt='img2' height='80%'/>
                    </div>
                    <div className='col-md-6 pr-5 m-0 py-5'>
                        <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo ex modi voluptatum quasi exercitationem neque autem labore sunt possimus, velit, tempore sapiente?</h2>
                    </div>
                </div>
                <Footer/>
            </div>
         );
    }
}
 
export default Home;