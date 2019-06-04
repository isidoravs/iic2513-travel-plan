// https://react-select.com/creatable
import React, { Component } from 'react';

import CreatableSelect from 'react-select/creatable';

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];

export default class DayDestinations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      destinations: [],
    };
  }

  async componentDidMount() {
    const allDestinations = await fetch('/api/destinations', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => response.json());

    this.setState({ destinations: allDestinations.data });
  }

  handleChange(event) {
    console.log(JSON.stringify(this.state));
    fetch('/api/destinations', {
      method: 'post',
      body: JSON.stringify(event),
    });
  }

  // handleChange = (newValue, actionMeta) => {
  //   console.group('Value Changed');
  //   console.log(newValue);
  //   console.log(`action: ${actionMeta.action}`);
  //   console.groupEnd();
  // };
  render() {
    const { destinations } = this.state;

    const destinationsJSON = destinations.map(dest => ({
      value: dest.id,
      label: dest.attributes['destination-name'],
    }));

    if (!destinations) return <p>Loading destinations...</p>;
    return (
      <CreatableSelect
        isMulti
        placeholder="Search destinations"
        onChange={this.handleChange}
        options={destinationsJSON}
      />
    );
  }
}
