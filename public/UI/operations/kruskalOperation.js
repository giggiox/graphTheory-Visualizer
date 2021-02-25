class KruskalOperation extends Operation{
    constructor(){
        super();
        this.graphUI = null;
    }

    updateVertexClicked(){}
    end(){
        super.clearEdgesHighlight();
    }

    render(){
        super.clearEdgesHighlight();
        let visitedEdges = this.graphUI.graph.kruskal();
        super.highlightEdgeList(visitedEdges);
    }
}