import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// Icon
const IconAdd = (data) => {

    let {xmin, ymin, xmax, ymax, points, branch} = data;

    function coordinates(points) {
        if (points[1].y > points[0].y) {
            return `${(xmin - 18) * -1.5} ${(ymin - 12) * -1.5} 900 900`
        } else if (points[1].y < points[0].y) {
            return `${(xmin - 24) * -1.5} ${(ymin - 12) * -1.5} 900 900`
        } else if (points[0].x == 0) {
            return `${(xmax - 18) * -1.5} ${(ymax - 24) * -1.5} 900 900`
        } else {
            return `${(xmin - 12) * -1.5} ${(ymin - 24) * -1.5} 900 900`
        }
    }

    return (
        <svg className="add" onClick={data.onClick.bind(null, branch)} fill="#000000" viewBox={coordinates(points)}
             height="600" width="600" xmlns="http://www.w3.org/2000/svg">
            <title id="title">{points[0].x}</title>
            <path d="M0 0h24v24H0z" fill="none"/>
            <path
                d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
    )
};

IconAdd.propTypes = {
    xmin: React.PropTypes.number,
    ymin: React.PropTypes.number,
    xmax: React.PropTypes.number,
    ymax: React.PropTypes.number,
    branch: React.PropTypes.string,
    points: React.PropTypes.array
};

// which makes this reusable component for other views
export default IconAdd;