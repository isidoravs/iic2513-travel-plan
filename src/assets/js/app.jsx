import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import DayDestinations from './components/DayDestinations';

const reactAppContainer = document.getElementById('react-app');
const destinationsContainer = document.getElementById('react-destinations');

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}

if (destinationsContainer) {
  ReactDOM.render(<DayDestinations />, destinationsContainer);
}
