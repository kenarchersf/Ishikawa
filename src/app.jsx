import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Line from './components/Line';
import TextPath from './components/TextPath';
import IconAdd from './components/IconAdd';
import IconRemove from './components/IconRemove';

class LineChart extends Component {

    constructor(props) {
        super(props);

        this.handleCauseAdd = this.handleCauseAdd.bind(this);
        this.handleCauseRemove = this.handleCauseRemove.bind(this);

        this.state = {
            data: {
                branch: guid(),
                name: null,
                points: [],
                children: []
            }
        };
    };

    handleCauseAdd(branchId) {

        let {data} = this.state;

        let mock = {
            branch: guid(),
            name: "",
            points: [],
            children: [],
            position: true
        }, that = this;

        [data].map(i => {
            i.points = [];
            if (i.branch === branchId) {
                i.children.push(mock);
                that.setState({data: data});
            } else {
                child(i.children)
            }
        });

        function child(data) {
            data.map(i => {
                i.points = [];
                if (i.branch === branchId) {
                    i.children.push(mock);
                    that.setState(data);
                } else {
                    child(i.children)
                }
            });
        }
    }

    handleCauseRemove(branchId) {
        let {data} = this.state;
        let that = this;

        [data].map(i => {
            i.points = [];
            if (i.branch === branchId) {
                i.children.splice(i, 1);
                this.setState(data);
            } else {
                child(i.children)
            }
        }, this);

        function child(data) {
            data.map(i => {
                i.points = [];
                if (i.branch === branchId) {
                    i.children.splice(i, 1);
                    that.setState(data);
                } else {
                    child(i.children)
                }
            });
        }
    }

    componentDidMount() {
        // $.ajax({
        //     url: this.props.url,
        //     dataType: 'json',
        //     cache: false,
        //     success: function (data) {
        //         this.setState({data: data});
        //     }.bind(this),
        //     error: function (xhr, status, err) {
        //         console.error(this.props.url, status, err.toString());
        //     }.bind(this)
        // });
    }

    render() {

        let {width, height, interpolationType} = this.props;

        let xScale = d3.scale.linear()
            .domain([0, 55])
            .range([0, width]);

        let yScale = d3.scale.linear()
            .domain([0, 55])
            .range([0, height]);

        let line = d3.svg.line()
            .interpolate(interpolationType)
            .x((d) => {
                return xScale(d.x);
            })
            .y((d) => {
                return yScale(d.y);
            });

        function rows(data) {
            let branches = [];
            branches.push(data);

            function child(data) {
                if (data.length) {
                    data.map(v => {
                        branches.push(v);
                        child(v.children)
                    });
                }
            }

            child(data.children);

            return branches;
        }

        let lines = rows(plot(this.state.data)).map((series, id) => {
            return (
                <g key={id}>
                    <Line
                        path={line(series.points)}
                        seriesName={series.name}
                        id={series.branch}
                        stroke='steelblue'
                        key={id}
                    />
                    <TextPath
                        xlinkhref={"#" + series.branch}
                        branchtext={series.name}
                    />
                    <IconAdd
                        points={series.points}
                        xmin={xScale(series.points[0].x)}
                        ymin={yScale(series.points[0].y)}
                        xmax={xScale(series.points[1].x)}
                        ymax={yScale(series.points[1].y)}
                        branch={series.branch}
                        onClick={this.handleCauseAdd}
                    />
                    <IconRemove
                        points={series.points}
                        xmin={xScale(series.points[0].x)}
                        ymin={yScale(series.points[0].y)}
                        xmax={xScale(series.points[1].x)}
                        ymax={yScale(series.points[1].y)}
                        branch={series.branch}
                        onClick={this.handleCauseRemove}
                    />
                </g>
            );
        });

        return (
            <svg width={width} height={height}>
                <g>{lines}</g>
            </svg>
        );

    }

}

LineChart.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    data: React.PropTypes.object.isRequired,
    colors: React.PropTypes.func,
    interpolationType: React.PropTypes.string
};

LineChart.defaultProps = {
    width: 600,
    height: 600,
    interpolationType: 'linear',
    colors: d3.scale.category10(),
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

let data = {};

function isEven(n) {
    return n % 2 == 0;
}

function level(n) {
    return Math.round((1 + n) / 2);
}

function sign(a, b) {
    return a - b < 0 ? -1 : 1;
}

function shiftUp(item) {
    item.x -= 5;
    item.y -= 5;
}

function horizLength(branch) {
    return branch.points[1].x - branch.points[0].x;
}

function horizBranch(parent,n) {
    let points = [];
    points.push(
        {x: parent.points[1].x-10-(5*(n+1)), y: parent.points[1].y + ((n+1) * 5 * sign(parent.points[0].y,parent.points[1].y)) },
        {x: parent.points[1].x-(5*(n+1)), y: parent.points[1].y+((n+1)*5*sign(parent.points[0].y,parent.points[1].y))}
    );
    return points;
}

// Assign coordinates to diagonal branches from outside to inside
function diagBranch(parent,n) {
    let points = [];
    // Diagonal branches on top, then on bottom
    if (parent.points[0].y<25) {
        points.push(
            {x: parent.points[1].x-7-(5*(n+1)), y: parent.points[1].y-7},
            {x: parent.points[1].x-(5*(n+1)), y: parent.points[1].y}
        );
    }
    else {
        points.push(
            {x: parent.points[1].x-7-(5*(n+1)), y: parent.points[1].y+7},
            {x: parent.points[1].x-(5*(n+1)), y: parent.points[1].y}
        );
    }
    return points;
}

function plot(data) {
    data.points.push({x: 0, y: 25}, {x: 55, y: 25});

    for (let i = 0; i < data.children.length; i++) {

        if (isEven(i) == true) {
            data.children[i].points.push({x: 50 - (7 * level(i)), y: 18}, {x: 57 - (7 * level(i)), y: 25});
        } else {
            data.children[i].points.push({x: 50 - (7 * level(i)), y: 32}, {x: 57 - (7 * level(i)), y: 25});
        }

        for (let j = 0; j < data.children[i].children.length; j++) {

            Array.prototype.push.apply(data.children[i].children[j].points, horizBranch(data.children[i], j));

            if (isEven(i) == true && data.children[i].children[j].points[1].y <= data.children[i].points[0].y) {
                data.children[i].points[0].y -= 5;
                data.children[i].points[0].x -= 5
            } else if (isEven(i) == false && data.children[i].children[j].points[1].y >= data.children[i].points[0].y) {
                data.children[i].points[0].y += 5;
                data.children[i].points[0].x -= 5
            }

            for (let k = 0; k < data.children[i].children[j].children.length; k++) {

                Array.prototype.push.apply(data.children[i].children[j].children[k].points, diagBranch(data.children[i].children[j], k));

                if (isEven(i) == true && data.children[i].children[j].children[k].points[1].x <= data.children[i].children[j].points[0].x) {

                    data.children[i].children[j].points[0].x -= 5

                } else if (isEven(i) == false && data.children[i].children[j].points[1].y >= data.children[i].points[0].y) {

                    data.children[i].points[0].y += 5;
                    data.children[i].points[0].x -= 5
                }

                if (isEven(i) == true && data.children[i].children[j].children[k].points[0].y <= data.children[i].children[j].points[0].y) {

                    data.children[i].points[0].x -= 5;
                    data.children[i].points[0].y -= 5;

                    for (let jj = j; jj < data.children[i].children.length; jj++) {
                        data.children[i].children[jj].points[0].x -= 5;
                        data.children[i].children[jj].points[0].y -= 5;
                        data.children[i].children[jj].points[1].x -= 5;
                        data.children[i].children[jj].points[1].y -= 5;
                    }
                }
            }
        }
    }

    // If a Level 1 branch has a child, shift later Level 1 branches to the left
    for (let i = 2; i < data.children.length; i++) {
        if (data.children[i - 2].children.length > 0) {
            let maxLength = Math.max.apply(Math, data.children[i - 2].children.map(horizLength));
            for (let ia = i; ia < data.children.length; ia += 2) {
                data.children[ia].points[0].x -= (maxLength - 3);
                data.children[ia].points[1].x -= (maxLength - 3);
            }
        }
    }

    return data;
}

ReactDOM.render(
    <LineChart
        data={data}
        width={600}
        height={600}
    />,
    document.getElementById('app')
);