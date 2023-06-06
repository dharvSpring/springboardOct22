import { BrowserRouter } from 'react-router-dom';
import './App.css';
import JoblyHome from './JoblyHome';

import NavBar from './NavBar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <main>
          <JoblyHome />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
