/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';

export default class TopRanking extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      todos_date: [],
      currentPage: 1,
      todosPerPage: 3,
      showing: 'score',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    console.log('--------------·························---------------Before');
    let todos = await fetch('/api/itineraries/list_by_score', { Headers }).then(response => response.json());
    todos = todos.data;
    let todos_date = await fetch('/api/itineraries/list_by_date', { Headers }).then(response => response.json());
    todos_date = todos_date.data;
    console.log('--------------·························---------------DONE');
    console.log(todos);
    this.setState({ todos, todos_date });
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id),
    });
    console.log(event.target.id);
    console.log('la anterior');
    if (event.target.id === 'date') {
      this.setState({        
        showing: 'date',
        currentPage: 1,
      });
    }
    if (event.target.id === 'score') {
      this.setState({        
        showing: 'score',
        currentPage: 1,
      });
    }
  }

  render() {
    const { todos, todos_date, currentPage, todosPerPage } = this.state;
    console.log('--------------·························---------------NEXT');

    console.log(todos);

    // Logic for displaying current todos
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

    // eslint-disable-next-line react/no-array-index-key
    // eslint-disable-next-line arrow-body-style
    const renderTodos = currentTodos.map((itinerary, index) => {
      // eslint-disable-next-line react/no-array-index-key
      const stars = itinerary.attributes['avg-score'];
      return (
        <center>
        <div className="itinerary-top-list-container">
          <div className="itinerary-top-list-container__info">
            <div className="itinerary-top-list-container__info__title">
              <div><a href={"/itineraries/" + itinerary.id}> {itinerary.attributes['itinerary-name']} </a></div>
            </div>
          </div>
          <div className="itinerary-top-list-container__info__summary" id={itinerary.attributes['itinerary-name']}>
            <div id="dates">{itinerary.attributes['start-date'] + '-' + itinerary.attributes['end-date']}</div>
            <div id="budget">{'$' + itinerary.attributes['budget'] +  'USD'}</div>
            <div id="score">Score: {stars}</div>
          </div>
        </div>
        </center>
      );
    });


    // Logic for displaying current todos
    const indexOfLastTodo_date = currentPage * todosPerPage;
    const indexOfFirstTodo_date = indexOfLastTodo - todosPerPage;
    const currentTodos_date = todos_date.slice(indexOfFirstTodo_date, indexOfLastTodo_date);

    // eslint-disable-next-line react/no-array-index-key
    // eslint-disable-next-line arrow-body-style
    const renderTodos_date = currentTodos_date.map((itinerary, index) => {
      // eslint-disable-next-line react/no-array-index-key
      const stars = itinerary.attributes['avg-score'];
      return (
      <center>
        <div className="itinerary-top-list-container">
          <div className="itinerary-top-list-container__info">
            <div className="itinerary-top-list-container__info__title">
              <div><a href={"/itineraries/" + itinerary.id}> {itinerary.attributes['itinerary-name']} </a></div>
            </div>
          </div>
          <div className="itinerary-top-list-container__info__summary" id={itinerary.attributes['itinerary-name']}>
            <div id="dates">{itinerary.attributes['start-date'] + '-' + itinerary.attributes['end-date']}</div>
            <div id="budget">{'$' + itinerary.attributes['budget'] +  'USD'}</div>
            <div id="score">Score: {stars}</div>
          </div>
        </div>
      </center>
      );
    });

    // Logic for displaying page numbers
    const pageNumbers = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <li
        key={number}
        id={number}
        onClick={this.handleClick}
      >
        {number}
      </li>
    ));
    
    if (this.state.showing === 'score') {
      return (
        <div>
          <center>
          <h1>The Top 15</h1>
          </center>
          <div class="title-container">
            <h2>Sort by:</h2>
            <div class="choose-category-underlined"><h2 id={'score'} onClick={this.handleClick} >Score</h2></div>
            <div class="choose-category"><h2 id={'date'} onClick={this.handleClick}>Date</h2></div>
          </div>
          <div className="itinerary-list">
            <ul>
              {renderTodos}
            </ul>
          </div>
          <center>
          <div id="number-container">
            <ul id="page-numbers">
                {renderPageNumbers}
            </ul>
          </div>
          </center>
        </div>
      );
    }
    if (this.state.showing === 'date') {
      return (
        <div>
          <center>
          <h1>The Top 15</h1>
          </center>
          <div class="title-container">
            <h2>Sort by:</h2>
            <div class="choose-category"><h2 id={'score'} onClick={this.handleClick}>Score</h2></div>
            <div class="choose-category-underlined"><h2 id={'date'} onClick={this.handleClick}>Date</h2></div>
          </div>
          <div className="itinerary-list">
            <ul>
              {renderTodos_date}
            </ul>
          </div>
          <center>
          <div id="number-container">
            <ul id="page-numbers">
                {renderPageNumbers}
            </ul>
          </div>
          </center>
        </div>
      );
    }
  }
}

TopRanking.propTypes = {
};
