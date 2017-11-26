import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { compose, withState, withStateHandlers } from 'recompose';

const EventApp = ({ stateLocation, setStateLocation }) => {
  const locationStateOption = window.eventsData.map(eventData => {
    return {
      value: eventData.region,
      label: eventData.region,
    }
  })
  return (
    <div>
      <label>
        State:
        <Select
          name="state-select"
          value={stateLocation}
          onChange={setStateLocation}
          options={locationStateOption}
        />
      </label>
    </div>
  );
};

const enhance = compose(
  withState('stateLocation', 'setStateLocation', '')
)

const getQueryStringFromObj = obj => {
  const keyValues = Object.keys(obj).map(key => {
    return `${key}=${obj[key]}`;
  });
  return keyValues.join('&');
};

const fetchEventbriteEvents = e => {
  const userId = 236752695629;
  const apiUrl = 'https://www.eventbriteapi.com/v3/events/search';
  const queryString = {
    'user.id': 236752695629,
    token: 'QHZIGQMTINSSRO2NP7QU'
  };
  const url = `${apiUrl}?${getQueryStringFromObj(queryString)}`;

  fetch(url)
    .then(resp => {
      const eventIds = resp.events.map(event => event.id);
      window.ids = eventIds;
    })
    .catch(err => {});
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('HELLO');
  ReactDOM.render(<EventApp />, document.getElementById('react'));
});
