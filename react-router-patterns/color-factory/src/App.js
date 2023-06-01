import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Nav from './Nav';
import ColorPicker from './ColorPicker';
import NewColor from './NewColor';
import CurrentColor from './CurrentColor';
import { useState } from 'react';

function App(defaultColors) {
  const [colors, setColors] = useState(defaultColors);

  const handleAddColor = ({name, hex}) => {
    setColors(prevColors => ({
      ...prevColors,
      [name]: hex,
    }));
  }

  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path='/colors' Component={() => ColorPicker(colors)} />
        <Route path='/colors/new' Component={() => NewColor(handleAddColor)} />
        <Route path='/colors/:color' Component={() => CurrentColor(colors)} />
        <Route path='/*' Component={() => <Navigate to='/colors' />} />
      </Routes>
    </div>
  );
}

App.defaultProps = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
};

export default App;
