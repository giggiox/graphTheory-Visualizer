class BFSOperation extends Operation{
    constructor(){
        super();
        this.graphUI = null;
        this.startingVertex = null;
        this.canRender=false;
    }

    updateVertexClicked(vertexUI){
        if(this.startingVertex != null) return;
        this.startingVertex=vertexUI;
        vertexUI.flags.highlighted = true;
        this.canRender = true;
    }

    render(){
        if(!this.canRender) return;
        super.clearEdgesHighlight();
        let edgeList=this.graphUI.graph.BFS(this.startingVertex.label);
        super.highlightEdgeList(edgeList);
    }

    end(){
        super.clearEdgesHighlight();
        if(this.startingVertex != null) this.startingVertex.flags.highlighted = false;
    }
}