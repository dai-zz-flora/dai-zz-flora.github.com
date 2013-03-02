function build_tree(root,container_selector,width,height){
    var cluster = d3.layout.tree().size([width, height - 160]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.x, d.y]; });

    var svg = d3.select(container_selector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0,40)");


    var nodes = cluster.nodes(root),
        links = cluster.links(nodes);
    var paths = [];

    var line = d3.svg.line()
        .x(function(d) { 
            return d.x; 
        })
        .y(function(d) { 
            return d.y;
        });

    for( var st in links){
        var o = links[st];
        var source = o.source;
        var target = o.target;
        var l = [source,target]
            paths.push(l);
    }

    var link = svg.selectAll(".link")
        //.data(links)
        .data(paths)
        .enter().append("path")
        .attr("class", "link")
        //      .attr("d", diagonal);
        .attr("d", line);

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

    node.append("circle").attr("r", 20)
        .attr("class", function(d){
            return d.node.high?"h_node_circle":"node_circle";
        })
     

    node.append("text")
        .attr("dy", 6)
        .style("text-anchor", "middle")
        .text(function(d) { return d.node.value; });


    node.append("text")
        .attr("dy", -25)
        .style("text-anchor", "middle")
        .text(function(d) { return d.node.index; });

}

function max_heapify(array,i,trace){
    var l = left(i);
    var r = right(i);
    var length = array.length;
    var largest = i;
    if(l<=length && array[l-1]>array[i-1]){
        largest  = l;
    }

    if(r<=length && array[r-1]> array[largest-1]){
        largest = r;
    }

    if(largest!=i){
        var tmp = array[i-1];
        array[i-1] = array[largest-1];
        array[largest-1] = tmp;
        trace.push(heap2tree(array,1,largest));
        max_heapify(array,largest,trace);
    }

}


function heap2tree(array,index,highlighting){
    var length = array.length;
    if(index<=0||index>length){
        return ;
    }

    var real_i = index-1;

    var root = {
        "node":{"index":index,"value":array[real_i],"high":index==highlighting?true:false}
    }

    var children = [];

    var left_i = left(index);
    if(left_i<=length){
        var left_c = heap2tree(array,left_i,highlighting);
        children.push(left_c);
    }


    var right_i = right(index);
    if(right_i<=length){
        var right_c = heap2tree(array,right_i,highlighting);
        children.push(right_c);
    }

    if(children.length>0){
        root["children"] = children;
    }

    return root;


    
}

function parent(i){
    return Math.floor(i/2);
}


function left(i){
    return i*2;
}

function right(i){
    return i*2+1;
}
