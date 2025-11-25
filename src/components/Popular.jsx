import React from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

export const Popular = ({ popular, openModal }) => {
  const imageBaseUrl = 'https://image.tmdb.org/t/p/';
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,

    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: false,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      }
    ]
  }
  return (
    <section className='px-2 text-white'>
      <p className='text-3xl'>Popular</p>
      <Slider {...settings}>
        {popular.map(movie => (
          <div key={movie.id}
            className='p-2 outline-none cursor-pointer hover:bg-[#367c8f] active:bg-[#367c8f]'
            onClick={() => { openModal(movie.id) }}>
            <img
              src={`${imageBaseUrl}w200${movie.poster_path}`}
              alt={movie.title}
              className='object-cover rounded-lg' />
            <p className='text-lg text-center mt-1'>{movie.title}</p>
          </div>
        ))}
      </Slider>
    </section>
  )
}