class GraphUI {
    constructor(graph = null) {
        this.graph = graph == null ? new Graph() : graph;
        this.vertices = [];
        this.edges = [];
        this.draggedVertex = {
            vertex: null,
            dx: null,
            dy: null
        }
        this.currentOperation = null;
        this.addingEdge ={
            enabled: false,
            startingVertex:null
        }
        this.isWeighted= false;
    }

    /**
     * deletes current GraphUI
     */
    deleteGraph(){
        this.graph=new Graph();
        this.vertices=[];
        this.edges=[];
        this.currentOperation=null;
        this.addingEdge.enabled = false;
        this.addingEdge.startingVertex = null;
    }

    /**
     * initialize random GraphUI
     */
    initRandomGraph(){
        let rnd=random(3,7);
        let i=0;
        while(i<rnd){
            this.addVertex();
            i++;
        }
        i=0;
        while(i<random(rnd,rnd+8)){
            let vertexUI1=this.vertices[Math.floor(Math.random() * this.vertices.length)]
            let vertexUI2=this.vertices[Math.floor(Math.random() * this.vertices.length)]
            this.#addingEdgeUtil(vertexUI1,vertexUI2);
            i++;
        }
    }

    /**
     * deletes current GraphUI, and initialiezes a new random GraphUI
     */
    createRandomizedGraph(){
        this.deleteGraph();
        this.initRandomGraph();
    }

    setWeighted(){
        this.isWeighted = !this.isWeighted;
        this.graph.isWeighted = this.isWeighted;
    }

    /**
     * @param {any} label -label of created vertex 
     * @param {number} x -x spawn coordinate
     * @param {number} y -y spawn coordinate
     */
    addVertex(label = null, x = null, y = null) {
        label == null ? label = this.vertices.length +1 : label;
        this.vertices.push(new VertexUI(label, x, y));
        this.graph.addVertex(label);
    }

    /**
     * @returns {boolean} true if edge is added, false otherwise
     */
    addEdge(){
        this.addingEdge.enabled=!this.addingEdge.enabled;
        if(!this.addingEdge.enabled && this.addingEdge.startingVertex != null){
            this.addingEdge.startingVertex.flags.clicked = false;
            this.addingEdge.startingVertex=null;
        }
        return this.addingEdge.enabled;
    }

    /**
     * if addingEdge is enabled, every time users click on a vertex, a "update notification" is sent to this function
     * which, if 2 vertices are clicked (and the second is valid, @see #addingEdgeUtil(VertexUI,VertexUI)) adds them to the graphUI 
     * @param {VertexUI} vertexUI - vertex clicked in UI 
     */
    #updateVertexClickedForAddingEdge(vertexUI){
        if(this.addingEdge.startingVertex == null){
            this.addingEdge.startingVertex = vertexUI;
            vertexUI.flags.clicked=true;
        }else{
            if(!this.#addingEdgeUtil(this.addingEdge.startingVertex,vertexUI)){
                vertexUI.blink(4);
                if(vertexUI != this.startingVertex){
                    vertexUI.flags.clicked= false;
                }
                return;
            }
            vertexUI.flags.clicked=false;
            this.addingEdge.startingVertex.flags.clicked=false;
            this.addingEdge.startingVertex=null;
            this.addingEdge.enabled = false;
        }
    }

    /**
     * utility method which checks for the 2 passed VertexUI, if they are valid this methods creates an edge in GraphUI and also in the Graph.
     * The two vertices are considered invalid if they are the same (no self loops allowed) or if an edge alredy exists (no multigraph allowed).
     * The validity checks is handled by the addEdge method in Graph class.
     * @param {VertexUI} vertexUI1 
     * @param {VertexUI} vertexUI2
     * @returns {boolean} - true if edge is added, false otherwise 
     */
    #addingEdgeUtil(vertexUI1,vertexUI2){
        let edgeAdded = this.graph.addEdge(vertexUI1.label,vertexUI2.label);
        if(!edgeAdded){
            return false;
        }
        this.edges.push(new EdgeUI(vertexUI1, vertexUI2,this));
        return true;
    }

    /**
     * visualize an operation: if trying to visualize the same Operation twice in a row, the first time
     * it will be displayed normally, the second time will call endOperation() and not continue (operation not visualized), this is done by checking constructor.name.
     * @param {Operation} operation - a subclass of Oberation class
     * @returns {boolean} - true if the operation is visualized, false otherwise
     */
    visualizeOperation(operation){
        if(this.currentOperation != null){
            let currentOperation= this.currentOperation;
            this.currentOperation.endOperation();
            this.currentOperation = null;
            if(currentOperation.constructor.name == operation.constructor.name) {
                return false;
            }
        }
        this.currentOperation=operation;
        operation.graphUI = this;
        return true;
    }


    /**
     * graphUI elements that has to be rendered, this method is called by p5js draw() default function
     */
    render() {
        this.#renderEdges();
        this.#renderVertices();

        if(this.currentOperation != null){
            this.currentOperation.render();
        }
    }


    #renderEdges(){
        let referenceToThis = this;
        this.edges.forEach(function (edge) {

            if (edge.isInside(mouseX, mouseY)) {
                edge.flags.hover = true;
            } else {
                edge.flags.hover = false;
            }
            
            //constantly refresh weights
            if(referenceToThis.isWeighted){
                referenceToThis.graph.updateWeight(edge.vertexUI1.label,edge.vertexUI2.label,edge.weight);
            }
            edge.render();
        });
    }

    #renderVertices(){
        this.vertices.forEach(vertex => {
            if (vertex.isInside(mouseX, mouseY)) {
                vertex.flags.hover = true;
            } else {
                vertex.flags.hover = false;
            }
            vertex.render();
        });
    }

    /**
     * this method is called p5js mousePressed default function
     */
    mousePressedAction() {
        for (let i = 0; i < this.vertices.length; i++) {
            let vertexUI = this.vertices[i];
            if (vertexUI.flags.hover) {

                /*send clicked vertex for currentOperation, similar to Observer design pattern*/
                if(this.currentOperation != null){
                    this.currentOperation.updateVertexClicked(vertexUI);
                }
                /*send an update message to clicked vertex for adding edge*/
                if(this.addingEdge.enabled){
                    this.#updateVertexClickedForAddingEdge(vertexUI);
                }
                vertexUI.flags.dragging = true;
                this.draggedVertex.vertex = vertexUI;
                break;
            }
        }

        for (let i = 0; i < this.edges.length; i++) {
            let edge = this.edges[i];
            if (edge.flags.hover) {
                /*remove edge from business logic (graph) */
                this.graph.removeEdge(edge.vertexUI1.label,edge.vertexUI2.label);
                /* remove edge from UI */
                this.edges.splice(i, 1); //splice(startPosition, deleteCount)
                return;
            }
        }
    }
   /**
     * this method is called p5js mouseDragged default function
     */
    mouseDraggedAction() {
        if (!this.draggedVertex.vertex)
            return;
        this.draggedVertex.vertex.x = mouseX - this.draggedVertex.dx;
        this.draggedVertex.vertex.y = mouseY - this.draggedVertex.dy;
    }

   /**
     * this method is called p5js mouseReleased default function
     */
    mouseReleasedAction() {
        if (!this.draggedVertex.vertex)
            return;
        this.draggedVertex.vertex.flags.dragging = false;
        this.draggedVertex.vertex = undefined;
    }
}