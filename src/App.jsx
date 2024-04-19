import { useRef, useState, useEffect } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import { sortPlacesByDistance } from './loc.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIds.map(id=>AVAILABLE_PLACES.find(place=>place.id === id));
function App() {
  // const modal = useRef();
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  //2. putting this here also not efficient as it executes on each app component render
  // const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
  // const storedPlaces = storedIds.map(id=>AVAILABLE_PLACES.find(place=>place.id === id));
  //causes an infinite loop without useEffect
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
//1This use effect is redundant as the localStorage function is synchronous and we get the values even before the App render
  // useEffect(()=> {
  //   const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
  //   const storedPlaces = storedIds.map(id=>AVAILABLE_PLACES.find(place=>place.id === id));
  //   setPickedPlaces(storedPlaces);
  // }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    // modal.current.open();
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
    // modal.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces(prevPickedPlaces => {
      if (prevPickedPlaces.some(place => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find(place => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    //Not every side effects need useEffect!!!
    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedIds]));
    }
  }

  function handleRemovePlace() {
    setPickedPlaces(prevPickedPlaces =>
      prevPickedPlaces.filter(place => place.id !== selectedPlace.current)
    );
    // modal.current.close();
    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem('selectedPlaces',JSON.stringify(storedIds.filter(id=>id!==selectedPlace.current)));
  }

  return (
    <>
      {/* <Modal ref={modal}> */}
      <Modal open = {modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          // places={AVAILABLE_PLACES}
          fallbackText="Sorting Placed By Distance ..... "
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
