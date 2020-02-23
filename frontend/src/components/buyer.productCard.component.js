import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Tab, Tabs, ListGroup, Button, Form, FormControl, Alert, Row, Col, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import Axios from 'axios';

import logo from '../logo.png';
import { AuthConsumer } from '../authentication/authContext';
import Can from '../authentication/Can';

class Product extends Component {

    constructor(props) {
        super(props);

        this.state = {
            order_quantity: 0,
            edit_quantity: 0,
            failed: false,
            success: false,
            message: "",
            rating: 0,
            review: "", 
            product: props.product
        };

        this.order = this.order.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.review = this.review.bind(this);
    }

    arrayBufferToBase64(buffer) {
        
        var base64Flag = 'data:image/jpeg;base64,';
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        
        bytes.forEach((b) => binary += String.fromCharCode(b));        
        
        return (base64Flag + window.btoa(binary));
    };

    async componentDidMount() {
        let prod = this.state.product
        if(typeof(prod.vendor_id) === "string") {
            await Axios.get('http://localhost:5000/account/' + prod.vendor_id)
            .then(res=> {
                if(res.status === 200) {
                    prod.vendor_id = res.data;
                    this.setState({product: prod})
                }
            })            
        }

        if(prod.picture) {
            prod.picture = this.arrayBufferToBase64(prod.picture.data.data);
        }
        else {
            prod.picture = logo;
        }
        this.setState({product: prod});
    }

    review(e) {
        e.preventDefault();

        let rating = {
            rating: this.state.rating,
            review: this.state.review,
            customer: this.props.id,
            vendor: this.state.product.vendor_id._id,
            product: this.state.product._id
        }

        Axios.post("http://localhost:5000/rating/add", rating)
        .then(res => {
            if(res.status === 200) {
                this.setState({
                    failed: false,
                    success: true
                });
                setTimeout(() => window.location.reload(), 1000);
            }
            else {
                this.setState({
                    failed: false,
                    success: true,
                    message: "Error occured while rating! Please Try Again!"
                });
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                failed: false,
                success: true,
                message: "Error occured while rating! Please Try Again!"
            });
        });
    }

    edit(e) {
        e.preventDefault();

        let availabe = this.state.product.max_quantity + this.props.order.quantity - this.state.product.ordered;
        if(this.state.edit_quantity > availabe) {
            this.setState({
                failed: true,
                success: false,
                message: "Selected Quantity not available!"
            })
            return;
        }

        Axios.post("http://localhost:5000/order/" + this.props.order._id, {quantity: this.state.edit_quantity})
        .then(res => {
            console.log(res.data)
            if(res.status === 200) {
                this.setState({
                    failed: false,
                    success: true,
                    message: "Order Updated Successfully!"
                });
                setTimeout(() => window.location.reload(), 1000);
            }
            else {
                this.setState({
                    failed: false,
                    success: true,
                    message: "Error occured while updating the order! Please Try Again!"
                });
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                failed: false,
                success: true,
                message: "Error occured while updating the order! Please Try Again!"
            });
        });
    }

    delete(e) {
        let id = this.props.order._id

        Axios.delete("http://localhost:5000/order/" + id)
        .then(res => {
            console.log(res.data)
            if(res.status === 200) {
                this.setState({
                    failed: false,
                    success: true,
                    message: "Order Deleted Successfully!"
                });
                setTimeout(() => window.location.reload(), 1000);
            }
            else {
                this.setState({
                    failed: false,
                    success: true,
                    message: "Error occured while deleting the order! Please Try Again!"
                });
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                failed: false,
                success: true,
                message: "Error occured while deleting the order! Please Try Again!"
            });
        });
    }


    order(e) {
        e.preventDefault();
        
        let availabe = this.state.product.max_quantity - this.state.product.ordered;
        if(this.state.order_quantity > availabe) {
            this.setState({
                failed: true,
                success: false,
                message: "Selected Quantity not available!"
            })
            return;
        }

        let order = {
            product: this.state.product._id,
            customer: this.props.id,
            quantity: this.state.order_quantity
        };

        Axios.post("http://localhost:5000/order/add", order)
        .then(res => {
            console.log(res.data)
            if(res.status === 200) {
                this.setState({
                    failed: false,
                    success: true
                });
                setTimeout(() => window.location.reload(), 1000);
            }
            else {
                this.setState({
                    failed: false,
                    success: true,
                    message: "Error occured while ordering! Please Try Again!"
                });
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                failed: false,
                success: true,
                message: "Error occured while ordering! Please Try Again!"
            });
        });
    }
    
    DetailsTab = (product) => {
        return (
        <Tab eventKey="details" title="Details">
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text style={{color:"white"}} as="div">
                    <Link to={`/sellers/${product.vendor_id._id}`} style={{color: "inherit" }}>
                        <blockquote><h5><b>{product.vendor_id.username}</b></h5></blockquote> 
                    </Link>
                    <blockquote className="blockquote-footer">Rating: {product.vendor_id.avg_rating}</blockquote> 
                </Card.Text>
            </Card.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item action>Price: <b>Rs. {product.price}</b></ListGroup.Item>
                    <ListGroup.Item action>Available: <b>{product.max_quantity-product.ordered}</b></ListGroup.Item>
                </ListGroup>
        </Tab>
        )
    }
    
    OrderTab= (product) => {
        return(
            <Tab eventKey="order" title="Order">
                <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                        <Form inline onSubmit={this.order}>
                            <FormControl required type="number" placeholder="Quantity" className="mr-sm-2" size="sm" onChange={(e) => this.setState({order_quantity: e.target.value})} />
                            <Button type="submit" variant="outline-success" size="sm">Order</Button>
                        </Form>
                        <div>
                            {this.state.failed && (
                                <Alert variant='danger'>
                                    <h6><center>{this.state.message}</center></h6>
                                </Alert>
                            )}
                            {this.state.success && (
                                <Alert variant="success">
                                    <h6><center>Order Successful!</center></h6>
                                </Alert>
                            )}
                        </div>  
                </Card.Body>
            </Tab>
        )
    }

    EditTab = (product) => {
        return(
            <Tab eventKey="edit" title="Edit">
                <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text> 
                        Status: {product.status}
                    </Card.Text>
                        <Form onSubmit={this.edit}>
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                Ordered
                                </Form.Label>
                                <Col sm="4">
                                <Form.Control plaintext readOnly style={{color:"white"}} defaultValue={this.props.order.quantity} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                Review
                                </Form.Label>
                                <Col sm="8">
                                <Form.Control required type="number" placeholder="Quantity" onChange={(e) => this.setState({edit_quantity: e.target.value})}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col sm="4">
                                    <Button type="submit" variant="outline-success" size="sm">Edit</Button>
                                </Col>
                                <Col sm="4">
                                    <Button variant="outline-danger" size="sm" onClick={this.delete}>Delete</Button>
                                </Col>

                            </Form.Group>
                        </Form>
                        <div>
                            {this.state.failed && (
                                <Alert variant='danger'>
                                    <h4><center>{this.state.message}</center></h4>
                                </Alert>
                            )}
                            {this.state.success && (
                                <Alert variant="success">
                                    <h4><center>{this.state.message}</center></h4>
                                </Alert>
                            )}
                        </div>
                </Card.Body>
            </Tab>
        )
    }

    ReviewTab = (product) => {
        return(
            <Tab eventKey="review" title="Review">
                <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text> 
                        Status: {product.status}
                    </Card.Text>
                        <Form inline onSubmit={this.review}>
                            <InputGroup className="mb-3">
                                <DropdownButton
                                as={InputGroup.Prepend}
                                variant="outline-secondary"
                                title={!this.state.rating ? "Rating" : this.state.rating}
                                required
                                onChange={(e) => this.setState({rating: e.target.value})}
                                >
                                    <Dropdown.Item onClick={(e) => this.setState({rating: 1})}>1</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => this.setState({rating: 2})}>2</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => this.setState({rating: 3})}>3</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => this.setState({rating: 4})}>4</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => this.setState({rating: 5})}>5</Dropdown.Item>
                                </DropdownButton>
                                <FormControl sm="4" aria-describedby="basic-addon1" type="textarea" placeholder="Review" onChange={(e) => this.setState({review: e.target.value})}/>
                            </InputGroup>
                            <Button type="submit" variant="outline-success" size="sm">Submit Review</Button>
                        </Form>
                        <div>
                            {this.state.failed && (
                                <Alert variant='danger'>
                                    <h4><center>{this.state.message}</center></h4>
                                </Alert>
                            )}
                            {this.state.success && (
                                <Alert variant="success">
                                    <h4><center>Review Submitted Successful!</center></h4>
                                </Alert>
                            )}
                        </div>   
                </Card.Body>
            </Tab>
        )
    }
    render() {
        let product = this.state.product;
        if(product.status === 'listed') product.status = 'Waiting';
        else if(product.status === 'ready') product.status = 'Placed';
        else if(product.status === 'dispatched') product.status = 'Dispatched';

        return (
        <Card className="bg-dark text-white" style={{width:"80%", height:"60%"}}>
            <Card.Img src={product.picture} />
            <Tabs defaultActiveKey="details" id="uncontrolled-tab-example">
                {this.DetailsTab(product)}
                {!this.props.isOrdered ? (this.OrderTab(product)) : (
                    product.status === 'Waiting' ? (this.EditTab(product)) : (this.ReviewTab(product))
                )}
                
            </Tabs>
        </Card>
        )
    }
}

export default props => (
    <AuthConsumer>
      {({ user }) => (
        <Can
          role={user.role}
          perform="buyerProduct:get"
          yes={() => (
                 <Product {...props} id={user._id}/>
              )}
        />
      )}
    </AuthConsumer>
  );
  