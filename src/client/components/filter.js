import { h, Component } from 'preact';
import classNames from 'classnames';

class Filter extends Component {
    constructor(props) {
        super(props);

        const { controller } = props;
        const { bus } = controller;

        bus.on('changeType', this.changeChartType = (() => {
            this.setState({ open: false });
        }));
    }

    setChartTypeLabel() {
        const { controller } = this.props;
        const toggle = document.getElementById('chart-type-label');
        toggle.value = "Chart Type: " + controller.chartType;
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

    togglePriority() {
        const { controller } = this.props;
        controller.togglePriority();
    }

    toggleUsers() {
        const { controller } = this.props;
        controller.toggleUsers();
    }

    componentWillUnmount() {
        const { bus } = this.props.controller;
        bus.removeListener('changeType', this.changeChartType);
    }

    render() {
        const { controller } = this.props;

        return h('div', { class: 'filter' }, [
            h('div', {
                class: classNames({ 'chart-type-toggle': true }),
                onClick: () => controller.toggleChartType()
            }),
            h('span', { class: 'slider-labels chart-type', id: 'chart-type-label' }, "Chart Type: " + controller.chartType),
            h('div', { class: classNames({ 'filter-position': true }) }, [
                h('label', { class: classNames({ 'switch': true }) }, [
                    h('input', {
                        type: 'checkbox',
                        checked: controller.assumptions,
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
                        checked: controller.goals,
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
                        checked: controller.approaches,
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
                        checked: controller.sagas,
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
                        checked: controller.improvements,
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
                    checked: controller.patterns,
                    onClick: () => this.togglePatterns()
                }),
                    h('span', {
                    class: 'slider round pattern'
                })
                ]),
                h('span', {class: 'slider-labels patterns'}, 'patterns')
            ]),
            h('div', { class: classNames({ 'filter-position': true }) }, [
                h('label', { class: classNames({ 'switch': true }) }, [
                    h('input', {
                        type: 'checkbox',
                        checked: controller.users,
                        onClick: () => this.toggleUsers()
                    }),
                    h('span', {
                        class: 'slider round users'
                    })
                ]),
                h('span', { class: 'slider-labels users' }, 'users')
            ]),
            h('div', { class: classNames({ 'filter-position': true }) }, [
                h('label', { class: classNames({ 'switch': true }) }, [
                    h('input', {
                        type: 'checkbox',
                        checked: controller.orphans,
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
                        checked: controller.priority,
                        onClick: () => this.togglePriority()
                    }),
                    h('span', {
                        class: 'slider round priority'
                    })
                ]),
                h('span', { class: 'slider-labels priority' }, 'prioritisation')
            ])
        ]);
        

    }
}

export default Filter;
export { Filter };