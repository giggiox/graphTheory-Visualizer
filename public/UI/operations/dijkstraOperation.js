class DijkstraOperation extends Operation{
    constructor(graphUI){
        super(graphUI);
        this.startingVertex = null;
        this.destinationVertex = null;
        this.canRender = false;
        this.done=false;
    }

    updateVertexClicked(vertexUI){
        if(this.canRender) return;
        if(this.startingVertex == null){
            this.startingVertex = vertexUI;
            vertexUI.flags.highlighted=true;
        }else{
            this.destinationVertex = vertexUI;
            vertexUI.flags.highlighted=true;
            this.canRender=true;
        }
    }

    render(){
        if(!this.canRender || this.done) return;
        super.clearEdgesHighlight();
        let edgeList = this.graphUI.graph.dijkstra(this.startingVertex.label,this.destinationVertex.label);
        if(edgeList != null) //if the graph is directed, there might not even be a path
            super.highlightEdgeList(edgeList);
    }

    endOperation(){
        this.done=true;
        super.clearEdgesHighlight();
        if(this.startingVertex != null) 
            this.startingVertex.flags.highlighted=false;
        if(this.destinationVertex != null)
            this.destinationVertex.flags.highlighted=false;
    }
}