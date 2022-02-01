var graphUI=new GraphUI();

function setup() {
    var width=$('#canvas').width();
    var height=$('#canvas').height();
    var canvas=createCanvas(width, height);
    canvas.parent('canvas');
    canvas.mouseWheel(e => Controls.zoom(e));
    graphUI.initRandomGraph();
}

function windowResized() {
    var width=$('#canvas').width();
    var height=$('#canvas').height();
    resizeCanvas(width, height);
}

function draw() {
    background(255);
    translate(Controls.tx, Controls.ty);
    scale(Controls.scaleFactor);
    graphUI.render();
    let reprString=graphUI.graph.adjacencyListRepresentation();
    $("#graph-representation").html(reprString);
}

function mousePressed(e){
    let done=graphUI.mousePressedAction();
    if(!done){
        Controls.mousePressed(e);
    }
}

function mouseDragged(e){
    Controls.mouseDragged(e);
    graphUI.mouseDraggedAction();
}

function mouseReleased(e){
    Controls.mouseReleased(e);
    graphUI.mouseReleasedAction();
}

$(function(){
    $('#visualize-button').data('perform_id',"BFS");
});

var endVisualization=false;
var previousText;
$('.algorithms').click(function(){
    if($(this).attr('id') == "DIJKSTRA" && !$('#graph-weighted-checkbox').prop('checked')){
        showGraphWeightedDanger();
        return;
    }
    if($(this).attr('id') == "KRUSKAL" && (!$('#graph-weighted-checkbox').prop('checked') || $('#graph-directed-checkbox').prop('checked'))){
        showGraphWeightedUndirectedDanger();
        return;
    }

    /* visualize an "empty" operation, so the highlightings will reset */
    if(graphUI.currentOperation != null){
        graphUI.visualizeOperation(new Operation());
    }

    endVisualization=false;
    $("#visualize-button").attr("class","btn btn-success");
    $('#visualize-button').text("visualize " + $(this).text());
    $('#visualize-button').data('perform_id',$(this).attr('id'));
});

$('#graph-weighted-checkbox').click(function(){
    graphUI.setWeighted();
})

$('#graph-directed-checkbox').click(function(){
    graphUI.setDirected();
})


$('#visualize-button').click(function(){
    let perform_id=$('#visualize-button').data('perform_id');
    let doubleclicked;
    switch(perform_id){
        case "BFS":
            doubleclicked=graphUI.visualizeOperation(new BFSOperation(graphUI));
            if(doubleclicked)showOneVertexTip();
            break;
        case "DFS":
            doubleclicked=graphUI.visualizeOperation(new DFSOperation(graphUI));
            if(doubleclicked)showOneVertexTip();
            break;
        case "KRUSKAL":
            if(!$('#graph-weighted-checkbox').prop('checked') || $('#graph-directed-checkbox').prop('checked')){
                showGraphWeightedUndirectedDanger();
                return;
            }
            graphUI.visualizeOperation(new KruskalOperation(graphUI));
            break;
        case "DIJKSTRA":
            if(!$('#graph-weighted-checkbox').prop('checked')){
                showGraphWeightedDanger();
                return;
            }
            doubleclicked=graphUI.visualizeOperation(new DijkstraOperation(graphUI)); 
            if(doubleclicked)showTwoVerticesTip();
            break;
        default:
            console.log("no action to perform");
    }
    endVisualization = !endVisualization;

    if(endVisualization){
        previousText=$("#visualize-button").text();
        $("#visualize-button").text("end visualization");
        $("#visualize-button").attr("class","btn btn-danger");
    }else{
        $("#visualize-button").text(previousText);
        $("#visualize-button").attr("class","btn btn-success");
    }
    
});

$('#btn-add-vertex').click(function(){
    graphUI.addVertex();
})

$('#btn-add-edge').click(function(){
    let added=graphUI.addEdge();
    if(added)
        showTwoVerticesTip();
})


function showTipsWithDelay(tipID){
    $('#'+tipID).show();
    setTimeout(function() { 
        $('#'+tipID).fadeOut(); 
    }, 2500);
}
function showTwoVerticesTip(){
    showTipsWithDelay("two-vertices-select-tip");
}
function showOneVertexTip(){
    showTipsWithDelay("one-vertex-select-tip");
}

function showGraphWeightedDanger(){
    showTipsWithDelay("graph-weighted-danger");
}

function showGraphWeightedUndirectedDanger(){
    showTipsWithDelay("graph-weighted-undirected-danger");
}

$('#delete-graph').click(function(){
    graphUI.deleteGraph();
    resetInterface();
})

$('#randomize-graph').click(function(){
    graphUI.createRandomizedGraph();
    resetInterface();
})

function resetInterface(){
    $("#visualize-button").attr("class","btn btn-success");
    $('#visualize-button').text("visualize breadth-first search");
    $('#visualize-button').data('perform_id',"BFS");
    endVisualization = false;
}


let graphRepresentationToggle=false;
$("#representation-button").click(function() {
    //"overriding" dropdown basic functions, in order to not hide dropdown when focus out.
    //the dropdown has to hide/show only when the button is clicked,never in any other way
    if(graphRepresentationToggle){
        //since there is no dropdown('untoggle'), removethe data-toggle attribute will do the work.
        $("#representation-button").attr("data-toggle","dropdown"); 
        graphRepresentationToggle=false;
    }else{
        $("#representation-button").attr("data-toggle","");
        $("#representation-button").dropdown('toggle');
        graphRepresentationToggle=true;
    }
});