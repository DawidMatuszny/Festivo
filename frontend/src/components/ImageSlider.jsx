import React from 'react';
import './ImageSlider.css'; 


import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import image4 from '../assets/images/image1.jpg';
import image5 from '../assets/images/image2.jpg';
import image6 from '../assets/images/image3.jpg';

function ImageSlider() {
  return (
    <div className="slider-container">
      <div className="slider">
        {/* Zmieniamy src na zaimportowane obrazy */}
        <img src={image1} alt="Image 1" />
        <img src={image2} alt="Image 2" />
        <img src={image3} alt="Image 3" />
        <img src={image4} alt="Image 4" />
        <img src={image5} alt="Image 5" />
        <img src={image6} alt="Image 6" />
      </div>
    </div>
  );
}

export default ImageSlider;
