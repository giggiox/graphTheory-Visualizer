var graphUI=new GraphUI();

function setup() {
    var width=$('#canvas').width();
    var height=$('#canvas').height();
    let cnv=createCanvas(width, height);
    cnv.parent('canvas');
    graphUI.initRandomGraph();
}

function windowResized() {
    var width=$('#canvas').width();
    var height=$('#canvas').height();
    resizeCanvas(width, height);
}

function draw() {
    background(255);
    graphUI.render();
    let reprString=graphUI.graph.adjacencyListRepresentation();
    $("#graph-representation").html(reprString);
}

function touchStarted(){
    graphUI.mousePressedAction();
}

function touchMoved(){
    graphUI.mouseDraggedAction();
}

function touchEnded(){
    graphUI.mouseReleasedAction();
}

$(function(){
    $('#visualize-button').data('perform_id',"BFS");
});
$('#KRUSKAL').hover(function(){
    if(!$('#graph-weighted-checkbox').prop('checked')){
        $('#KRUSKAL').tooltip('enable');
    }else{
        $('#KRUSKAL').tooltip('disable');
    }
})
$('#DIJKSTRA').hover(function(){
    if(!$('#graph-weighted-checkbox').prop('checked')){
        $('#DIJKSTRA').tooltip('enable');
    }else{
        $('#DIJKSTRA').tooltip('disable');
    }
})

let endVisualization=false;
let previousText;
$('.algorithms').click(function(){
    if(($(this).attr('id') == "KRUSKAL" || $(this).attr('id') == "DIJKSTRA") && !$('#graph-weighted-checkbox').prop('checked')){
            return;
    }
    endVisualization=false;
    $("#visualize-button").attr("class","btn btn-success");
    $('#visualize-button').text("visualize " + $(this).text());
    $('#visualize-button').data('perform_id',$(this).attr('id'));
});

$('#graph-weighted-checkbox').click(function(){
    graphUI.setWeighted();
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
            graphUI.visualizeOperation(new KruskalOperation(graphUI));
            break;
        case "DIJKSTRA":
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

function showTwoVerticesTip(){
    $('#two-vertices-select-tip').show();
    setTimeout(function() { 
        $('#two-vertices-select-tip').fadeOut(); 
    }, 2500);
}
function showOneVertexTip(){
    $('#one-vertex-select-tip').show();
    setTimeout(function() { 
        $('#one-vertex-select-tip').fadeOut(); 
    }, 2500);
}

$('#delete-graph').click(function(){
    graphUI.deleteGraph();
})

$('#randomize-graph').click(function(){
    graphUI.createRandomizedGraph();
})


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