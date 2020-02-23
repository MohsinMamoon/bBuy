import React, { Component } from "react";
import { Form, Col, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

import { AuthConsumer } from '../authentication/authContext';
import Can from "../authentication/Can";
import Unauthorized from "../components/unauthorized.component";


class AddProduct extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            price: 0,
            quantity: 0,
            image: "",
            validated: false,
            success: false,
            failed: false
        }

        this.submit = this.submit.bind(this);
    }

    submit(e) {
        
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          e.stopPropagation();
        }
        this.setState({validated: true});
        let product = new FormData();
    
        product.append('name', this.state.name);
        product.append('price', this.state.price);
        product.append('quantity', this.state.quantity);
        product.append('file', this.state.image);
        product.append('status', 'listed');
        product.append('id', this.props.id);

        axios.post("http://localhost:5000/product/add", product)
        .then(res => {
            console.log(res.data);
            this.setState({failed: false, success: true})
        })
        .catch(err => {
            console.log(err)
            this.setState({failed: true, success: false})
        });

        this.setState({validated: false})

        e.target.reset();

    }

    render() {
        return (<>
            <Form noValidate validated={this.state.validated} onSubmit={this.submit}>
                <Form.Row>
                <Form.Group as={Col} md="4" controlId="p_name">
                    <Form.Label>Name of the Product</Form.Label>
                    <Form.Control
                    required
                    type="text"
                    placeholder="Product Name"
                    onChange={(e) => this.setState({name: e.target.value})}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a Product Name.
                    </Form.Control.Feedback>
                </Form.Group>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Form.Group as={Col} md="4" controlId="image">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="file" name="image"
                        onChange={(e) => this.setState({image: e.target.files[0]})}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please choose an image.
                    </Form.Control.Feedback>
                </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group as={Col} md="3" controlId="price">
                    <Form.Label>Price of the Bulk</Form.Label>
                    <Form.Control type="number" placeholder="Price" required onChange={(e) => this.setState({price: e.target.value})} />
                    <Form.Control.Feedback type="invalid">
                    Please enter a valid price.
                    </Form.Control.Feedback>
                </Form.Group>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Form.Group as={Col} md="3" controlId="quantity">
                    <Form.Label>Size of the Bulk</Form.Label>
                    <Form.Control type="number" placeholder="Quantity" required onChange={(e) => this.setState({quantity: e.target.value})} />
                    <Form.Control.Feedback type="invalid">
                    Please provide a valid quantity.
                    </Form.Control.Feedback>
                </Form.Group>
                </Form.Row>
                <center>
                    <Button type="submit">Add Product Listing</Button>
                </center>
            </Form>
             <div>
             {this.state.failed && (
                 <Alert variant='danger'>
                     <h4><center>There was an error!</center></h4>
                 </Alert>
             )}
             {this.state.success && (
                 <Alert variant="success">
                    <h4><center>The product was added!</center></h4>
                 </Alert>
             )}
          </div>
        </>)
    }
}

export default props => (
    <AuthConsumer>
      {({ user }) => (
        <Can
          role={user.role}
          perform="product:add"
          location="/seller/add"
          yes={() => (
                 <AddProduct {...props} id={user._id}/>
              )}
          no={() => (
              <Unauthorized />
          )}
        />
      )}
    </AuthConsumer>
  );