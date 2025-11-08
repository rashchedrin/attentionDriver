// Global constants
const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 850;
const FRAME_RATE = 100;

// Create canvas element with dimensions from constants
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

const context = canvas.getContext('2d');

/**
 * Draws the canvas content.
 * Fills the entire canvas with gray color.
 * 
 * side-effects: Modifies the canvas rendering context.
 */
function draw() {
    // background
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    rows = 5;
    cols = 5;
    gridCellWidth = CANVAS_WIDTH / cols;
    gridCellHeight = CANVAS_HEIGHT / rows;
    houseRounding = 10;
    streetWidth = gridCellWidth * 0.3;
    sidewalkWidth = streetWidth / 3;
    houseWidth = gridCellWidth - streetWidth - 2 * sidewalkWidth;
    houseHeight = gridCellHeight - streetWidth - 2 * sidewalkWidth;
    houseColor = 'white';
    sidewalkColor = 'grey';
    streetColor = 'black'
    axisLineColor = "yellow"
    loopDurationSeconds = 4;
    drawCity(
        houseWidth, 
        houseHeight, 
        houseRounding, 
        sidewalkWidth,
        streetWidth, 
        rows, 
        cols,
        houseColor,
        streetColor,
        sidewalkColor,
        axisLineColor,
        loopDurationSeconds,
    );
}

function drawCity(
    houseWidth, 
    houseHeight, 
    houseRounding, 
    sidewalkWidth,
    streetWidth, 
    rows, 
    columns,
    houseColor,
    streetColor,
    sidewalkColor,
    axisLineColor
) {
    streetRounding = sidewalkWidth
    blockWidth = houseWidth + sidewalkWidth * 2
    blockHeight = houseHeight + sidewalkWidth * 2
    cellWidth = blockWidth + streetWidth
    cellHeight = blockHeight + streetWidth

    currentTime = Date.now() / 1000;
    animationPhase = (currentTime % loopDurationSeconds) / loopDurationSeconds;
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            cellStartX = column * cellWidth
            cellStartY = row * cellHeight
            cellEndX = cellStartX + cellWidth
            cellEndY = cellStartY + cellHeight

            // Draw sidewalk
            walkwayStartX = cellStartX + streetWidth / 2
            walkwayStartY = cellStartY + streetWidth / 2
            walkwayEndX = cellEndX - streetWidth / 2
            walkwayEndY = cellEndY - streetWidth / 2
            drawRoundedRectangle(
                walkwayStartX,
                walkwayStartY,
                walkwayEndX,
                walkwayEndY, streetRounding, sidewalkColor, sidewalkColor)

            // Draw house
            houseStartX = walkwayStartX + sidewalkWidth;
            houseStartY = walkwayStartY + sidewalkWidth;
            houseEndX = walkwayEndX - sidewalkWidth;
            houseEndY = walkwayEndY - sidewalkWidth;
            drawRoundedRectangle(
                houseStartX,
                houseStartY,
                houseEndX,
                houseEndY, houseRounding, houseColor, houseColor)

            // Draw street axis lines (double continuous lines)
            const lineOffset = 2; // Distance between the two parallel lines
            
            // Draw vertical street axis line (double)
            if (column > 0) {
                context.strokeStyle = axisLineColor;
                context.lineWidth = 1;
                
                // First vertical line
                context.beginPath();
                context.moveTo(cellStartX - lineOffset, houseStartY);
                context.lineTo(cellStartX - lineOffset, houseEndY);
                context.stroke();
                
                // Second vertical line
                context.beginPath();
                context.moveTo(cellStartX + lineOffset, houseStartY);
                context.lineTo(cellStartX + lineOffset, houseEndY);
                context.stroke();
            }
            
            // Draw horizontal street axis line (double)
            if (row > 0) {
                context.strokeStyle = axisLineColor;
                context.lineWidth = 1;
                
                // First horizontal line
                context.beginPath();
                context.moveTo(houseStartX, cellStartY - lineOffset);
                context.lineTo(houseEndX, cellStartY - lineOffset);
                context.stroke();
                
                // Second horizontal line
                context.beginPath();
                context.moveTo(houseStartX, cellStartY + lineOffset);
                context.lineTo(houseEndX, cellStartY + lineOffset);
                context.stroke();
            }

            // draw crosswalks
            drawDashedRectangle(walkwayStartX, cellStartY, houseStartX, walkwayStartY, 1, 4, 'white');
            drawDashedRectangle(houseEndX, cellStartY, walkwayEndX, walkwayStartY, 1, 4, 'white');
            drawDashedRectangle(walkwayStartX, walkwayEndY, houseStartX, cellEndY, 1, 4, 'white');
            drawDashedRectangle(houseEndX, walkwayEndY, walkwayEndX, cellEndY, 1, 4, 'white');
            // Draw horizontal crosswalks
            drawDashedRectangle(cellStartX, walkwayStartY, walkwayStartX, houseStartY, 4, 1, 'white');
            drawDashedRectangle(cellStartX, houseEndY, walkwayStartX, walkwayEndY, 4, 1, 'white');
            drawDashedRectangle(walkwayEndX, walkwayStartY, cellEndX, houseStartY, 4, 1, 'white');
            drawDashedRectangle(walkwayEndX, houseEndY, cellEndX, walkwayEndY, 4, 1, 'white');

            // draw cars
            carWidth = streetWidth  / 3;
            carHeight = carWidth * 2;
            carColor = 'green'
            wrapCellX = (x) => (x + cellWidth) % cellWidth + cellStartX;
            wrapCellY = (y) => (y + cellHeight) % cellHeight + cellStartY;
            //green goes up
            verticalStreetMiddle = cellStartX + streetWidth / 4
            verticalLeftStreetMiddle = cellEndX - streetWidth / 4
            horizontalStreetMiddle = cellStartY + streetWidth / 4
            horizontalTopStreetMiddle = cellEndY - streetWidth / 4 - cellHeight

            carPosition = getPositionFromWaypointsAtPhase([
                [verticalStreetMiddle, cellStartY + cellHeight / 2],
                [verticalStreetMiddle, cellStartY - cellHeight / 2],
            ], animationPhase);
            carUpX = wrapCellX(carPosition.x);
            carUpY = wrapCellY(carPosition.y);
            carOrientationRadiansCCW = carPosition.orientationRadiansCCW;
            drawCar(carUpX, carUpY, carWidth, carHeight, carColor, carOrientationRadiansCCW)

            //green goes down
            carPosition = getPositionFromWaypointsAtPhase([
                [verticalLeftStreetMiddle, cellStartY - cellHeight / 2],
                [verticalLeftStreetMiddle, cellStartY + cellHeight / 2],
            ], animationPhase);
            carDownX = wrapCellX(carPosition.x);
            carDownY = wrapCellY(carPosition.y);
            carOrientationRadiansCCW = carPosition.orientationRadiansCCW;
            drawCar(carDownX, carDownY, carWidth, carHeight, carColor, carOrientationRadiansCCW)

            //green goes right
            verticalStreetMiddle = cellStartX + streetWidth / 4
            carPosition = getPositionFromWaypointsAtPhase([
                [cellStartX - cellWidth / 2, horizontalStreetMiddle],
                [cellStartX + cellWidth / 2, horizontalStreetMiddle],
            ], animationPhase);
            carRightX = wrapCellX(carPosition.x);
            carRightY = wrapCellY(carPosition.y);
            carOrientationRadiansCCW = carPosition.orientationRadiansCCW;
            drawCar(carRightX, carRightY, carWidth, carHeight, carColor, carOrientationRadiansCCW)

            //green goes left
            verticalStreetMiddle = cellStartX + streetWidth / 4
            carPosition = getPositionFromWaypointsAtPhase([
                [cellStartX + cellWidth / 2, horizontalTopStreetMiddle],
                [cellStartX - cellWidth / 2, horizontalTopStreetMiddle],
            ], animationPhase);
            carLeftX = wrapCellX(carPosition.x);
            carLeftY = wrapCellY(carPosition.y);
            carOrientationRadiansCCW = carPosition.orientationRadiansCCW;
            drawCar(carLeftX, carLeftY, carWidth, carHeight, carColor, carOrientationRadiansCCW)

            //green goes up then right
            verticalStreetMiddle = cellStartX + streetWidth / 4
            carPosition = getPositionFromWaypointsAtPhase([
                [verticalStreetMiddle, cellStartY + cellHeight / 2],
                [verticalStreetMiddle, cellStartY + streetWidth / 2],
                [cellStartX + streetWidth / 4 + sidewalkWidth, horizontalStreetMiddle],
                [cellStartX + cellWidth / 2, horizontalStreetMiddle],
            ], animationPhase);
            carX = wrapCellX(carPosition.x);
            carY = wrapCellY(carPosition.y);
            carOrientationRadiansCCW = carPosition.orientationRadiansCCW;
            drawCar(carX, carY, carWidth, carHeight, carColor, carOrientationRadiansCCW)

            //green goes down then left
            verticalStreetMiddle = cellStartX + streetWidth / 4
            carPosition = getPositionFromWaypointsAtPhase([
                [verticalLeftStreetMiddle, cellStartY + cellHeight / 2],
                [verticalLeftStreetMiddle, cellEndY - streetWidth / 2],
                [cellEndX - streetWidth / 4 - sidewalkWidth, horizontalTopStreetMiddle + cellHeight],
                [carLeftX, horizontalTopStreetMiddle + cellHeight],
            ], animationPhase);
            carX = wrapCellX(carPosition.x);
            carY = wrapCellY(carPosition.y);
            carOrientationRadiansCCW = carPosition.orientationRadiansCCW;
            drawCar(carX, carY, carWidth, carHeight, carColor, carOrientationRadiansCCW)

            //green goes left then up
            verticalStreetMiddle = cellStartX + streetWidth / 4
            carPosition = getPositionFromWaypointsAtPhase([
                [cellStartX + cellWidth/2, horizontalTopStreetMiddle + cellHeight],
                [houseStartX - carHeight/2, horizontalTopStreetMiddle + cellHeight],
                [verticalStreetMiddle, houseEndY],
                [verticalStreetMiddle, cellStartY + cellHeight/2],
            ], animationPhase);
            carX = wrapCellX(carPosition.x);
            carY = wrapCellY(carPosition.y);
            carOrientationRadiansCCW = carPosition.orientationRadiansCCW;
            drawCar(carX, carY, carWidth, carHeight, carColor, carOrientationRadiansCCW)

            //green goes right then down
            carPosition = getPositionFromWaypointsAtPhase([
                [cellStartX + cellWidth / 2, horizontalStreetMiddle],
                [houseEndX, horizontalStreetMiddle],
                [verticalLeftStreetMiddle, houseStartY],
                [verticalLeftStreetMiddle, cellStartY + cellHeight / 2],
            ], animationPhase);
            carX = wrapCellX(carPosition.x);
            carY = wrapCellY(carPosition.y);
            carOrientationRadiansCCW = carPosition.orientationRadiansCCW;
            drawCar(carX, carY, carWidth, carHeight, carColor, carOrientationRadiansCCW)

            //green goes up then left
            allowLeftTurn = false;
            if(allowLeftTurn){
                verticalStreetMiddle = cellStartX + streetWidth / 4
                carPosition = getPositionFromWaypointsAtPhase([
                    [carUpX, carUpY],
                    // [verticalStreetMiddle, cellStartY + streetWidth],
                    [cellStartX, cellStartY],
                    // [cellStartX - streetWidth / 4 - sidewalkWidth, horizontalStreetMiddle],
                    [carLeftX - cellWidth, carLeftY - cellHeight],
                ], animationPhase);
                carX = wrapCellX(carPosition.x);
                carY = wrapCellY(carPosition.y);
                carOrientationRadiansCCW = carPosition.orientationRadiansCCW;
                drawCar(carX, carY, carWidth, carHeight, carColor, carOrientationRadiansCCW)
            }


            // //horizontal goes right
            // carPosition = getPositionFromWaypointsAtPhase([
            //     [cellStartX, horizontalStreetMiddle],
            //     // [cellEndX - streetWidth - sidewalkWidth, horizontalStreetMiddle],
            //     // [cellEndX - streetWidth - sidewalkWidth, horizontalStreetMiddle],
            //     [cellEndX, horizontalStreetMiddle],
            // ], animationPhase);
            // carX = (carPosition.x + CANVAS_WIDTH) % CANVAS_WIDTH;
            // carY = (carPosition.y + CANVAS_HEIGHT) % CANVAS_HEIGHT;
            // carOrientationRadiansCCW = carPosition.orientationRadiansCCW;
            // // carOrientationRadiansCCW = animationPhase * Math.PI * 2;
            // carColor = 'cyan'
            // drawCar(carX, carY, carWidth, carHeight, carColor, carOrientationRadiansCCW)
        }
    }
}

class Position2D {
    constructor(x, y, orientationRadiansCCW){
        this.x = x;
        this.y = y;
        this.orientationRadiansCCW = orientationRadiansCCW;
    }
}
function getPositionFromWaypointsAtPhase_noOrientation(waypoints, phase){
    if(waypoints.length === 1){
        return new Position2D(waypoints[0][0], waypoints[0][1], 0);
    }
    nSegments = waypoints.length - 1;
    segmentDuration = 1 / nSegments;    
    segmentIndex = Math.floor(phase / segmentDuration);
    // Clamp segmentIndex to valid range
    segmentIndex = Math.min(segmentIndex, nSegments - 1);
    segmentProgress = (phase % segmentDuration) / segmentDuration;
    previousWaypoint = waypoints[segmentIndex];
    nextWaypoint = waypoints[segmentIndex + 1];
    
    position = new Position2D(
        previousWaypoint[0] + (nextWaypoint[0] - previousWaypoint[0]) * segmentProgress,
        previousWaypoint[1] + (nextWaypoint[1] - previousWaypoint[1]) * segmentProgress,
        0,
    );
    return position;
}

function getPositionFromWaypointsAtPhase_laggingSmoothing(waypoints, phase){
    lag = 0.1
    currentPosition = getPositionFromWaypointsAtPhase_noOrientation(waypoints, phase);
    previousPosition = getPositionFromWaypointsAtPhase_noOrientation(waypoints, Math.max(0, phase - lag));
    angle = Math.atan2(currentPosition.y - previousPosition.y, currentPosition.x - previousPosition.x) + Math.PI / 2;
    position = new Position2D(
        currentPosition.x,
        currentPosition.y,
        angle,
    );
    return position;
}

function getPositionFromWaypointsAtPhase_vectorInterpolation(waypoints, phase){
    if(waypoints.length === 1){
        return new Position2D(waypoints[0][0], waypoints[0][1], 0);
    }
    nSegments = waypoints.length - 1;
    segmentDuration = 1 / nSegments;    
    segmentIndex = Math.floor(phase / segmentDuration);
    segmentProgress = (phase % segmentDuration) / segmentDuration;
    previousWaypoint = waypoints[segmentIndex];
    nextWaypoint = waypoints[segmentIndex + 1];
    
    // Calculate orientation unit vectors for different segments
    let previousSegmentVector = null;
    let currentSegmentVector = null;
    let nextSegmentVector = null;
    
    // Previous segment orientation vector
    if (segmentIndex > 0) {
        let prevPrevWaypoint = waypoints[segmentIndex - 1];
        let dx = previousWaypoint[0] - prevPrevWaypoint[0];
        let dy = previousWaypoint[1] - prevPrevWaypoint[1];
        if (dx !== 0 || dy !== 0) {
            let length = Math.sqrt(dx * dx + dy * dy);
            // Convert to perpendicular unit vector (rotate 90 degrees CCW)
            previousSegmentVector = { x: -dy / length, y: dx / length };
        }
    }
    
    // Current segment orientation vector
    let dx = nextWaypoint[0] - previousWaypoint[0];
    let dy = nextWaypoint[1] - previousWaypoint[1];
    if (dx !== 0 || dy !== 0) {
        let length = Math.sqrt(dx * dx + dy * dy);
        // Convert to perpendicular unit vector (rotate 90 degrees CCW)
        currentSegmentVector = { x: -dy / length, y: dx / length };
    }
    
    // Next segment orientation vector
    if (segmentIndex < nSegments - 1) {
        let nextNextWaypoint = waypoints[segmentIndex + 2];
        dx = nextNextWaypoint[0] - nextWaypoint[0];
        dy = nextNextWaypoint[1] - nextWaypoint[1];
        if (dx !== 0 || dy !== 0) {
            let length = Math.sqrt(dx * dx + dy * dy);
            // Convert to perpendicular unit vector (rotate 90 degrees CCW)
            nextSegmentVector = { x: -dy / length, y: dx / length };
        }
    }
    
    // Choose orientation vector: prefer current, then previous, then next
    let orientationVector = { x: 0, y: 1 };
    if (currentSegmentVector !== null) {
        orientationVector = currentSegmentVector;
    } else if (previousSegmentVector !== null) {
        orientationVector = previousSegmentVector;
    } else if (nextSegmentVector !== null) {
        orientationVector = nextSegmentVector;
    }

    // propagate orientation vectors to nulls:
    if (previousSegmentVector === null) {
        previousSegmentVector = orientationVector;
    }
    if (nextSegmentVector === null) {
        nextSegmentVector = orientationVector;
    }
    if (currentSegmentVector === null) {
        currentSegmentVector = orientationVector;
    }

    // orientation smoothing using vector interpolation
    let finalOrientationVector;
    if (segmentProgress < 0.5) {
        currentOrientationWeight = segmentProgress * 2;
        previousOrientationWeight = 1 - currentOrientationWeight;
        nextOrientationWeight = 0;
        
        finalOrientationVector = {
            x: previousSegmentVector.x * previousOrientationWeight + currentSegmentVector.x * currentOrientationWeight,
            y: previousSegmentVector.y * previousOrientationWeight + currentSegmentVector.y * currentOrientationWeight
        };
    } else {
        currentOrientationWeight = 1 - segmentProgress;
        previousOrientationWeight = 0;
        nextOrientationWeight = 1 - currentOrientationWeight;
        
        finalOrientationVector = {
            x: currentSegmentVector.x * currentOrientationWeight + nextSegmentVector.x * nextOrientationWeight,
            y: currentSegmentVector.y * currentOrientationWeight + nextSegmentVector.y * nextOrientationWeight
        };
    }
    
    // Normalize the final orientation vector
    let vectorLength = Math.sqrt(finalOrientationVector.x * finalOrientationVector.x + finalOrientationVector.y * finalOrientationVector.y);
    if (vectorLength > 0) {
        finalOrientationVector.x /= vectorLength;
        finalOrientationVector.y /= vectorLength;
    }
    
    // Convert back to angle
    let orientation = Math.atan2(finalOrientationVector.y, finalOrientationVector.x);
    
    position = new Position2D(
        previousWaypoint[0] + (nextWaypoint[0] - previousWaypoint[0]) * segmentProgress,
        previousWaypoint[1] + (nextWaypoint[1] - previousWaypoint[1]) * segmentProgress,
        orientation,
    );
    return position;
}
getPositionFromWaypointsAtPhase = getPositionFromWaypointsAtPhase_laggingSmoothing;

function getPositionFromWaypointsAtPhase_angleInterpolation(waypoints, phase){
    if(waypoints.length === 1){
        return new Position2D(waypoints[0][0], waypoints[0][1], 0);
    }
    nSegments = waypoints.length - 1;
    segmentDuration = 1 / nSegments;    
    segmentIndex = Math.floor(phase / segmentDuration);
    segmentProgress = (phase % segmentDuration) / segmentDuration;
    previousWaypoint = waypoints[segmentIndex];
    nextWaypoint = waypoints[segmentIndex + 1];
    
    // Calculate orientation angles for different segments
    let previousSegmentAngle = null;
    let currentSegmentAngle = null;
    let nextSegmentAngle = null;
    
    // Previous segment orientation angle
    if (segmentIndex > 0) {
        let prevPrevWaypoint = waypoints[segmentIndex - 1];
        let dx = previousWaypoint[0] - prevPrevWaypoint[0];
        let dy = previousWaypoint[1] - prevPrevWaypoint[1];
        if (dx !== 0 || dy !== 0) {
            // Calculate angle and rotate 90 degrees CCW (add π/2)
            previousSegmentAngle = Math.atan2(dy, dx) + Math.PI / 2;
        }
    }
    
    // Current segment orientation angle
    let dx = nextWaypoint[0] - previousWaypoint[0];
    let dy = nextWaypoint[1] - previousWaypoint[1];
    if (dx !== 0 || dy !== 0) {
        // Calculate angle and rotate 90 degrees CCW (add π/2)
        currentSegmentAngle = Math.atan2(dy, dx) + Math.PI / 2;
    }
    
    // Next segment orientation angle
    if (segmentIndex < nSegments - 1) {
        let nextNextWaypoint = waypoints[segmentIndex + 2];
        dx = nextNextWaypoint[0] - nextWaypoint[0];
        dy = nextNextWaypoint[1] - nextWaypoint[1];
        if (dx !== 0 || dy !== 0) {
            // Calculate angle and rotate 90 degrees CCW (add π/2)
            nextSegmentAngle = Math.atan2(dy, dx) + Math.PI / 2;
        }
    }
    
    // Choose orientation angle: prefer current, then previous, then next
    let orientationAngle = Math.PI / 2; // Default to pointing up
    if (currentSegmentAngle !== null) {
        orientationAngle = currentSegmentAngle;
    } else if (previousSegmentAngle !== null) {
        orientationAngle = previousSegmentAngle;
    } else if (nextSegmentAngle !== null) {
        orientationAngle = nextSegmentAngle;
    }

    // propagate orientation angles to nulls:
    if (previousSegmentAngle === null) {
        previousSegmentAngle = orientationAngle;
    }
    if (nextSegmentAngle === null) {
        nextSegmentAngle = orientationAngle;
    }
    if (currentSegmentAngle === null) {
        currentSegmentAngle = orientationAngle;
    }

    // Linear interpolation function for angles
    function interpolateAngles(angle1, angle2, t) {
        // Normalize angles to [-π, π)
        const normalizeAngle = (angle) => {
            angle = angle % (2 * Math.PI);
            if (angle > Math.PI) {
                angle -= 2 * Math.PI;
            } else if (angle < -Math.PI) {
                angle += 2 * Math.PI;
            }
            return angle;
        };
        
        angle1 = normalizeAngle(angle1);
        angle2 = normalizeAngle(angle2);
        
        // Calculate the difference
        let diff = angle2 - angle1;
        
        // Adjust to take the shortest arc
        if (diff > Math.PI) {
            diff -= 2 * Math.PI;
        } else if (diff < -Math.PI) {
            diff += 2 * Math.PI;
        }
        
        // Interpolate through the shortest arc
        return angle1 + diff * t;
    }

    // orientation smoothing using angle interpolation
    let finalOrientation;
    if (segmentProgress < 0.5) {
        let t = segmentProgress * 2;
        finalOrientation = interpolateAngles(previousSegmentAngle, currentSegmentAngle, t);
    } else {
        let t = (segmentProgress - 0.5) * 2;
        finalOrientation = interpolateAngles(currentSegmentAngle, nextSegmentAngle, t);
    }
    
    position = new Position2D(
        previousWaypoint[0] + (nextWaypoint[0] - previousWaypoint[0]) * segmentProgress,
        previousWaypoint[1] + (nextWaypoint[1] - previousWaypoint[1]) * segmentProgress,
        finalOrientation,
    );
    return position;
}

/**
 * Helper function to get the normalized direction vector of a segment.
 * Returns the direction of travel (dx, dy).
 * @param {Array<number>} w1 - Start waypoint [x, y]
 * @param {Array<number>} w2 - End waypoint [x, y]
 * @returns {{x: number, y: number} | null} - Normalized vector or null if length is zero.
 */
function getSegmentDirectionVector(w1, w2) {
    const dx = w2[0] - w1[0];
    const dy = w2[1] - w1[1];
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length < 0.0001) {
        return null; // Zero-length segment
    }
    return { x: dx / length, y: dy / length };
}

/**
 * Helper function to normalize a vector, with a fallback.
 * Used to average direction vectors at a waypoint.
 * @param {number} x - Vector x component
 * @param {number} y - Vector y component
 * @param {{x: number, y: number}} fallback - Vector to return on a 180-degree turn (which sums to zero).
 * @returns {{x: number, y: number}} - Normalized vector.
 */
function getNormalizedVector(x, y, fallback) {
    const length = Math.sqrt(x * x + y * y);
    if (length < 0.0001) {
        // This happens on a 180-degree turn (e.g., v_prev + v_curr = 0).
        // We fall back to the current segment's direction.
        return fallback;
    }
    return { x: x / length, y: y / length };
}

/**
 * Helper function to linearly interpolate between two angles, taking the shortest path.
 * @param {number} a - Start angle (radians)
 * @param {number} b - End angle (radians)
 * @param {number} t - Interpolation factor (0.0 to 1.0)
 * @returns {number} - Interpolated angle (radians)
 */
function lerpAngle_gemini(a, b, t) {
    let delta = b - a;
    if (delta > Math.PI) {
        delta -= 2 * Math.PI; // Go the other way
    } else if (delta < -Math.PI) {
        delta += 2 * Math.PI; // Go the other way
    }
    return a + delta * t;
}

/**
 * Calculates a Position2D (x, y, orientation) along a waypoint path at a given phase.
 * Features smooth, continuous orientation (C1 continuity).
 *
 * @param {Array<Array<number>>} waypoints - An array of [x, y] coordinates.
 * @param {number} phase - A value from 0.0 to 1.0 representing progress along the *entire* path.
 * @returns {Position2D}
 */
function getPositionFromWaypointsAtPhase_gemini(waypoints, phase) {
    if (!waypoints || waypoints.length === 0) {
        return new Position2D(0, 0, 0); // Or handle error
    }
    
    // Handle single waypoint case
    if (waypoints.length === 1) {
        return new Position2D(waypoints[0][0], waypoints[0][1], 0);
    }

    const nSegments = waypoints.length - 1;
    const segmentDuration = 1 / nSegments;
    
    // Clamp phase to valid range
    phase = Math.max(0, Math.min(1, phase));
    
    // Find current segment
    // Handle the `phase = 1.0` edge case
    let segmentIndex = Math.floor(phase / segmentDuration);
    if (segmentIndex >= nSegments) {
        segmentIndex = nSegments - 1;
    }

    let segmentProgress = (phase % segmentDuration) / segmentDuration;
    // Handle `phase = 1.0` edge case where (1.0 % segmentDuration) might be 0
    if (phase === 1.0) {
        segmentProgress = 1.0;
    }

    const prevWaypoint = waypoints[segmentIndex];
    const nextWaypoint = waypoints[segmentIndex + 1];

    // --- 1. Calculate Position (Linear Interpolation) ---
    const posX = prevWaypoint[0] + (nextWaypoint[0] - prevWaypoint[0]) * segmentProgress;
    const posY = prevWaypoint[1] + (nextWaypoint[1] - prevWaypoint[1]) * segmentProgress;

    // --- 2. Calculate Smooth Orientation ---

    // Get direction vectors for the current, previous, and next segments
    const v_curr_raw = getSegmentDirectionVector(prevWaypoint, nextWaypoint);

    const v_prev_raw = (segmentIndex > 0)
        ? getSegmentDirectionVector(waypoints[segmentIndex - 1], prevWaypoint)
        : null;

    const v_next_raw = (segmentIndex < nSegments - 1)
        ? getSegmentDirectionVector(nextWaypoint, waypoints[segmentIndex + 2])
        : null;

    // Handle zero-length segments by falling back to an adjacent vector
    // Default to {0, 1} (up) if all segments are zero-length
    const v_curr = v_curr_raw || v_prev_raw || v_next_raw || { x: 0, y: 1 };
    const v_prev = v_prev_raw || v_curr;
    const v_next = v_next_raw || v_curr;

    // Calculate the "ideal" orientation vector AT the waypoints by averaging
    // the incoming and outgoing segment directions.
    const O_start_vec = getNormalizedVector(v_prev.x + v_curr.x, v_prev.y + v_curr.y, v_curr);
    const O_end_vec = getNormalizedVector(v_curr.x + v_next.x, v_curr.y + v_next.y, v_curr);

    // Get the angles for the start and end of the segment
    const startAngle = Math.atan2(O_start_vec.y, O_start_vec.x) + Math.PI / 2;
    const endAngle = Math.atan2(O_end_vec.y, O_end_vec.x) + Math.PI / 2;

    // Use a "smoothstep" function on segmentProgress for C1 continuity.
    // This makes the rotation start and end slowly, matching the position's
    // change in direction (which is 0 at the waypoint).
    const t_smooth = segmentProgress * segmentProgress * (3 - 2 * segmentProgress);

    // Interpolate the angle using the shortest path
    const orientation = lerpAngle_gemini(startAngle, endAngle, t_smooth);

    return new Position2D(posX, posY, orientation);
}

function drawCar(x, y, width, height, color, orientationRadiansCCW){
    context.save();
    context.translate(x , y);
    context.rotate(orientationRadiansCCW);
    // Draw car body
    context.fillStyle = color;
    context.fillRect(-width/2, -height/2, width, height);
    
    // Draw doors (vertical lines)
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(-width/6, -height/2);
    context.lineTo(-width/6, height/2);
    context.moveTo(width/6, -height/2);
    context.lineTo(width/6, height/2);
    context.stroke();
    
    // Draw windows
    context.fillStyle = 'lightblue';
    context.fillRect(-width/2 + 2, -height/2 + height/4, width - 4, height/3);
    
    // Draw headlights (at the front of the car)
    context.fillStyle = 'yellow';
    context.fillRect(-width/2, -height/2 - 3, 8, 3);
    context.fillRect(width/2 - 8, -height/2 - 3, 8, 3);
    context.restore();
}

function drawDashedRectangle(
    x0, 
    y0, 
    x1, 
    y1, 
    nSegmentsVertical, 
    nSegmentsHorizontal, 
    color
){
    const nGapsVertical = nSegmentsVertical - 1;
    const nGapsHorizontal = nSegmentsHorizontal - 1;
    const nStripesVertical = nSegmentsVertical + nGapsVertical;
    const nStripesHorizontal = nSegmentsHorizontal + nGapsHorizontal;
    const stripeWidthVertical = (x1 - x0) / nStripesVertical;
    const stripeWidthHorizontal = (y1 - y0) / nStripesHorizontal;
    for(let column = 0; column < nStripesHorizontal; column+=2) {
        for(let row = 0; row < nStripesVertical; row+=2) {
            drawRectangle(x0 + row * stripeWidthVertical, y0 + column * stripeWidthHorizontal, x0 + row * stripeWidthVertical + stripeWidthVertical, y0 + column * stripeWidthHorizontal + stripeWidthHorizontal, color);
        }
    }
}

function drawRectangle(x0, y0, x1, y1, color){
    context.fillStyle = color;
    context.fillRect(x0, y0, x1 - x0, y1 - y0);
}

function drawRoundedRectangle(x0, y0, x1, y1, radius, edgeColor, fillColor) {
    if (x1 < x0) { [x0, x1] = [x1, x0]; }
    if (y1 < y0) { [y0, y1] = [y1, y0]; }
    context.beginPath();
    context.arc(x0 + radius, y0 + radius, radius, Math.PI, Math.PI * 1.5);
    context.arc(x1 - radius, y0 + radius, radius, Math.PI * 1.5, 0);
    context.arc(x1 - radius, y1 - radius, radius, 0, Math.PI * 0.5);
    context.arc(x0 + radius, y1 - radius, radius, Math.PI * 0.5, Math.PI);
    context.closePath();
    
    if (fillColor !== null) {
        context.fillStyle = fillColor;
        context.fill();
    }
    
    if (edgeColor !== null) {
        context.strokeStyle = edgeColor;
        context.lineWidth = 1;
        context.stroke();
    }
}

// Call draw() at the specified frame rate (every 1000/FRAME_RATE ms)
const interval_ms = 1000 / FRAME_RATE;
setInterval(draw, interval_ms);

// Initial draw
draw();
