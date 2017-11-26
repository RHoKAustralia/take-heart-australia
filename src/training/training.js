import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, withStateHandlers } from 'recompose';
import EventApp from './EventApp';

export const FILTER_NAMES = ['region', 'startDate', 'localized_address_display'];

const generateFiltersInitialValue = (filterNames, initialValue = '') => {
  return filterNames.reduce((acc, filterName) => {
    acc[filterName] = '';
    return acc;
  }, {});
};

const generateDropdownOnChange = filterNames => {
  return filterNames.reduce((acc, filterKey) => {
    acc[`${filterKey}OnSelect`] = ({ selectedFilters }) => selectInput => ({
      selectedFilters: {
        ...selectedFilters,
        [filterKey]: selectInput.value
      }
    });
    return acc;
  }, {});
};

const enhance = compose(
  withStateHandlers(
    {
      selectedFilters: {
        ...generateFiltersInitialValue(FILTER_NAMES)
      },
      appliedFilters: {
        ...generateFiltersInitialValue(FILTER_NAMES)
      }
    },
    {
      ...generateDropdownOnChange(FILTER_NAMES),
      // moving all selectedFilters to appliedFilters filters
      applyFilter: ({ selectedFilters }) => () => ({
        appliedFilters: { ...selectedFilters }
      })
    }
  )
);

const App = enhance(EventApp);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('react'));
});
