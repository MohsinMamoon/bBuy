import React, { Component } from 'react';
import { Toast } from 'react-bootstrap';
import Axios from 'axios';

import Loading from '../components/loading.component';
import NoElement from '../components/noElement.component'
import { AuthConsumer } from '../authentication/authContext';
import Can from '../authentication/Can';
import Unauthorized from '../components/unauthorized.component';


class ProdDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            to_load: props.match.params.id,
            product: null,
            reviews: null,
            loaded: false
        }

        this.Review = this.Review.bind(this);
    }

    componentDidMount() {
        Axios.get("http://localhost:5000/product/" + this.state.to_load)
        .then(res => {
            if(res.status === 200) {
                this.setState({product: res.data});
                Axios.get("http://localhost:5000/rating/product/" + res.data._id)
                .then(res2 => {
                    if(res2.status === 200) {
                        this.setState({reviews: res2.data, loaded:true});
                    }
                })
                .catch(err => console.log(err));
            }
            else{
                this.setState({product: null});
            }
        })
        .catch(err => console.log(err));
    }

    Review = (review) => {
        return(
            <Toast key={review._id}>
                <Toast.Header  closeButton={false}>
                    <strong className="mr-auto">{review.customer_id.username}</strong>
                    <strong>{review.rating}</strong>
                </Toast.Header>
                <Toast.Body>{review.review.length ? review.review : "No Review Given!"}</Toast.Body>
            </Toast>
        )
    }
    render() {
        return(
            <div className="Jumbtron">
                {this.state.loaded ? (
                    this.state.product ?  (<>
                        <center> <h1> {this.state.product.name} </h1> </center>
                        <h4><strong> Seller: {this.state.product.vendor_id.username} </strong></h4>
                        <br />
                        <h5><strong> Reviews: </strong></h5>
                        <hr />
                        <div> {this.state.reviews.map(review => this.Review(review))} </div>
                    </>) : (
                        <NoElement />
                    )
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
          perform="productDetails:view"
          yes={() => (
                 <ProdDetails {...props}/>
              )}
          no={() => (
            <Unauthorized />
          )}
        />
      )}
    </AuthConsumer>
  );