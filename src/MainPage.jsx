import React, { useState, useEffect } from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import { SlClose } from 'react-icons/sl';
import { FaStar } from 'react-icons/fa';

const apiKey = import.meta.env.VITE_API_KEY;
const genreUrl = "https://api.themoviedb.org/3/genre/movie/list"
const nowPlayingUrl = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1"
const topRatedUrl = "https://api.themoviedb.org/3/movie/top_rated"
const popularUrl = "https://api.themoviedb.org/3/movie/popular"
const tvShowsUrl = "https://api.themoviedb.org/3/tv/popular"


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
    const [genreResponse, nowPlayingResponse, topRatedResponse, popularResponse, tvShowsResponse] = await
      Promise.all([
        fetch(genreUrl, options),
        fetch(nowPlayingUrl, options),
        fetch(topRatedUrl, options),
        fetch(popularUrl, options),
        fetch(tvShowsUrl, options)
      ])
    const genresData = await genreResponse.json();
    const nowPlayingData = await nowPlayingResponse.json();
    const topRatedData = await topRatedResponse.json();
    const popularData = await popularResponse.json();
    const tvShowsData = await tvShowsResponse.json();

    return {
      genres: genresData.genres,
      nowPlaying: nowPlayingData.results,
      topRated: topRatedData.results,
      popular: popularData.results,
      tvShows: tvShowsData.results
    }
  } catch (e) {
    console.log(e.message)
  }
}

export default function MainPage() {
  const [nowPlayingMovies, setnowPlayingMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchData()

        setGenres(data.genres)
        setnowPlayingMovies(data.nowPlaying)
        setTopRated(data.topRated)
        setPopular(data.popular)
        setTvShows(data.tvShows)
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

  const genreMap = Object.fromEntries(genres.map(genre => [genre.id, genre.name]))

  const openModal = (movieId) => {
    setSelectedMovieId(movieId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedMovieId(null)
    setIsModalOpen(false)
    setMovieDetails(null)
    setCredits(null)
  }

  useEffect(() => {
    const getMovieDetails = async () => {
      if (!selectedMovieId) {
        return;
      }
      const options = {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
      try {
        const movieDetailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${selectedMovieId}?language=en-US`, options)

        const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${selectedMovieId}/credits?language=en-US`, options)


        const movieDetailsData = await movieDetailsResponse.json()
        const creditsData = await creditsResponse.json()

        console.log(movieDetailsData)
        setMovieDetails(movieDetailsData);

        console.log(creditsData)
        setCredits(creditsData.cast)
      }
      catch (e) {
        console.log(e.message)
      }
    }
    getMovieDetails();
  }, [selectedMovieId])

  return (
    <main className='relative'>
      <section className='w-full m-auto'>
        <Slider {...settings}>
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id} className='relative'>
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
            <div key={movie.id}
              className='p-2 outline-none cursor-pointer hover:bg-[#367c8f]'
              onClick={() => { openModal(movie.id) }}>
              <img
                src={`${imageBaseUrl}w200${movie.poster_path}`}
                alt={movie.title}
                className='object-cover rounded-lg'
              />
              <p className='text-sm sm:text-lg text-center mt-1'>{movie.title}</p>
            </div>
          ))}
        </Slider>
      </section>
      <section className='p-3 text-white'>
        <p className='text-3xl'>Popular</p>
        <Slider {...settings2}>
          {popular.map(movie => (
            <div key={movie.id}
              className='p-2 outline-none cursor-pointer hover:bg-[#367c8f]'
              onClick={() => { openModal(movie.id) }}>
              <img
                src={`${imageBaseUrl}w200${movie.poster_path}`}
                alt={movie.title}
                className='object-cover rounded-lg' />
              <p className='text-sm sm:text-lg text-center mt-1'>{movie.title}</p>
            </div>
          ))}
        </Slider>
      </section>
      <section className='p-3 text-white'>
        <p className='text-3xl'>TV Shows</p>
        <Slider {...settings2}>
          {tvShows.map(show => (
            <div key={show.id} className='p-2'>
              <img
                src={`${imageBaseUrl}w200${show.poster_path}`}
                alt={show.name}
                className='object-cover rounded-lg' />
              <p className='text-sm sm:text-lg text-center mt-1'>{show.name}</p>
            </div>
          ))}
        </Slider>
      </section>
      {isModalOpen && movieDetails && (
        <div
          className='fixed inset-0 z-40 flex items-center p-4 bg-cover bg-center h-full'
          style={{
            backgroundImage: `url(${imageBaseUrl}original${movieDetails.backdrop_path})`
          }}>

          <div className='absolute inset-0 bg-black/75'></div>

          <div className='overflow-y-scroll max-h-full py-4'>

            <div className='absolute top-0 right-0 p-5'>
              <SlClose className=' text-white text-4xl z-60 relative cursor-pointer'
                onClick={() => { closeModal() }} />
            </div>

            <div className=' text-white flex justify-center items-center relative z-50 flex-col md:flex-row h-full mt-8 gap-8'>
              <img
                src={`${imageBaseUrl}w342${movieDetails.poster_path}`}
                alt={movieDetails.title}
              />

              <div className='flex flex-col sm:w-3/4 font-semibold text-sm gap-3 md:text-lg'>
                <h2 className='md:text-3xl text-xl'>{movieDetails.title}</h2>
                <div className='flex items-center gap-2'>Rating: <FaStar className='text-amber-300' /> {(movieDetails.vote_average).toFixed(1)} / 10 </div>
                <p>Release Date: {movieDetails.release_date}</p>
                <p>Runtime: {movieDetails.runtime} minutes</p>
                <p>Genre: {movieDetails.genres.map(genre => (genre.name)).join(', ')}</p>
                <p>{movieDetails.overview}</p>
                <div className='flex gap-1'>
                  <p>Cast: </p>
                  {credits && (
                    <p>
                      {credits.slice(0, 5).map(cast => cast.name).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )
      }
    </main>
  )
}