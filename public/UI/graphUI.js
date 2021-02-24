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
        this.currentOperationConsecutiveClicks=null;

        this.isWeighted= false;
    }

    delete(){
        this.graph=new Graph();
        this.vertices=[];
        this.edges=[];
    }

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
            this.#addingEdgeUtil(vertexUI1,vertexUI2)
            i++;
        }
    }

    addVertex(u = null, x = null, y = null) {
        u == null ? u = this.vertices.length +1 : u;
        this.vertices.push(new VertexUI(u, x, y));
        this.graph.addVertex(u);
    }

    /*
    * returns true if edge is added, false otherwise
    */
    addEdge() {
        /* switch true and false if button is clicked more two+ times */
        this.addingEdgeMode.enabled = !this.addingEdgeMode.enabled;

        /* 
        * if edge mode is clicked the 2nd time after a vertex is being clicked, have to reset clicked vertices
        * (tha array only has it's first element vertices[0]) and the vertices[0] clicked color has to be reset 
        */
        if(!this.addingEdgeMode.enabled){
            this.addingEdgeMode.vertices.forEach(function(vertexUI){
                vertexUI.flags.clicked = false;
            });
            this.addingEdgeMode.vertices=[];
        }
        return this.addingEdgeMode.enabled;
    }

    render() {
        this.#renderEdges();
        this.#renderVertices();

        if(this.currentOperation != null){
            if(this.currentOperation.continuoslyRendered){
                this.currentOperation.render();
            } 
        }


        //TODO volatile window with different representations
        textSize(13);
        text(this.graph.toString(), width-200, height-200);
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
    #renderEdges(){
        let reference = this;
        this.edges.forEach(function (edge) {
            if (edge.isInside(mouseX, mouseY)) {
                edge.flags.hover = true;
            } else {
                edge.flags.hover = false;
            }
            if(reference.isWeighted){
                reference.graph.addWeight(edge.vertexUI1.label,edge.vertexUI2.label,edge.weight);
            }
            edge.render();
        });
    }

    mousePressed() {
        for (let i = 0; i < this.vertices.length; i++) {
            let vertexUI = this.vertices[i];
            if (vertexUI.flags.hover) {

                //this.#addingEdge(vertexUI);

                //this.#chosing2VerticesDijkstra(vertexUI);
                if(this.currentOperation != null){
                    console.log(this.currentOperation);
                    this.currentOperation.update(vertexUI);
                }
                if(this.currentOperationConsecutiveClicks != null){
                    this.currentOperationConsecutiveClicks.update(vertexUI);
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


    setWeighted(){
        this.isWeighted = !this.isWeighted;
        this.graph.isWeighted = this.isWeighted;
    }

    #addingEdgeUtil(vertexUI1,vertexUI2){
        let edgeAdded = this.graph.addEdge(vertexUI1.label,vertexUI2.label);
        if(!edgeAdded){
            return false;
        }
        this.edges.push(new EdgeUI(vertexUI1, vertexUI2,this));
        return true;

    }

    mouseDragged() {
        if (!this.draggedVertex.vertex)
            return;
        this.draggedVertex.vertex.x = mouseX - this.draggedVertex.dx;
        this.draggedVertex.vertex.y = mouseY - this.draggedVertex.dy;
    }


    mouseReleased() {
        if (!this.draggedVertex.vertex) return;
        this.draggedVertex.vertex.flags.dragging = false;
        this.draggedVertex.vertex = undefined;
    }


    visualizeOperation(operation){
        if(this.currentOperation != null && !operation.consecutiveClicks){
            let currentOperation= this.currentOperation;
            this.currentOperation.end();
            this.currentOperation = null;
            if(currentOperation.constructor.name == operation.constructor.name) return;
        }
        if(operation.consecutiveClicks){
            this.currentOperationConsecutiveClicks=operation;
        }else{
            this.currentOperation=operation;
        }
        
        
        operation.graphUI = this;
        
    }



    highlightEdgeList(edgeList){
        let referenceToThis=this;
        edgeList.forEach(function (edge) {
            //have to find the corrisponding UI edge that has edge.u.info as "first" vertex and edge.v.info as "second" vertex
            referenceToThis.edges.forEach(function(edgeUI){
                if((edgeUI.vertexUI1.label == edge.u.info || edgeUI.vertexUI1.label == edge.v.info) && (edgeUI.vertexUI2.label == edge.u.info || edgeUI.vertexUI2.label == edge.v.info)){
                    edgeUI.flags.highlighted = true;
                }
            });
        });
    }

    resetEdgesHighlight(){
        this.edges.forEach(function(edgeUI){
            edgeUI.flags.highlighted=false;
        });
    }


}

class BFSOperation{
    constructor(){
        this.continuoslyRendered=false;
        this.consecutiveClicks = false;
        this.graphUI = null;
        this.startingVertex = null;
    }

    update(vertexUI){
        if(this.startingVertex != null) return;
        this.startingVertex=vertexUI;
        vertexUI.flags.highlighted = true;
        this.#visualize();
    }

    #visualize(){
        let edgeList=this.graphUI.graph.BFS(this.startingVertex.label);
        this.graphUI.highlightEdgeList(edgeList);
    }

    end(){
        this.graphUI.resetEdgesHighlight();
        if(this.startingVertex != null) this.startingVertex.flags.highlighted = false;
    }
}

class DFSOperation{
    constructor(){
        this.continuoslyRendered=false;
        this.consecutiveClicks = false;
        this.graphUI = null;
        this.startingVertex = null;
    }

    update(vertexUI){
        if(this.startingVertex != null) return;
        this.startingVertex=vertexUI;
        vertexUI.flags.highlighted = true;
        this.#visualize();
    }

    #visualize(){
        let edgeList=this.graphUI.graph.DFS(this.startingVertex.label);
        this.graphUI.highlightEdgeList(edgeList);
    }

    end(){
        this.graphUI.resetEdgesHighlight();
        if(this.startingVertex != null) this.startingVertex.flags.highlighted = false;
    }
}

class AddEdgeOperation{
    constructor(){
        this.continuoslyRendered=false;
        this.consecutiveClicks = true;
        this.graphUI = null;
        this.startingVertex = null;
        this.done = false;
    }

    update(vertexUI){
        if(this.done) return;
        if(this.startingVertex == null){
            this.startingVertex = vertexUI;
            vertexUI.flags.clicked=true;
        }else{
            let edgeAdded = this.graphUI.graph.addEdge(this.startingVertex.label,vertexUI.label);
            if(!edgeAdded){
                vertexUI.blink();
                if(vertexUI != this.startingVertex){
                    vertexUI.flags.clicked= false;
                }
                return;
            }
            this.graphUI.edges.push(new EdgeUI(this.startingVertex, vertexUI,this.graphUI));
            vertexUI.flags.clicked=false;
            this.startingVertex.flags.clicked=false;
            this.done=true;
        }
    }
    end(){

    }
}


class KruskalOperation{
    constructor(){
        this.continuoslyRendered=true;
        this.consecutiveClicks = false;
        this.graphUI = null;
    }

    update(){
    }
    end(){
        this.graphUI.resetEdgesHighlight();
    }

    render(){
        this.graphUI.resetEdgesHighlight();
        let visitedEdges = this.graphUI.graph.kruskal();
        this.graphUI.highlightEdgeList(visitedEdges);
    }
}


class DijkstraOperation{
    constructor(){
        this.continuoslyRendered=true;
        this.consecutiveClicks = false;
        this.graphUI = null;
        this.startingVertex = null;
        this.destinationVertex = null;
        this.startHighlight = false;
        this.done=false;
    }

    update(vertexUI){
        if(this.startHighlight) return;
        if(this.startingVertex == null){
            this.startingVertex = vertexUI;
            vertexUI.flags.highlighted=true;
        }else{
            this.destinationVertex = vertexUI;
            vertexUI.flags.highlighted=true;
            this.startHighlight=true;
        }
    }

    render(){
        if(!this.startHighlight || this.done) return;
        this.graphUI.resetEdgesHighlight();
        let visitedEdges = this.graphUI.graph.dijkstra(this.startingVertex.label,this.destinationVertex.label);
        this.graphUI.highlightEdgeList(visitedEdges);
    }
    end(){
        this.done=true;
        this.graphUI.resetEdgesHighlight();
        this.startingVertex.flags.highlighted=false;
        this.destinationVertex.flags.highlighted=false;

    }
}