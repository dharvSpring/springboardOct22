import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Nav from './Nav';
import DogList from './DogList';
import DogDetails from './DogDetails';

import whiskey from './doggos/whiskey.jpg';
import duke from './doggos/duke.jpg';
import perry from './doggos/perry.jpg';
import tubby from './doggos/tubby.jpg';

function App({ dogs }) {
  return (
    <div className="App">
      <Nav dogs={dogs} />
      <Routes>
        <Route path='/dogs' Component={() => DogList(dogs)} />
        <Route path='/dogs/:name' Component={() => DogDetails(dogs)} />
        <Route path='/*' Component={() => <Navigate to='/dogs' />} />
      </Routes>
    </div>
  );
}

App.defaultProps = {
  dogs: [
    {
      name: "Whiskey",
      age: 5,
      src: whiskey,
      facts: [
        "Whiskey loves eating popcorn.",
        "Whiskey is a terrible guard dog.",
        "Whiskey wants to cuddle with you!"
      ]
    },
    {
      name: "Duke",
      age: 3,
      src: duke,
      facts: [
        "Duke believes that ball is life.",
        "Duke likes snow.",
        "Duke enjoys pawing other dogs."
      ]
    },
    {
      name: "Perry",
      age: 4,
      src: perry,
      facts: [
        "Perry loves all humans.",
        "Perry demolishes all snacks.",
        "Perry hates the rain."
      ]
    },
    {
      name: "Tubby",
      age: 4,
      src: tubby,
      facts: [
        "Tubby is really stupid.",
        "Tubby does not like walks.",
        "Angelina used to hate Tubby, but claims not to anymore."
      ]
    }
  ]
};

export default App;
