import React from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

export const NowPlaying = ({ nowPlayingMovies, genres }) => {
  const imageBaseUrl = 'https://image.tmdb.org/t/p/';
  const genreMap = Object.fromEntries(genres.map(genre => [genre.id, genre.name]));

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000
  }

  return (
    <section className='w-full m-auto'>
      <Slider {...settings}>
        {
          nowPlayingMovies.map((movie) => (
            <div
              key={movie.id} className='relative'>
              <img
                src={`${imageBaseUrl}w1280${movie.backdrop_path}`}
                alt={movie.name}
                className='object-cover z-1 opacity-50 m-auto h-[80vh] w-full' />
              <div className='absolute z-2 bg-transparent top-[30%] md:top-[40%] m-5 h-auto'>
                <p className='text-white text-2xl underline ml-5'>Now Playing: {movie.title}</p>
                <p className='text-white ml-5'>{movie.genre_ids.map(genre => genreMap[genre]).join(', ')}</p>
              </div>
            </div>
          ))
        }
      </Slider>
    </section>
  )
}