var WINDOWBORDERSIZE = 10;
var M = 999999;
var surface;

var maxCols = 40;
var cellWidth;
var cellHeight;

var areas =[{"label":"P1 Card Area","startRow":4,"numRows":3,"startCol":10,"numCols":3,"color":"#efc734"}];

(function(){
    window.addEventListener('resize', redrawWindow());
    redrawWindow()
})()

function redrawWindow(){
    var drawsurface = document.getElementById('surface');
    var w = window.innerWidth;
    var h = window.innerHeight;
    var surfaceWidth = (w - 3*WINDOWBORDERSIZE);
    var surfaceHeight = (h - 3*WINDOWBORDERSIZE);

    drawsurface.style.width = surfaceWidth + 'px';
    drawsurface.style.height = surfaceHeight + 'px';
    drawsurface.style.left = WINDOWBORDERSIZE/2 + 'px';
    drawsurface.style.top = WINDOWBORDERSIZE/2 + 'px';
    drawsurface.style.border = 'thick solid #efc734';
    drawsurface.innerHTML = '';

    numCols = maxCols;
    cellWidth = surfaceWidth/numCols;
    numRows = Math.ceil(surfaceHeight/cellWidth);
    cellHeight = surfaceHeight/numRows;

    surface = d3.select('#surface');
    surface.selectAll('*').remove();
    surface.style('font-size','100%').style('fill','white');
    updateSurface();
}

function updateSurface(){
    var allAreas = surface.selectAll(".areas").data(areas);
    var newAreas = allAreas.enter().append('g').attr('class','areas');

    newAreas.append('rect')
    .attr('x', function(d){return (d.startCol-1)*cellWidth;})
    .attr('y', function(d){return (d.startRow-1)*cellHeight;})
    .attr('width', function(d){return d.numCols*cellWidth;})
    .attr('height', function(d){return d.numRows*cellWidth;})
    .style('fill', function(d){return d.color;})
    .style('stroke','black')
    .style('stroke-width',1)
    
}