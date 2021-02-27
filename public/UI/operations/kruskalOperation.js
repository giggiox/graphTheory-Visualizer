class KruskalOperation extends Operation{
    constructor(graphUI){
        super(graphUI);
    }

    endOperation(){
        super.clearEdgesHighlight();
    }

    render(){
        super.clearEdgesHighlight();
        let edgeList = this.graphUI.graph.kruskal();
        super.highlightEdgeList(edgeList);
    }
}