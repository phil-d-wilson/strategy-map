import { h, Component } from 'preact';
import { Controller } from '../controller';
import Cytoscape from 'cytoscape';
import { style } from '../cy-conf';
import CytoscapeComponent from './cytoscape';
import { isDev } from '../env';
import { NodeInfo } from './node-info';
import { Menu } from './menu';
import { Filter } from './filter';
import * as data from '../cy-conf/data.json';
import dagre from 'cytoscape-dagre';
import euler from 'cytoscape-euler';
class AppComponent extends Component {
  constructor(props){
    super(props);

    const layouts = {
      DAG: {
        name: 'dagre',
        animate: false,
        padding: 10,
        rankDir: 'TB',
        nodeSep: 120,
        edgeSep: 200,
        rankSep: 150,
        avoidOverlap: true,
        fit: true,
      },
      FDG: {
        name: 'euler',
        springLength: 300,
        animate: false,
        fit: false,
        padding: 10, 
        centerGraph: true,
        springCoeff: 0.0008,
        mass: 15,
        gravity: -10,
        pull: 0.0001,
        theta: 0.333,
        dragCoeff: 0.02,
        movementThreshold: 1,
        timeStep: 20,
        refresh: 10,
        animationDuration: undefined,
        animationEasing: undefined,
        maxIterations: 1000,
        maxSimulationTime: 4000,
        ungrabifyWhileSimulating: false,
        randomize: true
      }
    };

    Cytoscape.use(dagre);
    Cytoscape.use(euler);

    function GetName(node) {
      let jfTypes = ["improvement", "pattern", "saga", "user"];
      if (jfTypes.includes(node.group))
      {
        return ((node.name === null) ? node.id : (node.name).substring(0, 100));
      }

      return node.id;
    }

    const cy = new Cytoscape({
      elements: {
        nodes:
          data.nodes.map(function (node) {
            return {
              data: {
                id: node.id,
                name: GetName(node),
                description: node.name,
                NodeType: node.group,
                selected: false,
                weight: node.weight + 100,
                link: node.Link,
                priority: "false"
              },
              selected: false
            };
          }),
        edges:
          data.links.map(function (link) {
            return {
              data: {
                id: (Math.random() + 1).toString(36).substring(7),
                source: link.source,
                target: link.target,
                weight: (link.weight + 20),
                sourceType: link.sourceType,
                targetType: link.targetType
              }
            };
          }),
      },
      style,
      selectionType: 'single',
      boxSelectionEnabled: true,
      wheelSensitivity: 0.25
    });

    cy.nodes().panify().ungrabify();

    //TODO - remove this hack when JF gives improvements a weighting generated
    //from the composite weights of their linked patterns
    cy.elements("node[NodeType = 'improvement']").forEach(element => {
      if (element.data().weight == 100) {
        let compositeWeight = 0;
        element.outgoers("node[NodeType = 'pattern']").forEach(pattern => {
          compositeWeight = compositeWeight + pattern.data().weight;
        });
        element.incomers("node[NodeType = 'saga']").forEach(pattern => {
          compositeWeight = compositeWeight + pattern.data().weight;
        });
        element.data().weight = (100 + (compositeWeight/8));
      }
    });

    const controller = new Controller({ cy, layouts });
    const bus = controller.bus;

    if( isDev ){
      window.cy = cy;
      window.controller = controller;
      
    }

    this.state = { controller, cy };
    controller.runLayout();

    bus.on('showInfo', this.onShowInfo = (node => {
      this.setState({ infoNode: node });
    }));

    bus.on('hideInfo', this.onHideInfo = (() => {
      this.setState({ infoNode: null });
    }));
  }

  componentWillUnmount(){
    const bus = this.state.controller.bus;

    bus.removeListener('showInfo', this.onShowInfo);
    bus.removeListener('hideInfo', this.onHideInfo);
  }

  truncateString(str, num) {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str;
  }
  // Return str truncated with '...' concatenated to the end of str.
    return str.slice(0, num) + '...';
}

  render(){
    const { cy, controller, infoNode } = this.state;

    return h('div', { class: 'app' }, [
      h(CytoscapeComponent, { cy, controller }),

      infoNode ? (
        h('div', { class: 'app-node-info' }, [
          h(NodeInfo, { node: infoNode })
        ])
      ) : null,

      h(Menu, { controller }),
      h(Filter, { controller })
    ]);
  }
}

export default AppComponent;
export { AppComponent };