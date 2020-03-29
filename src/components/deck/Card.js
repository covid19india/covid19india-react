import React from 'react';
import PropTypes from 'prop-types';
import {animated, interpolate} from 'react-spring/hooks';

class Card extends React.Component {
  render() {
    const {i, x, y, rot, scale, trans, bind, data} = this.props;
    const {pic, alt} = data[i];

    return (
      <animated.div
        id="card"
        key={i}
        style={{
          transform: interpolate(
            [x, y],
            (x, y) => `translate3d(${x}px,${y}px,0)`
          ),
        }}
      >
        <animated.div
          {...bind(i)}
          style={{
            transform: interpolate([rot, scale], trans),
          }}
        >
          <div id="card">
            <img className="card-img" src={pic} alt={alt} />
            {/* <p>Source: {source}</p> */}
          </div>
        </animated.div>
      </animated.div>
    );
  }
}

Card.propTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
  distance: PropTypes.string,
  text: PropTypes.string,
  pics: PropTypes.array,
};

export default Card;
