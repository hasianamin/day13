import React, { Component } from 'react';
import Loader from 'react-loader-spinner'

class Loading extends Component {
    state = {  }
    render() { 
        return ( 
            <div className='d-flex justify-content-center align-items-center'>
                <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
            </div>
         );
    }
}
 
export default Loading;