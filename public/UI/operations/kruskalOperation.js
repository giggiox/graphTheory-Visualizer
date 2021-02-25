class KruskalOperation{
    constructor(){
        this.continuoslyRendered=true;
        this.consecutiveClicks = false;
        this.graphUI = null;
    }

    update(){
    }
    end(){
        this.graphUI.resetEdgesHighlight();
    }

    render(){
        this.graphUI.resetEdgesHighlight();
        let visitedEdges = this.graphUI.graph.kruskal();
        this.graphUI.highlightEdgeList(visitedEdges);
    }
}