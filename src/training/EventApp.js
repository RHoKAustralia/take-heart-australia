import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import EventbriteEmbed from './EventbriteEmbed';

const getEventIdsFromFilter2 = filters => {
  // if all filters are falsy, don't show anything
  const allFiltersEmpty = !Object.values(filters).some(Boolean);
  if (allFiltersEmpty) {
    return null;
  }

  return (
    window.eventsData
      // filter the eventData based on the filters object passed in
      .filter(eventData => {
        const getFilterResultFromFilterKey = key => {
          const toCompareValue = filters[key];
          // if the value of the filter is blank
          // we assume that the filter is not yet selected, so return true
          if (!toCompareValue) {
            return true;
          }
          return eventData[key] === toCompareValue;
        };

        // return combined result of all filters applied to current eventData
        return Object.keys(filters)
          .map(getFilterResultFromFilterKey)
          .every(Boolean);
      })
      .map(filteredEventData => {
        return filteredEventData.id;
      })
  );
};

const getEventIdsFromFilter = ({ region }) => {
  return window.eventsData.filter(eventData => eventData.region === region).map(x => x.id);
};

const getEventbriteEmbed = id => {
  return (
    <li className="event-list" key={id}>
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

const EventApp = ({
  appliedFilters,
  applyFilter,
  selectedFilters,
  regionOnSelect,
  localized_address_displayOnSelect,
  startDateOnSelect
}) => {
  const regionOptions = createDropdownOptions('region');
  const localized_address_displayOptions = createDropdownOptions('localized_address_display');
  const startDateOptions = createDropdownOptions('startDate');

  const eventsId = getEventIdsFromFilter2(appliedFilters);
  return (
    <div>
      <label className="event-label">
        <span className="event-label-text">State:</span>
        <Select name="region-select" value={selectedFilters.region} onChange={regionOnSelect} options={regionOptions} />
      </label>
      <label className="event-label">
        <span className="event-label-text">Venue:</span>
        <Select
          name="venue-select"
          value={selectedFilters.localized_address_display}
          onChange={localized_address_displayOnSelect}
          options={localized_address_displayOptions}
        />
      </label>
      <label className="event-label">
        <span className="event-label-text">Date:</span>
        <Select
          name="date-select"
          value={selectedFilters.startDate}
          onChange={startDateOnSelect}
          options={startDateOptions}
        />
      </label>
      <button className="event-filter-apply" onClick={applyFilter}>Apply</button>
      <ul>{eventsId && eventsId.map(getEventbriteEmbed)}</ul>
    </div>
  );
};

export default EventApp;
