import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { compose, withProps, withStateHandlers } from 'recompose';
import EventbriteEmbed from './EventbriteEmbed';

const a = filters => {
  // if all filters are falsy, don't show anything
  const allFiltersEmpty = !filters.some(Boolean);
  if (allFiltersEmpty) {
    return null;
  }
};

const getEventIdsFromFilter = ({ region }) => {
  return window.eventsData.filter(eventData => eventData.region === region).map(x => x.id);
};

const getEventbriteEmbed = id => {
  return (
    <li key={id}>
      <EventbriteEmbed id={id} />
    </li>
  );
};

const createDropdownOptions = keyName => {
  const regionList = new Set(window.eventsData.map(eventData => eventData[keyName]));
  return [...regionList].map(region => {
    return {
      value: region,
      label: region
    };
  });
};

const EventApp = ({ applied, applyFilter, selected, dropdownSelectRegion, setShownFilters }) => {
  const regionOptions = createDropdownOptions('region');
  return (
    <div>
      <label>
        State:
        <Select name="state-select" value={selected.region} onChange={dropdownSelectRegion} options={regionOptions} />
      </label>
      <button onClick={applyFilter}>Apply</button>
      <ul>{getEventIdsFromFilter({ region: applied.region }).map(getEventbriteEmbed)}</ul>
    </div>
  );
};

const enhance = compose(
  withStateHandlers(
    {
      selected: {
        region: ''
      },
      applied: {
        region: ''
      }
    },
    {
      dropdownSelectRegion: ({ selected }) => selectInput => ({
        selected: {
          ...selected,
          region: selectInput.value
        }
      }),
      // moving all selected filters to applied filters
      applyFilter: ({ selected }) => () => ({
        applied: { ...selected }
      })
    }
  )
);
const App = enhance(EventApp);

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
  ReactDOM.render(<App />, document.getElementById('react'));
});
