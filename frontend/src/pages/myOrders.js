import React, { Component } from 'react';
import { CardColumns } from 'react-bootstrap';
import Axios from 'axios';

import Loading from '../components/loading.component';
import Product from '../components/buyer.productCard.component';
import Can from '../authentication/Can';
import { AuthConsumer } from '../authentication/authContext';
import NoElement from '../components/noElement.component';
import Unauthorized from '../components/unauthorized.component';


class Orders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            orders: [],
            loaded: false
        }
    }

    componentDidMount() {
        Axios.get("http://localhost:5000/order/" + this.props.id)
        .then(res => {
            this.setState({orders: res.data, loaded: true});
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                {this.state.loaded ? (
                    this.state.orders.length ? (
                        <CardColumns>
                            {this.state.orders.map(order => {
                                return <Product product={order.product_id} order={order} isOrdered={true} key={order._id}/>
                            })}
                        </CardColumns>
    
                        ) : <NoElement /> 
                    ) : (
                        <Loading />
                )}
            </div>
        )
    }
}

export default props => (
    <AuthConsumer>
      {({ user }) => (
        <Can
          role={user.role}
          perform="orders:visit"
          location="/buyer/orders"
          yes={() => (
                 <Orders {...props} id={user._id}/>
              )}
        no={() => (
            <Unauthorized />
        )}
        />
      )}
    </AuthConsumer>
  );