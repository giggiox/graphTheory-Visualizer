class GraphUI {
    constructor(graph=null) {
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
        this.isDirected = false;
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
            this.addingEdgeUtil(vertexUI1,vertexUI2);
            i++;
        }
    }

    /**
     * deletes current GraphUI, and initialiezes a new random GraphUI
     */
    createRandomizedGraph(){
        this.deleteGraph();
        if(Math.random()<0.05){
            this.drawPetersesGraph();
        }else{
            this.initRandomGraph();
        }
        
    }

    setWeighted(){
        this.isWeighted = !this.isWeighted;
        this.graph.isWeighted = this.isWeighted;
    }

    setDirected(){
        this.isDirected =! this.isDirected;
        let referenceToThis = this;

        this.edges.forEach(function(edgeUI){
            referenceToThis.graph.removeEdge(edgeUI.vertexUI1.label,edgeUI.vertexUI2.label);
        });

        this.graph.isDirected = this.isDirected;

        for(let i=0;i<this.edges.length;i++){
            let edgeUI=this.edges[i];
            let added=this.graph.addEdge(edgeUI.vertexUI1.label,edgeUI.vertexUI2.label);
            /*if switching from directed to undirected and the directed has a double edge in 2 vertices
                added will return false for the second vertex and we don't need to add it to undirected graph.*/
            if(!added){
                this.edges.splice(i,1); 
            } 
        }
    }

    /**
     * @param {any} label -label of created vertex 
     * @param {number} x -x spawn coordinate
     * @param {number} y -y spawn coordinate
     * @returns {VertexUI} -the added vertexUI
     */
    addVertex(label = null, x = null, y = null) {
        label == null ? label = this.vertices.length +1 : label;
        let vertex=new VertexUI(label,this,x,y);
        this.vertices.push(vertex);
        this.graph.addVertex(label);
        return vertex;
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
    updateVertexClickedForAddingEdge(vertexUI){
        if(this.addingEdge.startingVertex == null){
            this.addingEdge.startingVertex = vertexUI;
            vertexUI.flags.clicked=true;
        }else{
            if(!this.addingEdgeUtil(this.addingEdge.startingVertex,vertexUI)){
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
    addingEdgeUtil(vertexUI1,vertexUI2){
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
            let currentOperationName= this.currentOperation.constructor.name;
            this.currentOperation.endOperation();
            this.currentOperation = null;
            if(currentOperationName == operation.constructor.name) {
                return false;
            }
        }
        this.currentOperation=operation;
        return true;
    }


    /**
     * renders GraphUI elements that has to be rendered (vertices,edges,weights and operation), this method is called by p5js draw() default function
     */
    render() {
        this.renderEdges();
        this.renderVertices();
        
        if(this.currentOperation != null){
            this.currentOperation.render();
        }
    }


    renderEdges(){
        let referenceToThis = this;
        this.edges.forEach(function(edgeUI) {
    
            edgeUI.flags.hover = edgeUI.hasInside(Controls.getMouseX(),Controls.getMouseY());
            
            //constantly refresh weights
            if(referenceToThis.isWeighted){
                referenceToThis.graph.updateWeight(edgeUI.vertexUI1.label,edgeUI.vertexUI2.label,edgeUI.weight);
            }

            edgeUI.render();
        });
    }

    
    renderVertices(){
        let referenceToThis = this;
        this.vertices.forEach(function(vertexUI){
            vertexUI.flags.hover = vertexUI.hasInside(Controls.getMouseX(),Controls.getMouseY());
            vertexUI.render();
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
                    this.updateVertexClickedForAddingEdge(vertexUI);
                }
                vertexUI.flags.dragging = true;
                this.draggedVertex.vertex = vertexUI;
                return 1;
            }
        }

        for (let i = 0; i < this.edges.length; i++) {
            let edge = this.edges[i];
            if (edge.flags.hover) {
                /*remove edge from business logic (graph) */
                this.graph.removeEdge(edge.vertexUI1.label,edge.vertexUI2.label);

                /* remove edge from UI */
                this.edges.splice(i, 1); //splice(startPosition, deleteCount)
                return 1;
            }
        }
        return 0;
    }
   /**
     * this method is called p5js mouseDragged default function
     */
    mouseDraggedAction() {
        if (this.draggedVertex.vertex == null)
            return;
        this.draggedVertex.vertex.x = Controls.getMouseX();
        this.draggedVertex.vertex.y = Controls.getMouseY();
    }

   /**
     * this method is called p5js mouseReleased default function
     */
    mouseReleasedAction() {
        if (!this.draggedVertex.vertex)
            return;
        this.draggedVertex.vertex.flags.released=true;
        this.draggedVertex.vertex.flags.dragging = false;
        this.draggedVertex.vertex = undefined;
    }

    /*draws Petersen Graph*/
    drawPetersesGraph(){
        let v1=this.addVertex(1,width/2,150);
        let v2=this.addVertex(2,width/2-30,300);
        let v3=this.addVertex(3,width/2+30,300);
        let v4=this.addVertex(4,width/2+60,220);
        let v5=this.addVertex(5,width/2-60,220);
        let v6=this.addVertex(6,width/2,70);
        let v7=this.addVertex(7,width/2+60,390);
        let v8=this.addVertex(8,width/2-60,390);
        let v9=this.addVertex(9,width/2-150,200);
        let v10=this.addVertex(10,width/2+150,200);
        this.addingEdgeUtil(v1,v2);
        this.addingEdgeUtil(v2,v4);
        this.addingEdgeUtil(v4,v5);
        this.addingEdgeUtil(v5,v3);
        this.addingEdgeUtil(v3,v1);
        this.addingEdgeUtil(v1,v6);
        this.addingEdgeUtil(v5,v9);
        this.addingEdgeUtil(v4,v10);
        this.addingEdgeUtil(v2,v8);
        this.addingEdgeUtil(v3,v7);
        this.addingEdgeUtil(v9,v6);
        this.addingEdgeUtil(v9,v8);
        this.addingEdgeUtil(v8,v7);
        this.addingEdgeUtil(v7,v10);
        this.addingEdgeUtil(v10,v6);
    }
}