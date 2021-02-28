class DFSOperation extends Operation{
    constructor(graphUI){
        super(graphUI);
        this.startingVertex = null;
        this.canRender=false;
    }

    updateVertexClicked(vertexUI){
        if(this.startingVertex != null) return;
        this.startingVertex=vertexUI;
        vertexUI.flags.highlighted = true;
        this.canRender=true;
    }

    render(){
        if(!this.canRender) return;
        super.clearEdgesHighlight();
        let edgeList=this.graphUI.graph.DFS(this.startingVertex.label);
        super.highlightEdgeList(edgeList);
    }

    endOperation(){
        super.clearEdgesHighlight();
        if(this.startingVertex != null)
            this.startingVertex.flags.highlighted = false;
    }
}