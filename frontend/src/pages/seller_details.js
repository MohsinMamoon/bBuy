import React, { Component } from 'react';
import { Toast } from 'react-bootstrap';
import Axios from 'axios';

import Loading from '../components/loading.component';
import NoElement from '../components/noElement.component'
import Unauthorized from '../components/unauthorized.component';
import { AuthConsumer } from '../authentication/authContext';
import Can from '../authentication/Can';

class SellerDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            to_load: props.match.params.id,
            customer: null,
            reviews: null,
            loaded: false
        }

        this.Review = this.Review.bind(this);
    }

    componentDidMount() {
        Axios.get("http://localhost:5000/account/" + this.state.to_load)
        .then(res => {
            if(res.status === 200) {
                console.log(res.data);
                this.setState({customer: res.data});
                Axios.get("http://localhost:5000/rating/account/" + res.data._id)
                .then(res2 => {
                    if(res2.status === 200) {
                        console.log(res2.data)
                        this.setState({reviews: res2.data, loaded: true});
                    }
                })
                .catch(err => console.log(err));
            }
            else{
                this.setState({customer: null});
            }
        })
        .catch(err => console.log(err));
    }

    Review = (review) => {
        return(
        <>
            <Toast key={review._id}>
                <b>&nbsp;{review.product_id.name}</b>
                <Toast.Header  closeButton={false}>
                    <strong className="mr-auto">{review.customer_id.username}</strong>
                    <strong>{review.rating}</strong>
                </Toast.Header>
                <Toast.Body>{review.review.length ? review.review : "No Review Given!"}</Toast.Body>
            </Toast>
        </>
        )
    }
    render() {
        return(
            <div className="Jumbtron">
                {this.state.loaded ? (
                    this.state.customer ?  (<>
                        <center> <h1> {this.state.customer.username} </h1> </center>
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
          perform="sellerDetails:view"
          yes={() => (
                 <SellerDetails {...props}/>
              )}
          no={() => (
            <Unauthorized />
          )}
        />
      )}
    </AuthConsumer>
  );
