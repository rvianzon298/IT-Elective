function aStar(grid, start, target, visualizeStep = false) {
    // Heuristic: Chebyshev distance
    function heuristic(nodeA, nodeB) {
        return Math.max(Math.abs(nodeA.x - nodeB.x), Math.abs(nodeA.y - nodeB.y));
    }

    // Clear all lists and maps for a fresh start
    const openList = []; // Nodes to evaluate
    const closedList = new Set(); // Nodes already evaluated
    const cameFrom = new Map(); // For reconstructing the path later

    const gScore = new Map(); // Cost from start to a node
    const fScore = new Map(); // Estimated total cost (g + h)

    const key = node => `${node.x},${node.y}`; // Unique identifier for a node

    openList.push(start); // Add start node to the open list
    gScore.set(key(start), 0); // Start node has g cost of 0
    fScore.set(key(start), heuristic(start, target)); // Initial estimate to the target

    let steps = 0;

    while (openList.length > 0) {
        // Find the node with the lowest F cost
        openList.sort((a, b) => fScore.get(key(a)) - fScore.get(key(b)));
        const current = openList.shift();

        // If the target is reached, reconstruct the path
        if (current.x === target.x && current.y === target.y) {
            const path = [];
            let temp = current;
            while (temp) {
                path.unshift(temp);
                temp = cameFrom.get(key(temp));
            }
            if (visualizeStep) {
                console.log("Path found! Total steps:", steps);
            }
            return path;
        }

        // Move current node to closed list
        closedList.add(key(current));

        // Process neighbors
        for (const neighbor of getNeighbors(grid, current)) {
            if (closedList.has(key(neighbor)) || grid[neighbor.x][neighbor.y] === 1) {
                continue; // Skip obstacles or already evaluated nodes
            }

            const diagonalCost = 14;
            const horizontalCost = 10;
            const tentativeGScore = gScore.get(key(current)) + 
              (Math.abs(current.x - neighbor.x) === 1 && Math.abs(current.y - neighbor.y) === 1 ? diagonalCost : horizontalCost);

            if (!openList.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
                openList.push(neighbor); // Add neighbor to open list
            } else if (tentativeGScore >= (gScore.get(key(neighbor)) || Infinity)) {
                continue; // Skip if the current path is not better
            }

            // Update neighbor's scores and parent reference
            cameFrom.set(key(neighbor), current);
            gScore.set(key(neighbor), tentativeGScore);
            fScore.set(key(neighbor), tentativeGScore + heuristic(neighbor, target));
        }

        // Optionally visualize the step-by-step process
        if (visualizeStep) {
            steps++;
            console.log(`Step ${steps}:`);
            printGrid(grid, closedList, openList, current);
        }
    }

    // Return empty array if no path is found
    return [];
}

// Example Usage
const grid = [
    [0, 0, 0, 0, 1],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0]
];

const start = { x: 0, y: 0 };
const target = { x: 4, y: 4 };

// Call the function and visualize each step
const shortestPath = aStar(grid, start, target, true); // Pass true to visualize steps
console.log("Shortest Path:", shortestPath);
