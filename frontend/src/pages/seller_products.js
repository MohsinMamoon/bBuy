import React, { Component } from 'react';
import axios from 'axios';
import { CardColumns } from 'react-bootstrap';

import Product from '../components/seller.productCard.component';
import Loading from '../components/loading.component';
import NoElement from '../components/noElement.component';
import { AuthConsumer } from '../authentication/authContext';
import Can from '../authentication/Can';
import Unauthorized from '../components/unauthorized.component';

class SellerProducts extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            status: props.match.params.criteria,
            products: [],
            loaded: false
        }
    }

    componentDidMount() {
        axios.get("http://localhost:5000/product/"+this.props.id+"/"+this.state.status)
        .then(res => {
            this.setState({products: res.data, loaded: true})
            console.log(res.data)
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <>
            {this.state.loaded ? (
                this.state.products.length ? (
                        <CardColumns>
                            {this.state.products.map(product => (<Product product={product} key={product._id}  />))}
                        </CardColumns>
                ) : <NoElement />
                ) : <Loading />}
        </>)
    }
};

export default props => (
    <AuthConsumer>
      {({ user }) => (
        <Can
          role={user.role}
          perform="sellerProduct:view"
          yes={() => (
                 <SellerProducts id={user._id} {...props}/>
              )}
          no={() => (
            <Unauthorized />
          )}
        />
      )}
    </AuthConsumer>
  );