import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';

import one from '../images/1.jpg';
import two from '../images/2.jpg';
import three from '../images/3.jpg';

class Home extends Component {

	render() {

		return (
			<>
			<div>
				<h1> <center> Welcome to buBuy </center></h1>
				<center><hr style={{ width: '35%', size: '100px'}}/></center>
				<h4> <center>Your one stop to buy loads of everything</center></h4>
			</div>
			<Carousel>
			<Carousel.Item>
				<img
				className="d-block w-100"
				src={three}
				alt="First slide"
				/>
				<Carousel.Caption style={{color: "black"}}>
				<h3>Shopping made Easy</h3>
				<p>Get everyday items delivered to your room!</p>
				</Carousel.Caption>
			</Carousel.Item>
			<Carousel.Item>
				<img
				className="d-block w-100"
				src={two}
				alt="Second slide"
				/>
			
				<Carousel.Caption style={{color: "black"}}>
				<h3>Shopping made Cheap!</h3>
				<p>Order products in bulk at a lower rate!</p>
				</Carousel.Caption>
			</Carousel.Item>
			<Carousel.Item>
				<img
				className="d-block w-100"
				src={one}
				alt="Third slide"
				/>
			
				<Carousel.Caption style={{color: "black"}}>
				<h3>Shopping made transparent</h3>
				<p>Directly get in touch with your supplier.</p>
				</Carousel.Caption>
			</Carousel.Item>
			</Carousel>
			</>
		)
	}
}

export default Home;