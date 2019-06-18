import React from 'react';
import PropTypes from 'prop-types';

export default function Itinerary(props) {
  const { data } = props;
  return (
    <div className="react-container itinerary-list-container">
      <div className="itinerary-list-container__info">
        <div className="itinerary-list-container__info__title">{data.attributes['itinerary-name']}</div>
        <div className="itinerary-list-container__info__summary">
          <div id="dates">
            {data.attributes['start-date']}
            {' - '}
            {data.attributes['end-date']}
          </div>
          <div id="budget">${data.attributes.budget} USD</div>
          <div id="score">Score: {data.attributes['avg-score']}</div>
        </div>
        <div>
          <button type="submit" className="react-container__btn" onClick={() => props.onClick(data.id)}>Show more</button>
        </div>
      </div>
    </div>
  );
}

Itinerary.propTypes = {
  // id: PropTypes.number.isRequired,
  // itineraryName: PropTypes.string.isRequired,
  // budget: PropTypes.number.isRequired,
  // avgScore: PropTypes.number.isRequired,
  // startDate: PropTypes.instanceOf(Date).isRequired,
  // endDate: PropTypes.instanceOf(Date).isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};
