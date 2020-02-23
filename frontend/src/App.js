import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import homePage from "./pages/home"
import loginPage from "./pages/login_page";
import registerPage from "./pages/register_page";
import addproduct from "./pages/add_product";
import sellerProducts from "./pages/seller_products";
import buyerProducts from "./pages/buyer_products";
import myOrders from "./pages/myOrders";
import Navbar from "./components/navbar.component";
import productReviews from "./pages/product_details";
import vendorReviews from "./pages/seller_details";

const search = () => (
  <Redirect to="/buyer/products/showall" />
)

function App() {
  return (
    <div className="App container">
      <div className="jumbotron">
        <Router>
        <Navbar />
        <br />
	      <Switch>
            <Route exact path="/" component={homePage}/>
            <Route path="/login" component={loginPage}/>
            <Route path="/register" component={registerPage}/>
            <Route path="/seller/add" component={addproduct}/>
            <Route path="/seller/products/:criteria" component={sellerProducts} />
            <Route path="/buyer/orders" component={myOrders} />
            <Route path="/buyer/products/:criteria" component={buyerProducts} />
            <Route path="/reviews/:id" component={productReviews} />
            <Route path="/sellers/:id" component={vendorReviews} />
            <Route path="/buyer/products" component={search} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;