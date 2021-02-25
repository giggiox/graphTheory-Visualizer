class KruskalOperation{
    constructor(){
        this.graphUI = null;
    }

    updateVertexClicked(){}
    end(){
        this.graphUI.resetEdgesHighlight();
    }

    render(){
        this.graphUI.resetEdgesHighlight();
        let visitedEdges = this.graphUI.graph.kruskal();
        this.graphUI.highlightEdgeList(visitedEdges);
    }
}