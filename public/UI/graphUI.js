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

        this.addingEdgeMode={
            enabled: false,
            vertices: []
        }

        this.performingBFS = false;
        this.performingDFS = false;
        this.performKruskal = false;
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
    }

    render() {
        this.#renderEdges();
        this.#renderVertices();
        this.#renderKruskal();
        text(this.graph.toString(), windowWidth-300, windowHeight-300);
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

                this.#addingEdge(vertexUI);
                
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

        //this.#updateDraggedVertexPosition();
    }


    setWeighted(){
        this.isWeighted = !this.isWeighted;
        this.graph.isWeighted = this.isWeighted;
    }

    #addingEdge(vertexUI){
        /*adding edge mode */
        if (this.addingEdgeMode.enabled) {
            vertexUI.flags.clicked = true;
            this.addingEdgeMode.vertices.push(vertexUI);
            if (this.addingEdgeMode.vertices.length == 2) {
                let done=this.#addingEdgeUtil(this.addingEdgeMode.vertices[0],this.addingEdgeMode.vertices[1])
                if(!done){
                    /* make the invalid clicked vertex blink*/
                    this.addingEdgeMode.vertices[1].blink();
                    /* if i wasn't trying to create a self loop, "unclick" the second vertex
                    * otherwise the vertex has to stay clicked
                    */
                    if(this.addingEdgeMode.vertices[1] != this.addingEdgeMode.vertices[0])
                        this.addingEdgeMode.vertices[1].flags.clicked=false;
                    this.addingEdgeMode.vertices.splice(-1,1);
                }else{
                    this.addingEdgeMode.vertices[0].flags.clicked = false;
                    this.addingEdgeMode.vertices[1].flags.clicked = false;
                    this.addingEdgeMode.vertices = [];
                    this.addingEdgeMode.enabled=false;
                }
            }
        }
        /* */
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
        this.#updateDraggedVertexPosition();
    }

    #updateDraggedVertexPosition(){
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


    performBFS(){
        /* the second time button is clicked it will reset all the edges highlighted and return */
        if(this.performingBFS){
            this.performingBFS = false;
            this.#resetEdgesHighlight();
            return;
        }

        this.performingBFS=true;
        let visitedEdges = this.graph.BFS(1);
        this.#highlightEdgeList(visitedEdges);
    }

    performDFS(){
        /* the second time button is clicked it will reset all the edges highlighted and return */
        if(this.performingDFS){
            this.performingDFS = false;
            this.#resetEdgesHighlight();
            return;
        }

        this.performingDFS=true;
        let visitedEdges = this.graph.DFS(1);
        this.#highlightEdgeList(visitedEdges);
    }

    performKrskal(){
        /* the second time button is clicked it will reset all the edges highlighted and return */
        if(this.performingKruskal){
            this.performingKruskal = false;
            this.#resetEdgesHighlight();
        }else{
            this.performingKruskal = true;
        }
        /*kruskal is countinuosly rendered inside the render function */        
    }

    #renderKruskal(){
        if(!this.performingKruskal) return;
        this.#resetEdgesHighlight();
        let visitedEdges = this.graph.kruskal();
        this.#highlightEdgeList(visitedEdges);
    }

    #highlightEdgeList(edgeList){
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

    #resetEdgesHighlight(){
        this.edges.forEach(function(edgeUI){
            edgeUI.flags.highlighted=false;
        });
    }
}