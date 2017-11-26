import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { compose, withProps, withStateHandlers } from 'recompose';
import EventbriteEmbed from './EventbriteEmbed';

const getEventIdsFromFilter2 = filters => {
  // if all filters are falsy, don't show anything
  const allFiltersEmpty = !Object.values(filters).some(Boolean);
  if (allFiltersEmpty) {
    return null;
  }

  return window.eventsData
    // filter the eventData based on the filters object passed in
    .filter(eventData => {

      const getFilterResultFromFilterKey = key => {
        const toCompareValue = filters[key];
        // if the value of the filter is blank
        // we assume that the filter is not yet selected, so return true
        if (!toCompareValue) {
          return true;
        }
        console.log('inside each filter key', toCompareValue, eventData[key], eventData[key] === toCompareValue);
        return eventData[key] === toCompareValue;
      };

      console.log('FILTERING EVENTS DATA, inside each event data', eventData, 'result:', Object.keys(filters).map(getFilterResultFromFilterKey).every(Boolean))
      
      return Object.keys(filters).map(getFilterResultFromFilterKey).every(Boolean)
    })
    .map(filteredEventData => {
      console.log('FILTERED EVENT DATA', filteredEventData)
      return filteredEventData.id
    });
};

const getEventIdsFromFilter = ({ region }) => {
  return window.eventsData.filter(eventData => eventData.region === region).map(x => x.id);
};

const getEventbriteEmbed = id => {
  console.log('get event brite embed', id);
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

const EventApp = ({ appliedFilters, applyFilter, selectedFilters, dropdownSelectRegion }) => {
  const regionOptions = createDropdownOptions('region');
  const eventsId = getEventIdsFromFilter2(appliedFilters);
  console.log('events id', eventsId);
  return (
    <div>
      <label>
        State:
        <Select
          name="state-select"
          value={selectedFilters.region}
          onChange={dropdownSelectRegion}
          options={regionOptions}
        />
      </label>
      <button onClick={applyFilter}>Apply</button>
      <ul>{eventsId && eventsId.map(getEventbriteEmbed)}</ul>
    </div>
  );
};

const enhance = compose(
  withStateHandlers(
    {
      selectedFilters: {
        region: ''
      },
      appliedFilters: {
        region: ''
      }
    },
    {
      dropdownSelectRegion: ({ selectedFilters }) => selectInput => ({
        selectedFilters: {
          ...selectedFilters,
          region: selectInput.value
        }
      }),
      // moving all selectedFilters to appliedFilters filters
      applyFilter: ({ selectedFilters }) => () => ({
        appliedFilters: { ...selectedFilters }
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
