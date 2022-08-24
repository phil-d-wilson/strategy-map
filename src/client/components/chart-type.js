import { h, Component } from 'preact';
import classNames from 'classnames';



class ChartType extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        const { controller } = this.props;

        return h('div', { class: 'chart-type' }, [
            h('div', {
                class: classNames({ 'chart-type-toggle': true }),
                onClick: () => controller.toggleChartType()
            })
        ]);
    }
}

export default ChartType;
export { ChartType };