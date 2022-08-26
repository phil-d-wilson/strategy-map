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
import cola from 'cytoscape-cola';
import euler from 'cytoscape-euler';
import fcose from 'cytoscape-fcose';

class AppComponent extends Component {
  constructor(props){
    super(props);

    const layouts = {
      DAG: {
        name: 'dagre',
        animate: false,
        padding: 10,
        rankDir: 'TB',
        nodeSep: 125,
        edgeSep: 100,
        rankSep: 150,
        avoidOverlap: true,
        fit: true
      },
      FDG: {
        name: 'euler',
        springLength: 300,
        animate: true,
        fit: false,
        padding: 10, 
        centerGraph: true,
        springCoeff: 0.0008,

        // The mass of the node in the physics simulation
        // - The mass affects the gravity node repulsion/attraction
        mass: 20,

        // Coulomb's law coefficient
        // - Makes the nodes repel each other for negative values
        // - Makes the nodes attract each other for positive values
        gravity: -10,

        // A force that pulls nodes towards the origin (0, 0)
        // Higher values keep the components less spread out
        pull: 0.0001,

        // Theta coefficient from Barnes-Hut simulation
        // - Value ranges on [0, 1]
        // - Performance is better with smaller values
        // - Very small values may not create enough force to give a good result
        theta: 0.333,

        // Friction / drag coefficient to make the system stabilise over time
        dragCoeff: 0.02,

        // When the total of the squared position deltas is less than this value, the simulation ends
        movementThreshold: 1,

        // The amount of time passed per tick
        // - Larger values result in faster runtimes but might spread things out too far
        // - Smaller values produce more accurate results
        timeStep: 20,

        // The number of ticks per frame for animate:true
        // - A larger value reduces rendering cost but can be jerky
        // - A smaller value increases rendering cost but is smoother
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
    Cytoscape.use(cola);
    Cytoscape.use(euler);
    Cytoscape.use(fcose);

    const cy = new Cytoscape({
      elements: {
        nodes:
          //.filter(l => (l.sourceType != 'pattern'))
          data.nodes.map(function (node) {
            return {
              data: {
                id: node.id,
                name: node.group + ": " + node.name.substring(0, 100),
                description: node.name,
                NodeType: node.group,
                selected: false,
                weight: (node.weight + 100),
                link: node.Link
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
                weight: (link.weight + 20)
              }
            };
          }),
      },
      style,
      // layout: layouts.DAG,
      selectionType: 'single',
      boxSelectionEnabled: true
    });

    cy.nodes().panify().ungrabify();

    // cy.nodes(function (element) {
    //   if (element.isNode() && element.data().NodeType === "pattern") {
    //     element.remove();
    //   }
    // });

    // //remove any nodes without links from the DAG
    // cy.nodes(function (element) {
    //   if (element.isNode() && element.degree() < 1) {
    //     element.remove();
    //   }
    // });

    // let filtered = cy.nodes().filter((ele) => {
    //   return (ele.data().NodeType != 'pattern');
    // });

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