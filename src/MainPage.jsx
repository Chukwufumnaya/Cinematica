import React, { useState, useEffect } from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

const apiKey = import.meta.env.VITE_API_KEY;
const genreUrl = "https://api.themoviedb.org/3/genre/movie/list"
const nowPlayingUrl = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"
const topRatedUrl = "https://api.themoviedb.org/3/movie/top_rated"

const imageBaseUrl = 'https://image.tmdb.org/t/p/';

async function fetchData() {
  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  }

  try {
    const [genreResponse, nowPlayingResponse, topRatedResponse] = await
      Promise.all([
        fetch(genreUrl, options),
        fetch(nowPlayingUrl, options),
        fetch(topRatedUrl, options)
      ])
    const genresData = await genreResponse.json();
    const nowPlayingData = await nowPlayingResponse.json();
    const topRatedData = await topRatedResponse.json();
   
    return {
      genres: genresData.genres,
      nowPlaying: nowPlayingData.results,
      topRated: topRatedData.results
    }
  } catch (e) {
    console.log(e.message)
  }
}

export default function MainPage() {
  const [nowPlayingMovies, setnowPlayingMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchData()

        setGenres(data.genres)
        setnowPlayingMovies(data.nowPlaying)
        setTopRated(data.topRated)
      } catch (e) {
        console.log(e.message)
      }
    }

    loadData()
  }, [])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000
  }

  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,

    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5
        }
      }
    ]
  }

  const genreMap = Object.fromEntries(genres.map(genre => [genre.id, genre.name]))

  return (
    <>
      <section className='w-full m-auto'>
        <Slider {...settings}>
          {nowPlayingMovies.map((movie) => (
            <div key={movie.id} className='relative'>
              <img
                src={`${imageBaseUrl}w1280${movie.backdrop_path}`}
                alt={movie.name}
                className='object-cover z-1 opacity-50 m-auto h-[80vh] w-full' />
              <div className='absolute z-2 bg-transparent top-[30%] md:top-[40%] m-5 h-'>
                <p className='text-white text-2xl underline ml-5'>Now Playing: {movie.title}</p>
                <p className='text-white ml-5'>{movie.genre_ids.map(genre => genreMap[genre]).join(', ')}</p>
              </div>
            </div>
          ))}
        </Slider>
      </section>
      <section className='p-3 text-white'>
        <p className='text-3xl'>Top Rated</p>
        <Slider {...settings2}>
          {topRated.map(movie => (
            <div key={movie.title} className='p-2'>
              <img
                src={`${imageBaseUrl}w200${movie.poster_path}`}
                alt={movie.title}
                className='object-cover rounded-lg' />
              <p className='text-sm sm:text-lg text-center mt-1'>{movie.title}</p>
            </div>
          ))}
        </Slider>
      </section>
    </>
  )
}