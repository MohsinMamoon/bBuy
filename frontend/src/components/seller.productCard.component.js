import React, { Component } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Axios from 'axios';

import logo from "../logo.png";
import { AuthConsumer } from '../authentication/authContext';
import Can from '../authentication/Can';

class Product extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            avail: this.props.product.max_quantity-this.props.product.ordered,
            product: this.props.product
        }
        this.changeStatus = this.changeStatus.bind(this);
    }
    arrayBufferToBase64(buffer) {
        
        var base64Flag = 'data:image/jpeg;base64,';
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        
        bytes.forEach((b) => binary += String.fromCharCode(b));        
        
        return (base64Flag + window.btoa(binary));
    };

    componentDidMount() {
        let prod = this.state.product
        
        if(prod.picture) {
            prod.picture = this.arrayBufferToBase64(prod.picture.data.data);
        }
        else {
            prod.picture = logo;
        }
        this.setState({product: prod});
    }

    changeStatus(status) {
        let url = "http://localhost:5000/product/update/" + this.props.product._id;
        Axios.post(url, {status: status})
        .then(res => console.log(res.data))
        .then(() => {
            if(status === 'cancelled'){
                window.location = "/seller/products/listed"
            }
            else {
                window.location = "/seller/products/ready"
            }
        })
        .catch(err => console.log(err));

    }

    render() {
        let product = this.state.product;

        let DeleteButton = () => (
            <div>
                <hr />
                <Button variant="danger" onClick={(e) => this.changeStatus('cancelled')}>Delete Listing</Button>
                <hr />
            </div> 
        );

        let DispatchButton = () => (
            <div>
                <br />
                <Button variant="warning" onClick={(e) => this.changeStatus('dispatched')}>Dispatch</Button>
                <hr />
            </div>
        );

        let ReviewButton = () => (
            <Link to={`/reviews/${product._id}`}>
                <hr />
                <Button variant="primary">View Reviews</Button>
                <hr />
            </Link>
        );

        return (
            <Card className="bg-dark text-white" style={{width:"80%", height:"60%"}}>
                <Card.Img src={product.picture} />
                <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                </Card.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item action>Price: <b>Rs. {product.price}</b></ListGroup.Item>
                    <ListGroup.Item action>Available: <b>{this.state.avail}</b></ListGroup.Item>
                </ListGroup>
                <center>
                {product.status === "listed" ? <DeleteButton /> : (
                    product.status === "ready" ? <DispatchButton /> : <ReviewButton />
                )}
                </center>
            </Card>
        )
    }
}

export default props => (
    <AuthConsumer>
      {({ user }) => (
        <Can
          role={user.role}
          perform="sellerProduct:get"
          yes={() => (
                 <Product {...props} id={user._id}/>
              )}
        />
      )}
    </AuthConsumer>
  );