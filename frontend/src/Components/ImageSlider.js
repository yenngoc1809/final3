import React from 'react'
import './ImageSlider.css'
import { Carousel } from 'react-bootstrap'

function ImageSlider() {
    return (
        <div className='slider'>
            <Carousel>
                <Carousel.Item interval={1000}>
                    <img
                        className="d-block w-100"
                        src="https://www.twog-architecture.com/Data/Sites/1/Product/51/vgu-12.jpg"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>Welcome to VGU best library</h3>
                        <p>1</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={500}>
                    <img
                        className="d-block w-100"
                        src="https://vgu.edu.vn/documents/48694/6673768/10.jpg/53872705-d324-4692-86a0-b1386d40908a?t=1672975447000"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Welcome to VGU best library</h3>
                        <p>2</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://icsud.vgu.edu.vn/wp-content/uploads/elementor/thumbs/view7-peglj6hln617xby4duikd2blhr3clbmrds3d2lzusg-pgv6ortzybgiitmsgipd3cg6ccv05jp3vao1y3uops.jpg"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Welcome to VGU best library</h3>
                        <p>3</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default ImageSlider
