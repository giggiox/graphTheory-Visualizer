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
}

function mousePressed(){
    graphUI.mousePressed();
}
function mouseDragged(){
    graphUI.mouseDragged();
}
function mouseReleased(){
    graphUI.mouseReleased();
}

$(function(){
    $('#visualize-button').data('perform_id',"BFS");
    $('#first-vertex-select-tip').hide();
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


let previous;
$('.algorithms').click(function(){
    if(($(this).attr('id') == "KRUSKAL" || $(this).attr('id') == "DIJKSTRA") && !$('#graph-weighted-checkbox').prop('checked')){
            return;
    }
    $("#visualize-button").attr("class","btn btn-success");
    $('#visualize-button').text("visualize " + $(this).text());

    $('#visualize-button').data('perform_id',$(this).attr('id'));
});

$('#graph-weighted-checkbox').click(function(){
    graphUI.setWeighted();
})

let previusText;
$('#visualize-button').click(function(){
    let perform_id=$('#visualize-button').data('perform_id');
    switch(perform_id){
        case "BFS":
            graphUI.visualizeOperation(new BFSOperation());
            break;
        case "DFS":
            graphUI.visualizeOperation(new DFSOperation());
            break;
        case "KRUSKAL":
            graphUI.visualizeOperation(new KruskalOperation());
            break;
        case "DIJKSTRA":
            graphUI.visualizeOperation(new DijkstraOperation());
            break;
        default:
            console.log("no action to perform");
    }

    $("#visualize-button").text("clear visualization");
    $("#visualize-button").attr("class","btn btn-danger");
});

$('#btn-add-vertex').click(function(){
    graphUI.addVertex();
})

$('#btn-add-edge').click(function(){
    
    //let added=graphUI.addEdge();
    let added=graphUI.visualizeOperation(new AddEdgeOperation());
    if(added){
        $('#first-vertex-select-tip').show();
        setTimeout(function() { 
            $('#first-vertex-select-tip').fadeOut(); 
        }, 2500);
    }
    
   
})

$('#delete-graph').click(function(){
    graphUI.delete();
})