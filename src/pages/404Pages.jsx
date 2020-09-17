import React, { Component } from 'react';
import {Link} from 'react-router-dom'

class NotFound extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                404 Not found
                <Link to='/' style={{textDecoration:'none'}}>
                      Back to Home
                </Link>
            </div>
         );
    }
}
 
export default NotFound;