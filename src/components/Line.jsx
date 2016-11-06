import React, {Component} from 'react';

const Line = (data) => {

    let {path, id} = data;

    return (
        <path
            d={path}
            id={id}
            fill={'none'}
            stroke={'blue'}
            strokeWidth={3}
        />
    );
};


Line.propTypes = {
    path: React.PropTypes.string.isRequired,
    stroke: React.PropTypes.string,
    strokeWidth: React.PropTypes.number
};

export default Line;