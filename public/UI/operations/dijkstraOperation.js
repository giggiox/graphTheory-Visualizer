class DijkstraOperation extends Operation{
    constructor(){
        super();
        this.graphUI = null;
        this.startingVertex = null;
        this.destinationVertex = null;
        this.startHighlight = false;
        this.done=false;
    }

    updateVertexClicked(vertexUI){
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
        super.clearEdgesHighlight();
        let visitedEdges = this.graphUI.graph.dijkstra(this.startingVertex.label,this.destinationVertex.label);
        super.highlightEdgeList(visitedEdges);
    }
    end(){
        this.done=true;
        super.clearEdgesHighlight();
        this.startingVertex.flags.highlighted=false;
        this.destinationVertex.flags.highlighted=false;

    }
}