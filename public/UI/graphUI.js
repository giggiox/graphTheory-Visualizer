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
            startingVertex:null,
            done:false
        }
        this.isWeighted= false;
    }

    delete(){
        this.graph=new Graph();
        this.vertices=[];
        this.edges=[];
        this.currentOperation=null;
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
            this.#addingEdgeUtil(vertexUI1,vertexUI2);
            i++;
        }
    }

    randomize(){
        this.delete();
        this.initRandomGraph();
    }

    addVertex(u = null, x = null, y = null) {
        u == null ? u = this.vertices.length +1 : u;
        this.vertices.push(new VertexUI(u, x, y));
        this.graph.addVertex(u);
    }

    setWeighted(){
        this.isWeighted = !this.isWeighted;
        this.graph.isWeighted = this.isWeighted;
    }

    /*
    * return true if edge is added, false otherwise
    */
    addEdge(){
        this.addingEdge.enabled=!this.addingEdge.enabled;
        if(!this.addingEdge.enabled && this.addingEdge.startingVertex != null){
            this.addingEdge.startingVertex.flags.clicked = false;
            this.addingEdge.startingVertex=null;
        }
        return this.addingEdge.enabled;
    }

    #updateVertexClickedForAddingEdge(vertexUI){
        if(this.addingEdge.startingVertex == null){
            this.addingEdge.startingVertex = vertexUI;
            vertexUI.flags.clicked=true;
        }else{
            if(!this.#addingEdgeUtil(this.addingEdge.startingVertex,vertexUI)){
                vertexUI.blink();
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

    #addingEdgeUtil(vertexUI1,vertexUI2){
        let edgeAdded = this.graph.addEdge(vertexUI1.label,vertexUI2.label);
        if(!edgeAdded){
            return false;
        }
        this.edges.push(new EdgeUI(vertexUI1, vertexUI2,this));
        return true;

    }

   


    render() {
        this.#renderEdges();
        this.#renderVertices();

        if(this.currentOperation != null){
            this.currentOperation.render();
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

                /*send clicked vertex for operations*/
                if(this.currentOperation != null){
                    this.currentOperation.updateVertexClicked(vertexUI);
                }
                /*send clicked vertex for adding edge*/
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
        if(this.currentOperation != null){
            let currentOperation= this.currentOperation;
            this.currentOperation.end();
            this.currentOperation = null;
            if(currentOperation.constructor.name == operation.constructor.name) return false;
        }

        this.currentOperation=operation;
        operation.graphUI = this;
        return true;
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