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
        let edgeList = this.graphUI.graph.dijkstra(this.startingVertex.label,
                                                        this.destinationVertex.label);
        super.highlightEdgeList(edgeList);
    }

    endOperation(){
        this.done=true;
        super.clearEdgesHighlight();
        this.startingVertex.flags.highlighted=false;
        this.destinationVertex.flags.highlighted=false;
    }
}