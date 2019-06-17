import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import DayDestinations from './components/DayDestinations';
import TopRanking from './components/TopScore';


const reactAppContainer = document.getElementById('react-app');
const destinationsContainer = document.getElementById('react-destinations');
const reactTopContainer = document.getElementById('react-itineraries-top');


if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}

if (destinationsContainer) {
  ReactDOM.render(<DayDestinations />, destinationsContainer);
}

if (reactTopContainer) {
  ReactDOM.render(<TopRanking />, reactTopContainer);
}
