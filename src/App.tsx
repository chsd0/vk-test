import { Routes, Route } from 'react-router-dom';
import { MainPage, MoviePage } from '@pages';
import type { movieCard } from '@components/MovieCard/types';

function App() {
  const props: movieCard = {
      id: 1,
      title: 'Небо острова',
      releaseDate: '2012',
      rating: 8.2,
      imdbRating: 9.5,
      imgUrl: 'exmpl.webp',
      description: 'Один ушлый американец ещё со студенческих лет приторговывал наркотиками, а теперь придумал схему нелегального обогащения с использованием поместий обедневшей английской аристократии и очень неплохо на этом разбогател. Другой пронырливый журналист приходит к Рэю, правой руке американца, и предлагает тому купить киносценарий, в котором подробно описаны преступления его босса при участии других представителей лондонского криминального мира — партнёра-еврея, китайской диаспоры, чернокожих спортсменов и даже русского олигарха.',
      genres: ['криминал', 'драма']
  }

  return (
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/favourite' element={<MainPage />} />
      <Route path='/movie/:id' element={<MoviePage />} />
    </Routes>
  )
}

export default App
