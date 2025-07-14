import { Routes, Route } from 'react-router-dom';
import { MainPage, MoviePage } from '@pages';

function App() {
  
  return (
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/favourite' element={<MainPage />} />
      <Route path='/movie/:id' element={<MoviePage />} />
    </Routes>
  )
}

export default App
