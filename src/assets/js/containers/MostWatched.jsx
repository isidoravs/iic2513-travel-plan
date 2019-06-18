import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ItineraryComponent from '../components/Itinerary';
import ItineraryTextComponent from '../components/ItineraryText';

export default class MostWatched extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      displayText: false,
      currentItineraryText: undefined,
      topIds: [],
      mostWatchesItineraries: [],
    };

    this.showText = this.showText.bind(this);
    this.hideText = this.hideText.bind(this);
  }

  componentDidMount() {
    this.fetchTopIds();
  }

  async fetchTopIds() {
    this.setState({ loading: true });
    const topIds = await fetch('../api/itineraries/top')
      .then(response => response.json());
    this.setState({ loading: false, topIds });
    this.fetchMostWatchedItineraries();
  }

  async fetchMostWatchedItineraries() {
    this.setState({ loading: true });
    const mostWatchesItineraries = await Promise.all(
      this.state.topIds.map(id => fetch(`../api/itineraries/${id}/summary`)
        .then(response => response.json())),
    );
    this.setState({ loading: false, mostWatchesItineraries });
  }

  async fetchItineraryText(id) {
    this.setState({ loading: true });
    const currentItineraryText = await fetch(`../api/itineraries/${id}/text`)
      .then(response => response.json());
    this.setState({ loading: false, currentItineraryText });
  }

  async showText(itineraryId) {
    await this.fetchItineraryText(itineraryId);
    this.setState({ displayText: true });
  }

  hideText() {
    this.setState({ displayText: false });
  }

  render() {
    let body = null;

    if (this.state.loading) {
      body = <p>Loading...</p>;
    } else if (this.state.displayText) {
      const { data } = this.state.currentItineraryText;
      body = <ItineraryTextComponent itineraryName={data.attributes['itinerary-name']} description={data.attributes.description} destinations={data.attributes.destinations} onClick={this.hideText} />;
    } else {
      body = this.state.mostWatchesItineraries.map(
        itinerary => <ItineraryComponent {...itinerary} onClick={this.showText} />,
      );
    }

    return (
      <div>
        <h1>Top 10 Itineraries</h1>
        <div className="react-list">
          {body}
        </div>
      </div>
    );
  }
}

// MostWatched.propTypes = {
//   mostWatched: PropTypes.arrayOf(PropTypes.number).isRequired,
// };
