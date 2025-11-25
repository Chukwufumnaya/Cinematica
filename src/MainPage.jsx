import React, { useState, useEffect } from 'react'
import { NowPlaying } from './components/NowPlaying';
import { TopRated } from './components/TopRated';
import { Popular } from './components/Popular';
import { TvShows } from './components/TvShows';
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
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [mediaType, setMediaType] = useState('movie');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchData()

        setGenres(data.genres)
        setNowPlayingMovies(data.nowPlaying)
        setTopRated(data.topRated)
        setPopular(data.popular)
        setTvShows(data.tvShows)
      } catch (e) {
        console.log(e.message)
      }
    }

    loadData()
  }, [])


  const openModal = (movieId, type = 'movie') => {
    setSelectedMovieId(movieId)
    setMediaType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedMovieId(null)
    setMediaType('movie')
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
        const movieDetailsResponse = await fetch(`https://api.themoviedb.org/3/${mediaType}/${selectedMovieId}?language=en-US`, options)

        const creditsResponse = await fetch(`https://api.themoviedb.org/3/${mediaType}/${selectedMovieId}/credits?language=en-US`, options)


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
  }, [selectedMovieId, mediaType])

  return (
    <main className='relative'>
      {nowPlayingMovies &&
        <NowPlaying nowPlayingMovies={nowPlayingMovies} genres={genres} />
      }
      {topRated &&
        <TopRated topRated={topRated} openModal={openModal} />
      }
      {popular &&
        <Popular popular={popular} openModal={openModal} />
      }
      {tvShows &&
        <TvShows tvShows={tvShows} openModal={openModal} />
      }


      {isModalOpen && movieDetails && credits && (
        <div
          className='fixed inset-0 z-40 flex items-center p-4 bg-cover bg-center h-full'
          style={{
            backgroundImage: `url(${imageBaseUrl}original${movieDetails.backdrop_path})`
          }}>

          <div className='absolute inset-0 bg-black/75'></div>

          <div className='overflow-y-auto max-h-full py-4 w-full'>

            <div className='absolute top-0 right-0 p-5'>
              <SlClose className=' text-white text-4xl z-60 relative cursor-pointer'
                onClick={() => { closeModal() }} />
            </div>

            <div className=' text-white flex justify-center items-center relative z-50 flex-col md:flex-row h-full mt-8 gap-8'>
              <img
                src={`${imageBaseUrl}w342${movieDetails.poster_path}`}
                alt={movieDetails.title}
              />
              {mediaType === 'movie' ?
                (
                  <div className='flex flex-col sm:w-3/4 md:w-1/2 font-semibold text-sm gap-3 md:text-lg'>
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
                )
                :
                (
                  <div className='flex flex-col sm:w-3/4 font-semibold text-sm gap-3 md:text-lg'>
                    <h2 className='md:text-3xl text-xl'>{movieDetails.name}</h2>
                    <div className='flex items-center gap-2'>Rating: <FaStar className='text-amber-300' /> {(movieDetails.vote_average).toFixed(1)} / 10 </div>
                    <p>First Air Date: {movieDetails.first_air_date}</p>
                    <p>Last Air Date: {movieDetails.last_air_date}</p>
                    <p>Number of Seasons: {movieDetails.number_of_seasons}</p>
                    <p>Number of Episodes: {movieDetails.number_of_episodes}</p>
                    <p>{movieDetails.overview}</p>
                    <p>Genre: {movieDetails.genres.map(genre => (genre.name)).join(', ')} </p>
                    <div className='flex gap-1'>
                      <p>Cast: </p>
                      {credits && (
                        <p>
                          {credits.slice(0, 5).map(cast => cast.name).join(', ')}
                        </p>
                      )}
                    </div>
                    {movieDetails.seasons.length > 1 &&
                      <div>
                        <p className='md:text-3xl text-xl'>Seasons: </p>
                        <div className='grid grid-cols-5 gap-2 mt-3 place-items-center text-center p-3 truncate'>
                          {movieDetails.seasons.map(season => {
                            if (season.name === 'Specials') {
                              return null;
                            }
                            return (
                              <div key={season.id}>
                                <img
                                  src={`${imageBaseUrl}w154${season.poster_path}`}
                                  alt={season.name} />
                                <p>{season.name}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    }
                  </div>
                )
              }
            </div>
          </div>

        </div>
      )
      }
    </main>
  )
}