import React, {Component} from 'react';

// Icon
const IconRemove = (data) => {

    let {xmin, ymin, xmax, ymax, points, branch} = data;

    function coordinates(points) {
        if (points[1].y > points[0].y) {
            return `${(xmin + 12) * -1.5} ${(ymin - 12) * -1.5} 900 900`
        } else if (points[1].y < points[0].y) {
            return `${(xmin + 12) * -1.5} ${(ymin - 12) * -1.5} 900 900`
        } else if (points[0].x == 0) {
            return `${xmin - 12} ${ymin} 0 0`
        } else {
            return `${(xmin - 12) * -1.5} ${(ymin) * -1.5} 900 900`
        }
    }

    return (
        <svg className="remove" onClick={data.onClick.bind(null, branch)} fill="#000000" viewBox={coordinates(points)} height="600"
             width="600" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path
                d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
    )
};

IconRemove.propTypes = {
    xmin: React.PropTypes.number,
    ymin: React.PropTypes.number,
    xmax: React.PropTypes.number,
    ymax: React.PropTypes.number,
    branch: React.PropTypes.string,
    points: React.PropTypes.array
};

// which makes this reusable component for other views
export default IconRemove;