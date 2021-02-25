class Operation{
    constructor(){
        this.graphUI =null;
    }

    clearEdgesHighlight(){
        this.graphUI.edges.forEach(function(edgeUI){
            edgeUI.flags.highlighted=false;
        });
    }

    highlightEdgeList(edgeList){
        let referenceToThis=this;
        edgeList.forEach(function (edge) {
            //have to find the corrisponding UI edge that has edge.u.info as "first" vertex and edge.v.info as "second" vertex
            referenceToThis.graphUI.edges.forEach(function(edgeUI){
                if((edgeUI.vertexUI1.label == edge.u.info || edgeUI.vertexUI1.label == edge.v.info) && (edgeUI.vertexUI2.label == edge.u.info || edgeUI.vertexUI2.label == edge.v.info)){
                    edgeUI.flags.highlighted = true;
                }
            });
        });
    }


}