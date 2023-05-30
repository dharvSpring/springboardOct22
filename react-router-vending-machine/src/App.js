import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';

import VendingMachine from './VendingMachine';
import Coke from './Coke';
import Doritos from './Doritos';
import Tuna from './Tuna';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="App-NavBar">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/coke">Coke</NavLink>
          <NavLink to="/doritos">Doritos</NavLink>
          <NavLink to="/tuna">Tuna</NavLink>
        </div>
        <Routes>
          <Route exact path='/' element={<VendingMachine />} />

          <Route exact path='/doritos' element={<Doritos />} />
          <Route exact path='/tuna' element={<Tuna />} />
          <Route exact path='/coke' element={<Coke />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
