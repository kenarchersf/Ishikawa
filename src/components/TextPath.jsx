import React, {Component} from 'react';

const TextPath = (data) => {

    let {xlinkhref, branchtext} = data;

    return (
        <text style={{
            fontFamily: "Verdana",
            fontSize: "42.5px",
            textAlign: "right"
        }}>
            <textPath xlinkHref={xlinkhref}>
                {branchtext}
            </textPath>
        </text>
    );
};

TextPath.propTypes = {
    xlinkhref: React.PropTypes.string,
    branchtext: React.PropTypes.string
};

export default TextPath;