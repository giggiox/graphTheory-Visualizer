class KruskalOperation extends Operation{
    constructor(graphUI){
        super(graphUI);
        this.graphUI = null;
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