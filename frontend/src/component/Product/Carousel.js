import React, { useState } from 'react';
import "./Carousel.css"

const Carousel = ({ products }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlide((currentSlide + 1) % products.Images.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((currentSlide - 1 + products.Images.length) % products.Images.length);
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        {products.Images &&
          products.Images.map((item, i) => (
            <img
              className={`CarouselImage ${i === currentSlide ? 'active' : ''}`}
              key={item.url}
              src={item.url}
              alt={`${i} Slide`}
            />
          ))}
      </div>
      <button className="prev-button" onClick={handlePrevSlide}>
        &lt;
      </button>
      <button className="next-button" onClick={handleNextSlide}>
        &gt;
      </button>
    </div>
  );
};

export default Carousel;
