let Graph = function() {

  let width = 900,
    height = 600
  
  let colors

  let simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(function(d) { return d.id }).distance(100))
    .force('charge', d3.forceManyBody().strength(-5))
    .force('center', d3.forceCenter(width / 2, height / 2))

  let link, node

  let n = function(selection) {
    selection.each(function(data) {

      node = d3.select(this).selectAll('circle')

      restart()

      function restart() {
        node = node.data(data, function(d) { return d.id })
        node.exit().remove()
        node = node.enter()
          .append('circle')
          .attr('fill', function(d) {
            return colors(d.group)
          })
          .attr('r', 7)
          .merge(node)

        let tip = d3.tip()
          .attr('class', 'tip')
          .offset([-5, 0])
          .html(function(d) { 
            return d.id + ': ' + d.group 
          })

        node.call(tip)
        node.on('mouseover', tip.show)
        node.on('mouseout', tip.hide)

        node.call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
        )       

        simulation
          .nodes(data)
          .on("tick", ticked);

        simulation.alpha(1).restart()
      }

      function ticked() {
        node.attr("cx", function(d) { return Math.max(25, Math.min(width - 25, d.x)) })
          .attr("cy", function(d) { return Math.max(25, Math.min(height - 25, d.y)) });

        link.attr("x1", function(d) { return Math.max(25, Math.min(width - 25, d.source.x)); })
          .attr("y1", function(d) { return Math.max(25, Math.min(height - 25, d.source.y)); })
          .attr("x2", function(d) { return Math.max(25, Math.min(width - 25, d.target.x)); })
          .attr("y2", function(d) { return Math.max(25, Math.min(height - 25, d.target.y)); });
      }

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    })
  }

  n.colors = function(c) {
    if (!c) return colors
    colors = c
    return this
  }
  
  let l = function(selection) {
    selection.each(function(data) {
      link = d3.select(this).selectAll('line')

      restart()
      function restart() {

        link = link.data(data, function(d) { return d.source.id + '-' + d.target.id})
        link.exit().remove()
        link = link.enter()
          .append('line')
          .attr('stroke-width', 2)
          .merge(link)

        simulation.force("link")
          .links(data);
      }
    })
  }

  return {link: l, node: n}
}