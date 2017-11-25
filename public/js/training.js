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

// document.addEventListener('DOMContentLoaded', fetchEventbriteEvents);
