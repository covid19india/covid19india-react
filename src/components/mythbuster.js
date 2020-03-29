import React from 'react';
import Deck from './deck/Deck';

function MythBuster() {
  return (
    <div style={{height: '70vh'}}>
      <h2 style={{textAlign: 'center'}}>
        There is a lot of false information around, these are few facts from
        trusted sources.
      </h2>
      <div id="deck">
        <Deck />
      </div>
    </div>
  );
}

export default MythBuster;
