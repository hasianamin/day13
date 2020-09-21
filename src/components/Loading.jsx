import React, { Component } from 'react';
import Loader from 'react-loader-spinner'

class Loading extends Component {
    state = {  }
    render() { 
        return ( 
            <div style={{height:'100vh'}} className='d-flex justify-content-center align-items-center'>
                <Loader type="ThreeDots" color="rgb(255,142,83)" height={80} width={80} />
            </div>
         );
    }
}
 
export default Loading;