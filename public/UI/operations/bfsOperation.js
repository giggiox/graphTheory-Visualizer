class BFSOperation{
    constructor(){
        this.continuoslyRendered=true;
        this.consecutiveClicks = false;
        this.graphUI = null;
        this.startingVertex = null;

        this.canRender=false;
    }

    update(vertexUI){
        if(this.startingVertex != null) return;
        this.startingVertex=vertexUI;
        vertexUI.flags.highlighted = true;
        this.canRender = true;
        //this.render();
    }

    render(){
        if(!this.canRender) return;
        this.graphUI.resetEdgesHighlight();
        let edgeList=this.graphUI.graph.BFS(this.startingVertex.label);
        this.graphUI.highlightEdgeList(edgeList);
    }

    end(){
        this.graphUI.resetEdgesHighlight();
        if(this.startingVertex != null) this.startingVertex.flags.highlighted = false;
    }
}