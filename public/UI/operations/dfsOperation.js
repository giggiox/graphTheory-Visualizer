class DFSOperation{
    constructor(){
        this.graphUI = null;
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
        this.graphUI.resetEdgesHighlight();
        let edgeList=this.graphUI.graph.DFS(this.startingVertex.label);
        this.graphUI.highlightEdgeList(edgeList);
    }

    end(){
        this.graphUI.resetEdgesHighlight();
        if(this.startingVertex != null) this.startingVertex.flags.highlighted = false;
    }
}