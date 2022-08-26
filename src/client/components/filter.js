import { h, Component } from 'preact';
import classNames from 'classnames';

class Filter extends Component {
    constructor(props) {
        super(props);
    }

    togglePatterns() {
        const { controller } = this.props;
        controller.togglePatterns();
    }

    toggleImprovements() {
        const { controller } = this.props;
        controller.toggleImprovements();
    }

    toggleSagas() {
        const { controller } = this.props;
        controller.toggleSagas();
    }

    toggleAssumptions() {
        const { controller } = this.props;
        controller.toggleAssumptions();
    }

    toggleApproaches() {
        const { controller } = this.props;
        controller.toggleApproaches();
    }

    toggleGoals() {
        const { controller } = this.props;
        controller.toggleGoals();
    }

    toggleOrphans() {
        const { controller } = this.props;
        controller.toggleOrphans();
    }

    render() {
        const { controller } = this.props;

        return h('div', { class: 'filter' }, [
            h('div', {
                class: classNames({ 'chart-type-toggle': true }),
                onClick: () => controller.toggleChartType()
            }),
            h('span', { class: 'slider-labels chart-type' }, 'chart type'),
            h('div', { class: classNames({ 'filter-position': true }) }, [
                h('label', { class: classNames({ 'switch': true }) }, [
                    h('input', {
                        type: 'checkbox',
                        checked: false,
                        onClick: () => this.toggleOrphans()
                    }),
                    h('span', {
                        class: 'slider round'
                    })
                ]),
                h('span', { class: 'slider-labels orphans' }, 'orphans')
            ]),
            h('div', { class: classNames({ 'filter-position': true }) }, [
                h('label', { class: classNames({ 'switch': true }) }, [
                    h('input', {
                        type: 'checkbox',
                        checked: true,
                        onClick: () => this.toggleAssumptions()
                    }),
                    h('span', {
                        class: 'slider round assumption'
                    })
                ]),
                h('span', { class: 'slider-labels assumptions' }, 'assumptions')
            ]),
            h('div', { class: classNames({ 'filter-position': true }) }, [
                h('label', { class: classNames({ 'switch': true }) }, [
                    h('input', {
                        type: 'checkbox',
                        checked: true,
                        onClick: () => this.toggleGoals()
                    }),
                    h('span', {
                        class: 'slider round goal'
                    })
                ]),
                h('span', { class: 'slider-labels goals' }, 'goals')
            ]),
            h('div', { class: classNames({ 'filter-position': true }) }, [
                h('label', { class: classNames({ 'switch': true }) }, [
                    h('input', {
                        type: 'checkbox',
                        checked: true,
                        onClick: () => this.toggleApproaches()
                    }),
                    h('span', {
                        class: 'slider round approach'
                    })
                ]),
                h('span', { class: 'slider-labels approaches' }, 'approaches')
            ]),
            h('div', { class: classNames({ 'filter-position': true }) }, [
                h('label', { class: classNames({ 'switch': true }) }, [
                    h('input', {
                        type: 'checkbox',
                        checked: true,
                        onClick: () => this.toggleSagas()
                    }),
                    h('span', {
                        class: 'slider round saga'
                    })
                ]),
                h('span', { class: 'slider-labels sagas' }, 'sagas')
            ]),
            h('div', { class: classNames({ 'filter-position': true }) }, [
                h('label', { class: classNames({ 'switch': true }) }, [
                    h('input', {
                        type: 'checkbox',
                        checked: true,
                        onClick: () => this.toggleImprovements()
                    }),
                    h('span', {
                        class: 'slider round improvement'
                    })
                ]),
                h('span', { class: 'slider-labels improvements' }, 'improvements')
            ]),
            h('div', { class: classNames({ 'filter-position': true }) }, [
                h('label', { class: classNames({ 'switch': true }) }, [
                h('input', {
                    type: 'checkbox',
                    checked: false,
                    onClick: () => this.togglePatterns()
                }),
                    h('span', {
                    class: 'slider round pattern'
                })
                ]),
                h('span', {class: 'slider-labels patterns'}, 'patterns')
            ])
        ]);
        

    }
}

export default Filter;
export { Filter };