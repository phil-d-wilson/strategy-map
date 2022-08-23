import { h, Component } from 'preact';
import classNames from 'classnames';

class ChartType extends Component {
    constructor(props) {
        super(props);

        const { controller } = props;
        const { bus } = controller;

        this.state = {
            selectedChartType: controller.isMenuOpen()
        };

        bus.on('changeType', this.onOpenMenu = (() => {
            this.setState({ selectedChartType: true });

            this.focusTextBox();
        }));

      
    }

    componentWillUnmount() {
        const { bus } = this.props.controller;

        bus.removeListener('changeType', this.onUpdateSearch);
    }



    render() {
        const { controller } = this.props;

        return h('div', { class: 'chart-type-toggle' }, [
            h('div', {
                class: classNames({ 'chart-type-toggle': true }),
                onClick: () => controller.toggleMenu()
            })
        ]);
    }
}

export default ChartType;
export { ChartType };