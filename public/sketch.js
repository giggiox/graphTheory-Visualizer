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
});
$('#KRUSKAL').hover(function(){
    if(!$('#graph-weighted-checkbox').prop('checked')){
        $('#KRUSKAL').tooltip('enable');
    }else{
        $('#KRUSKAL').tooltip('disable');
    }
})
$('.algorithms').click(function(){
    if(($(this).attr('id') == "KRUSKAL") && !$('#graph-weighted-checkbox').prop('checked')){
            return;
    }
    $('#visualize-button').text("visualize " + $(this).text());
    $('#visualize-button').data('perform_id',$(this).attr('id'));
});

$('#graph-weighted-checkbox').click(function(){
    graphUI.setWeighted();
})
$('#visualize-button').click(function(){
    let perform_id=$('#visualize-button').data('perform_id');
    switch(perform_id){
        case "BFS":
            graphUI.performBFS();
            break;
        case "DFS":
            graphUI.performDFS();
            break;
        case "KRUSKAL":
            graphUI.performKrskal();
            break;
        default:
            console.log("no action to perform");
    }
});

$('#btn-add-vertex').click(function(){
    graphUI.addVertex();
})

$('#btn-add-edge').click(function(){
    graphUI.addEdge();
})
