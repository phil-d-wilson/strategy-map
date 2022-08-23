import { h, Component } from 'preact';

class NodeInfo extends Component {
  constructor(props){
    super(props);
  }

  render(){
    const { node } = this.props;
    const data = node.data();
    const description  = data.description;
    const type = data.NodeType;
    const q = data.link;

    return h('div', { class: 'node-info' }, [
      h('div', { class: 'node-info-name' }, description),
      h('div', { class: 'node-info-type' }, type),
      h('div', { class: 'node-info-more' }, [
        h('a', { target: '_blank', href: `${q}` }, 'View Jellyfish card')
      ])
    ]);
  }
}

export default NodeInfo;
export { NodeInfo };