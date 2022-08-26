export default `
core {
	active-bg-color: rgb(52, 58, 64);
	active-bg-opacity: 0.333;
}

edge {
	curve-style: straight;
	opacity: 0.333;
	width: 5px;
	z-index: 0;
	overlay-opacity: 0;
  events: no;
}

node {
	width: 100;
	height: 100;
	font-size: 9;
	font-weight: bold;
	min-zoomed-font-size: 4;
	label: data(name);
	text-wrap: wrap;
	text-max-width: 70;
	text-valign: center;
	text-halign: center;
	text-events: yes;
	color: #000;
	text-outline-width: 1;
	text-outline-color: #fff;
	text-outline-opacity: 1;
	overlay-color: #fff;
}

edge[interaction = "cc"] {
	line-color: #FACD37;
	opacity: 0.666;
	z-index: 9;
	width: 4;
}

node[NodeType = "saga"],
node[NodeType = "saga"] {
	background-color: #9e79db;
	text-outline-color: white;
}

node[NodeType = "mission"],
node[NodeType = "mission"] {
	background-color: #b53737;
	text-outline-color: white;
	height: 150;
	width: 150;
}

node[NodeType = "assumption"],
node[NodeType = "assumption"] {
	background-color: #86cbff;
	text-outline-color: white;
}

node[NodeType = "goal"],
node[NodeType = "goal"] {
	background-color: #c2e5a0;
	text-outline-color: white;
}

node[NodeType = "approach"],
node[NodeType = "approach"] {
	background-color: #fff686;
	text-outline-color: white;
}

node[NodeType = "improvement"],
node[NodeType = "improvement"] {
	background-color: #ff9e6d;
	text-outline-color: white;
}

node[NodeType = "pattern"],
node[NodeType = "pattern"] {
	background-color: #E91E63;
	text-outline-color: white;
}

edge[interaction = "cw"] {
	line-color: white;
}

node.highlighted {
	min-zoomed-font-size: 0;
  z-index: 9999;
}

edge.highlighted {
	curve-style: taxi;
	opacity: 0.8;
	width: 4;
	z-index: 9999;
}

.faded {
  events: no;
}

node.faded {
  opacity: 0.08;
}

edge.faded {
  opacity: 0.06;
}

.hidden {
	display: none;
}

.orphans-filtered {
	display: none;
}

.patterns-filtered {
	display: none;
}

`;
