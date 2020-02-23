import React, { Component } from 'react';
import { CardColumns, InputGroup, Dropdown, DropdownButton, FormControl, Button } from 'react-bootstrap';
import Axios from 'axios';

import { AuthConsumer } from '../authentication/authContext';
import Can from '../authentication/Can';
import Unauthorized from '../components/unauthorized.component';
import Loading from '../components/loading.component';
import NoElement from "../components/noElement.component";
import Product from "../components/buyer.productCard.component";

class Store extends Component {

    constructor(props) {
        super(props)

        this.state = {
            products: [],
            search_term: props.match.params.criteria,
            loaded: false
        }

        this.fetch = this.fetch.bind(this);
    }
    sort_order = {
        "price": (a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0),
        "quantity": (a, b) => ((a.max_quantity - a.ordered) > (b.max_quantity - b.ordered)) ? 1 : (((b.max_quantity - b.ordered) > (a.max_quantity-a.ordered)) ? -1 : 0),
        "rating": (a, b) => (a.vendor_id.avg_rating > b.vendor_id.avg_rating) ? 1 : ((b.vendor_id.avg_rating > a.vendor_id.avg_rating) ? -1 : 0)
    }

    componentDidMount() {
        let order = localStorage.getItem("order")
        if(!order) order = "price" 
        Axios.get("http://localhost:5000/product/search/" + this.state.search_term)
        .then(res => {
            console.log(res.data);
            this.setState({

                products: res.data.sort(this.sort_order[order]),
                loaded: true
            });
        })
        .catch(err => console.log(err));
    }

    fetch() {
        window.location = "/buyer/products/" + this.state.search_term;
    }

    sort(order) {
        localStorage.setItem("order", order)
        window.location.reload()
    }

    render() {
        return (
        <div>
            {this.state.loaded ? ( 
                <>
                    <InputGroup className="mb-3">
                        <DropdownButton
                        as={InputGroup.Prepend}
                        variant="outline-primary"
                        title="Sort By"
                        id="input-group-dropdown-1"
                        >
                        <Dropdown.Item onClick={(e) => this.sort("price")}>Price</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => this.sort("rating")}>Rating</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => this.sort("quantity")}>Quantity</Dropdown.Item>
                        </DropdownButton>
                        <FormControl aria-describedby="basic-addon1" placeholder="Search" onChange={(e) => this.setState({search_term: e.target.value})} />
                            <InputGroup.Append>
                        <Button variant="outline-success" onClick={(e) => this.fetch()}>Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                     
                {this.state.products.length ? (
                    <CardColumns>
                        {this.state.products.map(prod => <Product product={prod} isOrdered={false} key={prod._id} />)}
                    </CardColumns>
                ) : (<NoElement />)}
           </>
            )
             : (<Loading/>)}
        </div>
        )
    }
}

export default props => (
    <AuthConsumer>
      {({ user }) => (
        <Can
          role={user.role}
          perform="store:view"
          location="/buyer/products"
          yes={() => (
                 <Store {...props} />
              )}
          no={() => (
              <Unauthorized />
          )}
        />
      )}
    </AuthConsumer>
  );