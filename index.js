import './style.css';

const radius = 100;

const offsetFactor = 1.2;
const offset = offsetFactor * radius;

// COORDINATES
const xCenter1 = radius;
const yCenter1 = radius;

const xCenter2 = xCenter1 + offset;
const yCenter2 = yCenter1;

const xCenter3 = xCenter1 + offset * 0.5;
const yCenter3 = yCenter1 + Math.sqrt(3) * offset * 0.5;

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('viewBox', '-250 -250 500 500');

const g = svg
  .append('g')
  .attr(
    'transform',
    `translate(${-xCenter3} , ${(-yCenter3 - radius) * 0.5} )`
  );

const circleOne = g
  .append('circle')
  .attr('r', radius)
  // .attr('stroke', '#ffe41e')
  .attr('fill', 'none')
  .attr('transform', `translate( ${xCenter1} , ${yCenter1} )`);

const circleTwo = g
  .append('circle')
  .attr('r', radius)
  // .attr('stroke', '#ffe41e')
  .attr('fill', 'none')
  .attr('transform', `translate( ${xCenter2} , ${yCenter2} )`);

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

const roundedTriPoints = [
  [5, 4, 6],
];

// OUTER SEGMENTS
for (const points of sunPoints) {
  const ptCycle = points
    .map((i) => xPoints[i - 1])
    .concat(points.map((i) => yPoints[i - 1]));
  const shape = makeSunShapes(ptCycle);

  g.append('path')
    .attr('d', shape)
    .attr('class', 'segment')
    .attr('fill', 'green')
    .attr('opacity', 0.5);
}

// INNER INTERSECTIONS
for (const points of ironPoints) {
  const ptCycle = points
    .map((i) => xPoints[i - 1])
    .concat(points.map((i) => yPoints[i - 1]));
  const shape = makeIronShapes(ptCycle);

  g.append('path')
    .attr('d', shape)
    .attr('class', 'segment')
    .attr('fill', 'red')
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
    .attr('fill', 'blue')
    .attr('opacity', 0.5);
}

// ANIMATION
g.selectAll('path.segment')
  .on('mouseover', function () {
    d3.select(this).transition().attr('opacity', 1.0).duration(500);
  })
  .on('mouseout', function () {
    d3.select(this).transition().attr('opacity', 0.5).duration(500);
  });

// TEXT
g.append('text').text('1').attr('x', xIsect1).attr('y', yIsect1);
g.append('text').text('2').attr('x', xIsect2).attr('y', yIsect2);
g.append('text').text('3').attr('x', xIsect3).attr('y', yIsect3);
g.append('text').text('4').attr('x', xIsect4).attr('y', yIsect4);
g.append('text').text('5').attr('x', xIsect5).attr('y', yIsect5);
g.append('text').text('6').attr('x', xIsect6).attr('y', yIsect6);
