import React from 'react';

const EventbriteEmbed = ({ id }) => {
  return (
    <div style={{ width: '100%', textAlign: 'left' }}>
      <iframe
        src={`//eventbrite.com.au/tickets-external?eid=${id}&ref=etckt`}
        frameBorder="0"
        height="400"
        width="100%"
        vspace="0"
        hspace="0"
        marginHeight="5"
        marginWidth="5"
        scrolling="auto"
        allowtransparency="true"
      />
      <div
        style={{
          fontFamily: 'Helvetica, Arial',
          fontSize: '12px',
          padding: '10px 0 5px',
          margin: '2px',
          width: '100%',
          textAlign: 'left'
        }}
      >
        <a
          className="powered-by-eb"
          style={{ color: '#ADB0B6', textDecoration: 'none' }}
          target="_blank"
          href="http://www.eventbrite.com.au/"
        >
          Powered by Eventbrite
        </a>
      </div>
    </div>
  );
};

export default EventbriteEmbed;
