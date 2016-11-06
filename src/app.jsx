import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Line from './components/Line';
import TextPath from './components/TextPath';
import IconAdd from './components/IconAdd';
import IconRemove from './components/IconRemove';
import DataSeries from './components/DataSeries';

const LineChart = React.createClass({

  propTypes: {
    width:  React.PropTypes.number,
    height: React.PropTypes.number,
    data:   React.PropTypes.object.isRequired,
    colors:             React.PropTypes.func,
    interpolationType:  React.PropTypes.string
  },

  getDefaultProps(){
    return {
      width:  600,
      height: 600,
      interpolationType:  'linear',
      colors:             d3.scale.category10(),  
      xScale:             React.PropTypes.func,
      yScale:             React.PropTypes.func
    }
  },


//   getInitialState: function() {
//     return {data: {branch: 1, name: "", points: [], children: [ 
//    { branch: 2, name: "Second cause", points: [], children: [
//      { branch: 3, name: "Third cause", points: [], children: [
//        { branch: 20, name: "Third level", points: [], children: [] },
//        { branch: 21, name: "Third level2", points: [], children: [] },
//        { branch: 22, name: "Third level3", points: [], children: [] }
//      ] }
//    ] },
//    { branch: 4, name: "Fourth cause", points: [], children: [
//      { branch: 5, name: "Fifth cause", points: [], children: [] },
//      { branch: 6, name: "Sixth cause", points: [], children: [] }
//    ] },
//    { branch: 7, name: "Seventh cause", points: [], children: [] }, 
//    { branch: 8, name: "Eighth cause", points: [], children: [] },
//    { branch: 9, name: "Ninth cause", points: [], children: [] },
//    { branch: 10, name: "Tenth cause", points: [], children: [] }]
// }};
//   },

  getInitialState: function() {
    return {data: {branch: guid(), name: null, points: [], children: []}}
  },

  handleCauseAdd: function(branchId) {
    // Add state to a variable, 
    var stateVar = this.state;
    // find branch in state with branch value that matches value from event handler, 
    // push new branch,
    if (stateVar.data.branch==branchId)
    {stateVar.data.children.push({branch: guid(), name: "", points: [], children: []}),
    this.setState({data: stateVar.data})
    return;}

    for (var i=0; i<stateVar.data.children.length; i++) {
        if (stateVar.data.children[i].branch==branchId) 
        {stateVar.data.children[i].children.push({branch: guid(), name: "", points: [], children: []}),
        this.setState({data: stateVar.data})
        return;};
    for (var j=0; j<stateVar.data.children[i].children.length; j++) {
        if (stateVar.data.children[i].children[j].branch==branchId) 
        {stateVar.data.children[i].children[j].children.push({branch: guid(), name: "", points: [], children: []}),
        this.setState({data: stateVar.data})
        return;};

    for (var k=0; k<data.children[i].children[j].children.length; k++) {
        if (stateVar.data.children[i].children[j].children[k].branch==branchId) 
        {stateVar.data.children[i].children[j].children[k].children.push({branch: guid(), name: "", points: [], children: []}),
        this.setState({data: stateVar.data})
        return;};
  }}}},

  handleCauseRemove: function(branchId) {
    // Add state to a variable, 
    var stateVar = this.state;
    // find branch in state with branch value that matches value from event handler, 
    // push new branch,
    if (stateVar.data.branch==branchId)
    {this.setState({data: stateVar.data})
    return;}

    for (var i=0; i<stateVar.data.children.length; i++) {
        if (stateVar.data.children[i].branch==branchId) 
        {stateVar.data.children.splice(i,1),
        this.setState({data: stateVar.data})
        return;};
    for (var j=0; j<stateVar.data.children[i].children.length; j++) {
        if (stateVar.data.children[i].children[j].branch==branchId) 
        {stateVar.data.children[i].children.splice(j,1),
        this.setState({data: stateVar.data})
        return;};

    for (var k=0; k<data.children[i].children[j].children.length; k++) {
        if (stateVar.data.children[i].children[j].children[k].branch==branchId) 
        {stateVar.data.children[i].children[j].children.splice(k,1),
        this.setState({data: stateVar.data})
        return;};
  }}}},

  handleCauseSubmit: function(cause) {
    // TODO: submit to the server and refresh the list
  },

   componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  
  render() {
    //injectTapEventPlugin();
    
    let { width, height, data,  colors, interpolationType} = this.props;

    let xScale = d3.scale.linear()
      .domain([0,55])
      .range([0, width]);

    let yScale = d3.scale.linear()
      .domain([0,55])
      .range([0, height]);

    let line = d3.svg.line()
      .interpolate(interpolationType)
      .x((d) => { return xScale(d.x); })
      .y((d) => { return yScale(d.y); });
   
   function rows (data) {
       var branches = [];
       branches.push(data);
       for (var i=0; i<data.children.length; i++) {
        branches.push(data.children[i]);

        for (var j=0; j<data.children[i].children.length; j++) {
        branches.push(data.children[i].children[j])

        for (var k=0; k<data.children[i].children[j].children.length; k++) {
        branches.push(data.children[i].children[j].children[k])
      
        };
       };
       };
      return branches;
      };

     let lines = rows(plot(this.state.data)).map((series, id) => {
      return (
        <g>
        <Line
          path={line(series.points)}
          seriesName={series.name}
          id={series.branch}
          //stroke={colors(id)}
          stroke='steelblue'
          key={id}
        />
        <TextPath
          xlinkhref={"#"+series.branch}
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

});

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

let data = {};

function isEven(n) {
   return n % 2 == 0;
};

function level(n) {
   return Math.round((1+n)/2);
};

function sign(a,b) {
   if (a-b<0)
    {return -1}
   else {return 1};
}

function shiftUp(item) {
    item.x-=5;
    item.y-=5;
}

function horizLength (branch) {
  return branch.points[1].x-branch.points[0].x;
}

// Assign coordinates to horizontal branches from left to right
function horizBranch(parent,n) {
   var points = [];
     {points.push({x: parent.points[1].x-10-(5*(n+1)), y: parent.points[1].y+((n+1)*5*sign(parent.points[0].y,parent.points[1].y)) },{x: parent.points[1].x-(5*(n+1)), y: parent.points[1].y+((n+1)*5*sign(parent.points[0].y,parent.points[1].y))});}
 return points;
};

// Assign coordinates to diagonal branches from outside to inside
function diagBranch(parent,n) {
   var points = [];
    // Diagonal branches on top, then on bottom
    if (parent.points[0].y<25) 
     {points.push({x: parent.points[1].x-7-(5*(n+1)), y: parent.points[1].y-7},{x: parent.points[1].x-(5*(n+1)), y: parent.points[1].y});}
    else
     {points.push({x: parent.points[1].x-7-(5*(n+1)), y: parent.points[1].y+7},{x: parent.points[1].x-(5*(n+1)), y: parent.points[1].y});}
 return points;
};

function plot (data) {
  data.points.push({ x: 0, y: 25 }, { x: 55, y: 25 });

  // Assign coordinates to Level 1 branches
  for (var i=0; i<data.children.length; i++) {
    // Even diagonal branches on top, odd on bottom
    if (isEven(i)==true)
      {data.children[i].points.push({ x: 50-(7*level(i)), y: 18 }, { x: 57-(7*level(i)), y: 25 });}
    else
      {data.children[i].points.push({ x: 50-(7*level(i)), y: 32 }, { x: 57-(7*level(i)), y: 25 });}
  
  // Assign coordinates to Level 2 branches
    for (var j=0; j<data.children[i].children.length; j++) {
      Array.prototype.push.apply(data.children[i].children[j].points, horizBranch(data.children[i], j));
  
 // If a Level 2 branch is at end of Level 1 branch, extend the Level 1 branch
        if (isEven(i)==true && data.children[i].children[j].points[1].y<=data.children[i].points[0].y)
          {data.children[i].points[0].y-=5;
           data.children[i].points[0].x-=5}
        else if (isEven(i)==false && data.children[i].children[j].points[1].y>=data.children[i].points[0].y)
          {data.children[i].points[0].y+=5;
           data.children[i].points[0].x-=5};

   // Assign coordinates to Level 3 branches
    for (var k=0; k<data.children[i].children[j].children.length; k++) {
      Array.prototype.push.apply(data.children[i].children[j].children[k].points, diagBranch(data.children[i].children[j], k));
  
  // If a Level 3 branch is at end of Level 2 branch, extend the Level 2 branch
        if (isEven(i)==true && data.children[i].children[j].children[k].points[1].x<=data.children[i].children[j].points[0].x)
          {data.children[i].children[j].points[0].x-=5}
          // data.children[i].points[0].x-=5}
        else if (isEven(i)==false && data.children[i].children[j].points[1].y>=data.children[i].points[0].y)
          {data.children[i].points[0].y+=5;
           data.children[i].points[0].x-=5};

  // If a level 3 branch crosses the next Level 2 branch, move all subsequent Level 2 branches and their Level 3 branches
      //if (data.children[i].children.length>data.children[i].children[j] &&
      if (isEven(i)==true && data.children[i].children[j].children[k].points[0].y<=data.children[i].children[j+1].points[0].y)
        {data.children[i].points[0].x-=5;
          data.children[i].points[0].y-=5;
        for (var jj=j+1; jj<data.children[i].children.length; jj++) 
      {data.children[i].children[jj].points[0].x-=5;
       data.children[i].children[jj].points[0].y-=5;
       data.children[i].children[jj].points[1].x-=5;
       data.children[i].children[jj].points[1].y-=5;;
        console.log("debug");
        console.log(data.children[0].children[1].points[0]);
        console.log(data.children[0].children[1].points[1]);
        console.log(data.children[0].children[1].points[2]);
        console.log(data.children[0].children[1].points[3]);
        console.log(data); 
      };
       
    }
    };
  
  };
  };
  
        // If a Level 1 branch has a child, shift later Level 1 branches to the left
  for (var i=2; i<data.children.length; i++)  {
  if (data.children[i-2].children.length>0) {
      var maxLength=Math.max.apply(Math, data.children[i-2].children.map(horizLength));     
      for (var ia=i; ia<data.children.length; ia+=2) {
        data.children[ia].points[0].x-=(maxLength-3);
        data.children[ia].points[1].x-=(maxLength-3);
      }        
    }
  };

  return data;
 };

ReactDOM.render(
    <LineChart
    data={data}
    width={600}
    height={600}
    />,
  document.getElementById('app')
);
