import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7';

import './style.css';

const margin = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const radius = 50;
const xCenter1 = 50;
const yCenter1 = 50;

const offsetFactor = 1.2;
const offset = offsetFactor * radius;

const originX = xCenter1 + offset * 0.5;
const originY = yCenter1 + Math.sqrt(3) * offset * 0.5;

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('viewBox', '0 0 100 100')
  .style('background-color', 'gray');

const g = svg
  .append('g')
  .attr(
    'transform',
    `translate( ${-originX + radius + margin.left} , ${margin.right} )`
  );

const circleOne = g
  .append('circle')
  .attr('r', radius)
  // .attr('stroke', '#ffe41e')
  .attr('fill', 'none')
  .attr('transform', `translate( ${xCenter1} , ${yCenter1} )`);

const xCenter2 = xCenter1 + offset;

const circleTwo = g
  .append('circle')
  .attr('r', radius)
  // .attr('stroke', '#ffe41e')
  .attr('fill', 'none')
  .attr('transform', `translate( ${xCenter2} , ${yCenter1} )`);

const xCenter3 = xCenter1 + offset * 0.5;
const yCenter3 = yCenter1 + Math.sqrt(3) * offset * 0.5;
const circleThree = g
  .append('circle')
  .attr('r', radius)
  // .attr('stroke', '#ffe41e')
  .attr('fill', 'none')
  .attr('transform', `translate( ${xCenter3} , ${yCenter3} )`);

//compute first points of intersection
const triHeight = Math.sqrt(radius ** 2 - (offset / 2) ** 2);

//outer intersection of Circles 1 and 2
const xIsect1 = xCenter3;
const yIsect1 = yCenter1 - triHeight;

//inner intersection of Circles 1 and 2
const xIsect4 = xCenter3;
const yIsect4 = yCenter1 + triHeight;

//treat "triHeight" as the hypoteneuse of a 30.60.90 triangle.
//this tells us the shift from the midpoint of a leg of the triangle
//to the point of intersection
const xDelta = (triHeight * Math.sqrt(3)) / 2;
const yDelta = triHeight / 2;
const xMidpointC1C3 = (xCenter1 + xCenter3) / 2;
const xMidpointC2C3 = (xCenter2 + xCenter3) / 2;
const yMidpointBoth = (yCenter1 + yCenter3) / 2;

//find the rest of the points of intersection
const xIsect2 = xMidpointC1C3 - xDelta;
const yIsect2 = yMidpointBoth + yDelta;
const xIsect3 = xMidpointC2C3 + xDelta;
const yIsect3 = yMidpointBoth + yDelta;

const xIsect5 = xMidpointC1C3 + xDelta;
const yIsect5 = yMidpointBoth - yDelta;
const xIsect6 = xMidpointC2C3 - xDelta;
const yIsect6 = yMidpointBoth - yDelta;

const xPoints = [xIsect1, xIsect2, xIsect3, xIsect4, xIsect5, xIsect6];
const yPoints = [yIsect1, yIsect2, yIsect3, yIsect4, yIsect5, yIsect6];

const makeIronShapes = ([x1, x2, x3, y1, y2, y3]) => {
  const path = `M ${x1} ${y1}
             A ${radius} ${radius} 0 0 1 ${x2} ${y2}
             A ${radius} ${radius} 0 0 0 ${x3} ${y3}
             A ${radius} ${radius} 0 0 1 ${x1} ${y1}`;
  return path;
};

const makeSunShapes = ([x1, x2, x3, y1, y2, y3]) => {
  const path = `M ${x1} ${y1}
             A ${radius} ${radius} 0 0 0 ${x2} ${y2}
             A ${radius} ${radius} 0 0 0 ${x3} ${y3}
             A ${radius} ${radius} 0 1 1 ${x1} ${y1}`;
  return path;
};

const makeRoundedTri = ([x1, x2, x3, y1, y2, y3]) => {
  const path = `M ${x1} ${y1}
             A ${radius} ${radius} 0 0 1 ${x2} ${y2}
             A ${radius} ${radius} 0 0 1 ${x3} ${y3}
             A ${radius} ${radius} 0 0 1 ${x1} ${y1}`;
  return path;
};

const ironPoints = [
  [1, 5, 6],
  [3, 4, 5],
  [2, 6, 4],
];

const sunPoints = [
  [3, 5, 1],
  [2, 4, 3],
  [1, 6, 2],
];

const roundedTriPoints = [[5, 4, 6]];

for (const points of ironPoints) {
  const ptCycle = points
    .map((i) => xPoints[i - 1])
    .concat(points.map((i) => yPoints[i - 1]));
  const shape = makeIronShapes(ptCycle);

  g.append('path')
    .attr('d', shape)
    .attr('class', 'segment')
    .attr('fill', '#cc6666')
    .attr('opacity', 0.5);
}

for (const points of sunPoints) {
  const ptCycle = points
    .map((i) => xPoints[i - 1])
    .concat(points.map((i) => yPoints[i - 1]));
  const shape = makeSunShapes(ptCycle);

  g.append('path')
    .attr('d', shape)
    .attr('class', 'segment')
    .attr('fill', '#6699cc')
    .attr('opacity', 0.5);
}

// CENTRAL INTERSECTION
for (const points of roundedTriPoints) {
  const ptCycle = points
    .map((i) => xPoints[i - 1])
    .concat(points.map((i) => yPoints[i - 1]));
  const shape = makeRoundedTri(ptCycle);

  g.append('path')
    .attr('d', shape)
    .attr('class', 'segment')
    .attr('fill', '#66cc66')
    .attr('opacity', 0.5);
}

// ADD EVENT LISTENERS
g.selectAll('path.segment')
  .on('mouseover', function () {
    d3.select(this).transition().attr('opacity', 1.0).duration(500);
  })
  .on('mouseout', function () {
    d3.select(this).transition().attr('opacity', 0.5).duration(500);
  });

g.append('text').text('1').attr('x', xIsect1).attr('y', yIsect1);
g.append('text').text('2').attr('x', xIsect2).attr('y', yIsect2);
g.append('text').text('3').attr('x', xIsect3).attr('y', yIsect3);
g.append('text').text('4').attr('x', xIsect4).attr('y', yIsect4);
g.append('text').text('5').attr('x', xIsect5).attr('y', yIsect5);
g.append('text').text('6').attr('x', xIsect6).attr('y', yIsect6);
