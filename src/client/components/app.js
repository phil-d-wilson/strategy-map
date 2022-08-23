import { h, Component } from 'preact';
import { Controller } from '../controller';
import Cytoscape from 'cytoscape';
import { style } from '../cy-conf';
import CytoscapeComponent from './cytoscape';
import { isDev } from '../env';
import { NodeInfo } from './node-info';
import { Menu } from './menu';
import * as data from '../cy-conf/data.json';
import dagre from 'cytoscape-dagre';

class AppComponent extends Component {
  constructor(props){
    super(props);

    const mainLayout =
    {
      name: 'dagre',
      animate: false,
      padding: 10,
      rankDir: 'TB',
      nodeSep: 150,
      edgeSep: 100,
      rankSep: 200,
      avoidOverlap: true,
    };

    Cytoscape.use(dagre);
    const cy = new Cytoscape({
      elements: {
        nodes:
          data.nodes.filter(n => (n.group != 'pattern')).map(function (node) {
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
          data.links.filter(l => (l.sourceType != 'pattern')).map(function (link) {
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
      layout: mainLayout,
      selectionType: 'single',
      boxSelectionEnabled: false
    });

    cy.nodes().panify().ungrabify();

    //remove any nodes without links from the DAG
    cy.nodes(function (element) {
      if (element.isNode() && element.degree() < 1) {
        cy.remove(element);
      }
    });

    const controller = new Controller({ cy, mainLayout });
    const bus = controller.bus;

    if( isDev ){
      window.cy = cy;
      window.controller = controller;
    }

    this.state = { controller, cy };

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

      h(Menu, { controller })
    ]);
  }
}

export default AppComponent;
export { AppComponent };