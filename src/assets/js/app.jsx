import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import DayDestinations from './components/DayDestinations';
import TopRanking from './components/TopScore';
import MostWatched from './containers/MostWatched';

const reactAppContainer = document.getElementById('react-app');
const destinationsContainer = document.getElementById('react-destinations');
const reactTopContainer = document.getElementById('react-itineraries-top');
const mostWatchedContainer = document.getElementById('most-watched');

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}

if (destinationsContainer) {
  ReactDOM.render(<DayDestinations />, destinationsContainer);
}

if (reactTopContainer) {
  ReactDOM.render(<TopRanking />, reactTopContainer);
}

if (mostWatchedContainer) {
  ReactDOM.render(<MostWatched />, mostWatchedContainer);
}
