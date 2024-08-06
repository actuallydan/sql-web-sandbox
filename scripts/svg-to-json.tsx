// const svgData = <svg>
//     <circle cx="5" cy="56" r="3.6" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></circle>
//     <polygon points="32,56 20,60 20,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M9,56L26,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M47,71L156,71A15 15 0 0 0 171 56A15 15 0 0 0 156 41L47,41A15 15 0 0 0 32 56A15 15 0 0 0 47 71Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="102" y="56" text-anchor="middle" fill="rgb(0,0,0)" dominant-baseline="central">aggregate-func</text>
//     <polygon points="189,56 178,60 178,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M171,56L183,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M204,71A15 15 0 0 0 219 56A15 15 0 0 0 204 41A15 15 0 0 0 189 56A15 15 0 0 0 204 71Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="204" y="56" text-anchor="middle" font-weight="bold" fill="rgb(0,0,0)" dominant-baseline="central">(</text>
//     <polygon points="242,56 231,60 231,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M219,56L237,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="277,26 265,30 265,22" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M242,56 L 248,56 Q 254,56 254,41 L 254,41 Q 254,26 263,26 L 271,26" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M292,41L360,41A15 15 0 0 0 376 26L376,26A15 15 0 0 0 360 11L292,11A15 15 0 0 0 277 26L277,26A15 15 0 0 0 292 41Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="326" y="26" text-anchor="middle" fill="rgb(0,0,0)" dominant-baseline="central">DISTINCT</text>
//     <polygon points="394,26 382,30 382,22" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M376,26L388,26" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="428,56 417,60 417,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M394,26 L 399,26 Q 405,26 405,41 L 405,41 Q 405,56 414,56 L 422,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="464,56 453,60 453,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M428,56L458,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M464,71L513,71L513,41L464,41Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="489" y="56" text-anchor="middle" fill="rgb(0,0,0)" dominant-baseline="central">expr</text>
//     <polygon points="657,56 646,60 646,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M513,56L652,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M672,71A15 15 0 0 0 688 56A15 15 0 0 0 672 41A15 15 0 0 0 657 56A15 15 0 0 0 672 71Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="672" y="56" text-anchor="middle" font-weight="bold" fill="rgb(0,0,0)" dominant-baseline="central">)</text>
//     <polygon points="734,86 722,91 722,82" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M688,56 L 699,56 Q 711,56 711,71 L 711,71 Q 711,86 719,86 L 728,86" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M734,101L846,101L846,71L734,71Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="790" y="86" text-anchor="middle" fill="rgb(0,0,0)" dominant-baseline="central">filter-clause</text>
//     <polygon points="900,56 888,60 888,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M846,86 L 855,86 Q 864,86 864,71 L 864,71 Q 864,56 879,56 L 879,56 L 894,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <circle cx="903" cy="56" r="3.6" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></circle>
//     <polygon points="790,56 778,60 778,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M688,56L784,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="900,56 888,60 888,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M790,56L894,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="326,56 315,60 315,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M242,56L321,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="428,56 417,60 417,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M326,56L422,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M489,32A15 15 0 0 0 504 17A15 15 0 0 0 489 2A15 15 0 0 0 474 17A15 15 0 0 0 489 32Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="489" y="17" text-anchor="middle" font-weight="bold" fill="rgb(0,0,0)" dominant-baseline="central">,</text>
//     <polygon points="504,17 515,12 515,21" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M513,56 L 525,56 Q 536,56 536,41 L 536,32 Q 536,17 523,17 L 510,17" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="464,56 453,60 453,52" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M474,17 L 456,17 Q 441,17 441,32 L 441,41 Q 441,56 450,56 L 458,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M438,207A15 15 0 0 0 453 192A15 15 0 0 0 438 177A15 15 0 0 0 423 192A15 15 0 0 0 438 207Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="438" y="192" text-anchor="middle" font-weight="bold" fill="rgb(0,0,0)" dominant-baseline="central">*</text>
//     <polygon points="423,192 412,196 412,188" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M242,56 L 248,56 Q 254,56 254,71 L 254,177 Q 254,192 269,192 L 402,192 L 417,192" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="489,192 477,196 477,188" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M453,192L483,192" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M489,192 L 570,192 Q 585,192 600,192 L 605,192 Q 620,192 620,177 L 620,71 Q 620,56 626,56 L 631,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="438,216 427,221 427,212" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M326,192 L 392,192 Q 407,192 407,204 Q 407,216 420,216 L 433,216" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M438,216 L 453,216 Q 467,216 467,204 Q 467,192 473,192 L 479,192" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="300,117 289,121 289,112" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M513,56 L 523,56 Q 533,56 533,71 L 533,71 Q 533,86 518,86 L 292,86 Q 277,86 277,101 L 277,102 Q 277,117 286,117 L 294,117" style="fill:none;stroke-width:2.16;stroke:#0090ff;"></path>
//     <path d="M315,132L360,132A15 15 0 0 0 375 117A15 15 0 0 0 360 101L315,101A15 15 0 0 0 300 117A15 15 0 0 0 315 132Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="337" y="117" text-anchor="middle" fill="rgb(0,0,0)" dominant-baseline="central">ORDER</text>
//     <polygon points="392,117 381,121 381,112" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M375,117L386,117" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M407,132L411,132A15 15 0 0 0 426 117A15 15 0 0 0 411 101L407,101A15 15 0 0 0 392 117A15 15 0 0 0 407 132Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="409" y="117" text-anchor="middle" fill="rgb(0,0,0)" dominant-baseline="central">BY</text>
//     <polygon points="455,117 444,121 444,112" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M426,117L449,117" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M455,132L585,132L585,101L455,101Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="520" y="117" text-anchor="middle" fill="rgb(0,0,0)" dominant-baseline="central">ordering-term</text>
//     <path d="M520,169A15 15 0 0 0 535 154A15 15 0 0 0 520 139A15 15 0 0 0 505 154A15 15 0 0 0 520 169Z" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <text x="520" y="154" text-anchor="middle" font-weight="bold" fill="rgb(0,0,0)" dominant-baseline="central">,</text>
//     <polygon points="535,154 547,150 547,159" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M585,117 L 591,117 Q 597,117 597,132 L 597,139 Q 597,154 582,154 L 556,154 L 541,154" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <polygon points="455,117 444,121 444,112" style="fill:rgb(0,0,0)"></polygon>
//     <path d="M505,154 L 470,154 Q 455,154 447,154 Q 438,154 438,139 L 438,132 Q 438,117 444,117 L 449,117" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
//     <path d="M585,117 L 594,117 Q 602,117 602,102 L 602,71 Q 602,56 617,56 L 623,56 L 638,56" style="fill:none;stroke-width:2.16;stroke:rgb(0,0,0);"></path>
// </svg>

function getTerminalCoordsForEdge(str) {
    const coords = str
        .split(" ")
        .filter(m => m.length > 1)
        .map(pair => pair
            .split(",")
            .map(d => parseFloat(d.replace(/[A-Za-z]/gi, ""))))

    return {
        start: { x: coords[0][0], y: coords[0][1] },
        end: { x: coords[coords.length - 1][0], y: coords[coords.length - 1][1] },
    }
}


// for all nodes determine if it's a bubble, text, or path
function sortElements(nodes) {
    const elements = {
        bubbles: [],
        text: [],
        paths: [],
        arrows: [],
        circles: []
    }
    nodes.forEach(node => {
        // bubbles
        if (node.getAttribute("d") && node.getAttribute("d")[node.getAttribute("d").length - 1] === "Z") {
            elements.bubbles.push(node)
        } else if (node.nodeName === "text") {
            elements.text.push(node)
        } else if (node.nodeName === "path") {
            elements.paths.push(node)
        } else if (node.nodeName === "polygon") {
            elements.arrows.push(node)
        } else if (node.nodeName === "circle") {
            elements.circles.push(node)
        }
    })
    return elements

}

function getArrowCoordinates(points) {
    const coords = points.split(' ').map(point => {
        const [x, y] = point.split(',').map(Number);
        return { x, y };
    });

    // Assume the first point is the tip of the arrow and the last point is one of the base points
    const tip = coords[0];
    const base1 = coords[1];
    const base2 = coords[2];

    // Calculate the center of the base
    const baseCenter = {
        x: (base1.x + base2.x) / 2,
        y: (base1.y + base2.y) / 2
    };

    return { start: baseCenter, end: tip };
}

function getMinMaxCoords(pathData) {
    const commands = pathData.match(/[a-zA-Z][^a-zA-Z]*/g);
    const points = [];
    
    let currentX = 0;
    let currentY = 0;

    commands.forEach(command => {
        const type = command[0];
        const values = command.slice(1).trim().split(/[\s,]+/).map(Number);

        switch (type) {
            case 'M': // Move to absolute
            case 'L': // Line to absolute
                for (let i = 0; i < values.length; i += 2) {
                    currentX = values[i];
                    currentY = values[i + 1];
                    points.push({ x: currentX, y: currentY });
                }
                break;
            case 'A': // Arc to absolute
                for (let i = 5; i < values.length; i += 7) {
                    currentX = values[i];
                    currentY = values[i + 1];
                    points.push({ x: currentX, y: currentY });
                }
                break;
            case 'Z': // Close path
                // No new points, path is closed
                break;
            default:
                console.warn(`Unsupported command: ${type}`);
        }
    });

    const minX = Math.min(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));

    return { start: {x: minX, y: minY}, end: {x: maxX, y: maxY} };
}



const svgData = document.querySelector(".pikchr")

const elements = [...svgData.children]
const { arrows, bubbles, paths, text, circles } = sortElements(elements)

const nodes = bubbles.concat(circles)
const edges = paths

// get the coordinates of each node
const nodeCoordinates = nodes.map(node => {
    if (node.nodeName !== "circle") {
        return { start: { x: parseFloat(node.getAttribute("cx")), y: parseFloat(node.getAttribute("cy")) }, end: { x: parseFloat(node.getAttribute("cx")), y: parseFloat(node.getAttribute("cy")) } }
    } else {
        return getMinMaxCoords(node.getAttribute("d"))
    }
})

console.log(nodeCoordinates)

// get the coordinates of each edge
const edgeCoordinates = edges.map(edge => {
    if (edge.nodeName === "path") {
        return getMinMaxCoords(edge.getAttribute("d"))
    } else {
        return getArrowCoordinates(edge.getAttribute("points"))
    }
})

// for each node, get the edges that connect to it and nest the subsequent nodes under it
const nodeEdges = nodeCoordinates.map((node, i) => {
    const connectedEdges = edgeCoordinates.filter(edge => {
        return edge.start.x === node.start.x && edge.start.y === node.start.y
    })

    return {
        node,
        connectedEdges
    }
})

console.log(nodeEdges)