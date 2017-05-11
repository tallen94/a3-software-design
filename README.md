## Building a Network Graph
Builds a basic force directed network graph

#### Constructor

``` 
Graph(element, width, height)
```
Creates a new graph inside the element with width and height. Returns a graph object for modifying properties about the graph

* `@param element`  css selector for graph container
* `@param width`    width of canvas 
* `@param height`   height of canvas

#### Graph.setColors(colors)

Sets the color scheme for the node fill. The colors are default set to 
`d3.scaleOrdinal(d3.schemeCategory20)`

* `@param colors` d3 color function 

#### Graph.height(h)

Sets the height of the draw canvas
* `param h` height of canvas 


#### Graph.data(nodes, links)
Set the nodes and links for the graph.
* `@param nodes` array of node objects
* `@param links` array of link objects


#### Graph.nodes(nodes)

Sets the node data if supplied. If no arguments are given it returns the current list of nodes.

* `@param nodes` array of node objects


#### Graph.mapNodes(id, group)
Map the node data to fit d3 specification. Use this if your data does not already match 
```
{
  id: string,
  group: string
}
```
* `@param id` string key from original data that will be used as node id's
* `@param group` string key from original data that will specify a node's group

#### Graph.mapLinks(source, target, value)
Map the link data to fit d3 specification. Use this if your data does not already match
```
{
  source: string, 
  target: string, 
  value: number
}
```

* `@param source` string key that is the source node of a link
* `@param target` string key that is the target node of a link
* `@param value` string key that is the value for each link

#### Graph.addNodes( )
Call this to `enter()` the node elements

#### Graph.addLinks( )
Call this to `enter()` the link elements

#### Graph.nodeRadius(r)
Set the radius of each node. Can be a function or number.

* `@param r` Radius of the nodes

#### Graph.nodeFill( )
Make the node fill be the current graph color scheme. It uses `node.group` to scale the color.

#### Graph.linkWidth(w)
Set the link width. Can be a function to use link.value as the width, for example.

#### Graph.drag( )
Enable dragging of the nodes.

#### Graph.start( )
Start the graph force animation and show the elements on the screen.


