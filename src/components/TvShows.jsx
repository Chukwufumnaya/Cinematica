import React from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

export const TvShows = ({ tvShows, openModal }) => {
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
      <p className='text-3xl'>TV Shows</p>
      <Slider {...settings}>
        {tvShows.map(show => (
          <div key={show.id}
            className='p-2 outline-none cursor-pointer hover:bg-[#367c8f] active:bg-[#367c8f]'
            onClick={() => { openModal(show.id, 'tv') }}>
            <img
              src={`${imageBaseUrl}w200${show.poster_path}`}
              alt={show.name}
              className='object-cover rounded-lg' />
            <p className='text-lg text-center mt-1'>{show.name}</p>
          </div>
        ))}
      </Slider>
    </section>
  )
}