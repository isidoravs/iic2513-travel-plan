import React from 'react';
import PropTypes from 'prop-types';

export default function ItineraryText(props) {
  const {
    itineraryName, description, destinations,
  } = props;
  return (
    <div className="react-info itinerary-list-container">
      <div className="itinerary-list-container__info">
        <div className="itinerary-list-container__info__title">{itineraryName}</div>
        <div className="react-info__description">
          {description}
        </div>
        <div className="day-container__destinations">
          {destinations.map(d => <div className="one-destination-react">{d.destinationName}</div>)}
        </div>
        <div>
          <button type="submit" className="react-info__back" onClick={props.onClick}>Back</button>
        </div>
      </div>
    </div>
  );
}

ItineraryText.propTypes = {
  itineraryName: PropTypes.string.isRequired,
  description: PropTypes.string,
  destinations: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};
