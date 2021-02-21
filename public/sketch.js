var graphUI=new GraphUI();
function setup() {
    createCanvas(windowWidth, windowHeight);

    graphUI.initRandomGraph();
    
    button = createButton("add vertex");
    button.position(10, 20);
    button.mousePressed(addVertex);

    button = createButton("add edge");
    button.position(10, 50);
    button.mousePressed(addEdge);

    check = createCheckbox("weighted TODO");
    check.position(10,80);
    check.mousePressed(weightedGraph);

    button = createButton("breadth-first search");
    button.position(10, 100);
    button.mousePressed(BFS);

    button = createButton("depth-first search");
    button.position(10, 120);
    button.mousePressed(DFS);

    button = createButton("kruskal");
    button.position(10, 140);
    button.mousePressed(kruskal);

}

function weightedGraph(){
    graphUI.setWeighted();
}

function BFS(){
    graphUI.performBFS();
}

function DFS(){
    graphUI.performDFS();
}

function kruskal(){
    graphUI.performKrskal();
}

function addVertex(){
    graphUI.addVertex();
}
function addEdge(){
    graphUI.addEdge();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255);
    graphUI.render();
}

function mousePressed(){
    graphUI.mousePressed();
}
function mouseDragged(){
    graphUI.mouseDragged();
}
function mouseReleased(){
    graphUI.mouseReleased();
}