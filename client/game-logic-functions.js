'use strict';

function isStraightLine(startPoint,endPoint) //check if a line is perpendicular or parallel to the x or y axis
{
    if((startPoint.x === endPoint.x || startPoint.y === endPoint.y) && (JSON.stringify(endPoint).localeCompare(JSON.stringify(startPoint)) !== 0))
        return true;
    else
        return false;
}

function isDiagonalLine(startPoint,endPoint)
{
    if((Math.abs(startPoint.x - endPoint.x) == Math.abs(startPoint.y - endPoint.y)) && (JSON.stringify(endPoint).localeCompare(JSON.stringify(startPoint)) !== 0))
        return true;
    else
        return false;
}

function validStartNode(startPoint, endPoints)
{
    //return ((endPoints[0].x === startPoint.x && endPoints[0].y === startPoint.y) || (endPoints[1].x === startPoint.x && endPoints[1].y === startPoint.y)) ? true : false;
    return ((JSON.stringify(endPoints[0]).localeCompare(JSON.stringify(startPoint)) === 0) || (JSON.stringify(endPoints[1]).localeCompare(JSON.stringify(startPoint)) === 0)) ? true : false;
}

function addAllPoints(startPoint, endPoint, gameMovePoints, gameDiagonalLines)
{
    if(validMove(startPoint, endPoint, gameMovePoints))
    {
        if(isDiagonalLine(startPoint, endPoint))
        {
            addDiagonalLinePoints(startPoint, endPoint, gameMovePoints, gameDiagonalLines);
        }
        else
        {
            addStraigthLinePoints(startPoint, endPoint, gameMovePoints);
        }

        return 0;
    }
    else
    {
        return -1; //error
    }
}

function addStraigthLinePoints(startPoint, endPoint, gameMovePoints)
{
        var point = {"x": endPoint.x, "y": endPoint.y}
        var i;
        var count;

    if(gameMovePoints.length === 0)
    {
        gameMovePoints.push(JSON.parse(JSON.stringify(startPoint)));      
    }

    if(startPoint.x === endPoint.x)
    {
        count = Math.abs(startPoint.y - endPoint.y);

        for(i = 1; i <= count; i++)
        {
            gameMovePoints.push(JSON.parse(JSON.stringify(point)));
            point.y = (endPoint.y > startPoint.y? (point.y - 1) : (point.y + 1));
        }
    }
    else(startPoint.y === endPoint.y)
    {
        count = Math.abs(startPoint.x - endPoint.x);

        for(i = 1; i <= count; i++)
        {
            gameMovePoints.push(JSON.parse(JSON.stringify(point)));
            point.x = (endPoint.x > startPoint.x? (point.x - 1) : (point.x + 1));
        }
    }
}

function addDiagonalLinePoints(startPoint,endPoint, gameMovePoints, gameDiagonalLines)
{
        var count = Math.abs(startPoint.y - endPoint.y); //x would have worked too
        var point = JSON.parse(JSON.stringify(endPoint));
        var i = [];
        var line = {"start": JSON.parse(JSON.stringify(startPoint)), "end": JSON.parse(JSON.stringify(endPoint))};
      
        if(gameMovePoints.length === 0)
        {
            gameMovePoints.push(JSON.parse(JSON.stringify(startPoint)));
        }
        
        for(i = 1; i <= count; i++)
        {       
            gameMovePoints.push(JSON.parse(JSON.stringify(point)));

            if(count !== 1)
            {
                line.end = JSON.parse(JSON.stringify(point));
                point.y = (endPoint.y > startPoint.y? (point.y - 1) : (point.y + 1));
                point.x = (endPoint.x > startPoint.x? (point.x - 1) : (point.x + 1));
                line.start = JSON.parse(JSON.stringify(point));
            }

            gameDiagonalLines.push(JSON.parse(JSON.stringify(line)));
        }
}

function validMove(startPoint, endPoint, gameMovePoints)
{
    if(isStraightLine(startPoint, endPoint))
    {
        return !straightLineCrossDetected(startPoint, endPoint, gameMovePoints);
    }
    else if(isDiagonalLine(startPoint,endPoint))
    {
        return !DiagonalLineCrossDetected(startPoint, endPoint, gameMovePoints);
    }
    else
    {
        return false;
    }
}

//Diagonals may intersect at non-node points, this checks for such intersections
function nonNodeCrossDetected(startPoint, endPoint, gameDiagonalLines)
{
    var line = {"start": {"x": startPoint.x, "y": endPoint.y}, "end": {"x": endPoint.x, "y": startPoint.y}};
    var line2 = {"start": {"x": endPoint.x, "y": startPoint.y}, "end": {"x": startPoint.x, "y": endPoint.y}};
    var i;

    for(i of gameDiagonalLines)
    {
        if(JSON.stringify(i).localeCompare(JSON.stringify(line)) === 0 || JSON.stringify(i).localeCompare(JSON.stringify(line2)) === 0)
        {
            return true;
        }
    }

    return false;
}

//Checks if a diagonal line crosses any other lines
function DiagonalLineCrossDetected(startPoint, endPoint, gameMovePoints)
{
    var count = Math.abs(startPoint.y - endPoint.y); //x would have worked too
    var point = JSON.parse(JSON.stringify(endPoint));
    var i;
    var line = {"start": JSON.parse(JSON.stringify(startPoint)), "end": JSON.parse(JSON.stringify(endPoint))};
    
    for(i = 0; i < count; i++) //TODO: Make sure singleLineCrossDetected is always called 1st otherwise i should be <= count
    {
        /*if(i === 0 && pointExists(point, gameMovePoints)) //allows 1st point to get checked before it's changed in the following if block
        {
            return true;
        }*/
        if(pointExists(point, gameMovePoints))
        {
            return true;
        }

        if(count !== 1)
        {
            line.start = JSON.parse(JSON.stringify(point));
            point.y = (endPoint.y > startPoint.y? (point.y - 1) : (point.y + 1));
            point.x = (endPoint.x > startPoint.x? (point.x - 1) : (point.x + 1));
            /*line.end.x = line.start.x;
            line.end.y = point.y;
            line.start.x = point.x;*/
            line.end = JSON.parse(JSON.stringify(point));
        }

        if(nonNodeCrossDetected(line.start, line.end, gameDiagonalLines))
        {
            return true;
        }
        
    }

    return false;
}

//Checks if a straight line crosses any other lines
function straightLineCrossDetected(startPoint, endPoint, gameMovePoints)
{
    if(startPoint.x === endPoint.x)
    {    
        var count = Math.abs(startPoint.y - endPoint.y);
        var point = {"x": endPoint.x, "y":endPoint.y}
        var i;

        for(i = 0; i < count; i++)
        {  
            /*if(i === 0 && pointExists(point, gameMovePoints)) //allows 1st point to get checked before it's changed in the following if block
            {
                return true;
            }*/
            if(pointExists(point, gameMovePoints)) 
            {
                return true;
            }

            if(count !== 1)
            {
                point.y = (endPoint.y > startPoint.y? (point.y - 1) : (point.y + 1));
            }
            
        }

        return false;
    }        
    else(startPoint.y === endPoint.y)
    {
        var count = Math.abs(startPoint.x - endPoint.x);
        var point = {"x": endPoint.x, "y":endPoint.y}
        var i;

        for(i = 0; i < count; i++) 
        { 
            /*if(i === 0 && pointExists(point, gameMovePoints)) //allows 1st point to get checked before it's changed in the following if block
            {
                return true;
            }*/
            if(pointExists(point, gameMovePoints)) //allows 1st point to get checked before it's changed in the following if block
            {
                return true;
            }
                
            if(count !== 1)
            {
                point.x = (endPoint.x > startPoint.x ? (point.x - 1) : (point.x + 1));
            }

        }

        return false;
    }    
}

//checks if a point has already been played
function pointExists(point, gameMovePoints)
{
    var j;

    for (j of gameMovePoints)
    {
        if(JSON.stringify(j).localeCompare(JSON.stringify(point)) === 0)
            return true;
    }

    return false;
}

function updateEndPoints(startPoint, endPoint, endPoints)
{
    if(endPoints.length === 0)
    {
        endPoints.push(JSON.parse(JSON.stringify(startPoint)));
        endPoints.push(JSON.parse(JSON.stringify(endPoint)));
    }
    else
    {
        var i;
        for(i = 0; i < endPoints.length; i++) //TODO: some error checking needed
        {
            if(JSON.stringify(endPoints[i]).localeCompare(JSON.stringify(startPoint)) === 0)
            {
                endPoints[i] = JSON.parse(JSON.stringify(endPoint));
                break;
            }
        }
    }
}

/*/TODO: Remove
function createPoints(numOfRows, numOfColums)
{
    var points = [];
    var point = {"x": null, "y": null};
    var i;
    var j;

    for(i = 0; i < numOfRows; i++)
    {
        point.x = i;
        for(j = 0; j < numOfColums; j++)
        {
            point.y = j;
            points.push(point);
        }
    }

    return points;
}*/

function moreMovesFromThisEnd(endpoint, gameMovePoints, gridCount)
{
    var maxX = (endpoint.x == (gridCount - 1) ? endpoint.x : (endpoint.x + 1));
    var minX = (endpoint.x == 0 ? endpoint.x : (endpoint.x - 1));
    var maxY = (endpoint.y == (gridCount - 1) ? endpoint.y : (endpoint.y + 1));
    var point = {"x": null, "y": null};

    for(;minX <= maxX; minX++)
    {
        var minY = (endpoint.y == 0 ? endpoint.y : (endpoint.y - 1));
        point.x = minX;

        for(;minY <= maxY; minY++)
        {
            point.y = minY;

            if(JSON.stringify(point).localeCompare(JSON.stringify(endpoint)) !== 0 && validMove(endpoint, point, gameMovePoints))
            {
                return true;
            }
        }
    }

    return false;
} 

function isGameOver(endpoint1, endpoint2, gameMovePoints, gridCount)
{
    return (!moreMovesFromThisEnd(endpoint1, gameMovePoints, gridCount) && !moreMovesFromThisEnd(endpoint2, gameMovePoints, gridCount)) ? true : false;
}