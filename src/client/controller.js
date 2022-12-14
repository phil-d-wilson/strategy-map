import EventEmitter from 'eventemitter3';
import memoize from 'lodash.memoize';

// search parameters
const minMetricValue = 0.25; // filter out nodes from search results if they have total scores lower than this
const minSimilarityValue = 0; // only include in total metric if the individual sim val is on [0.5, 1]

//chart type enum
const ChartTypes = Object.freeze({
  FDG: 'FDG',
  DAG: 'DAG'
});

class Controller {
  constructor({ cy, layouts }) {
    this.chartType = ChartTypes.DAG;
    this.orphans = false;
    this.patterns = false;
    this.improvements = false;
    this.sagas = true;
    this.approaches = true;
    this.assumptions = true;
    this.goals = true;
    this.users = false;
    this.cy = cy;
    this.layouts = layouts;
    this.bus = new EventEmitter();
    this.menu = false;
    this.nodes = cy.nodes();
    this.searchMatchNodes = cy.collection();
    this.removedNodes = cy.collection();
    this.priority = false;
  }

  isMenuOpen() {
    return this.menu;
  }

  openMenu() {
    this.menu = true;

    this.bus.emit('openMenu');
    this.bus.emit('toggleMenu', true);
  }

  closeMenu() {
    this.menu = false;

    this.bus.emit('closeMenu');
    this.bus.emit('toggleMenu', false);
  }

  toggleMenu() {
    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  isInfoShown() {
    return this.infoNode != null;
  }

  showInfo(node) {
    this.infoNode = node;

    this.bus.emit('showInfo', node);
  }

  hideInfo() {
    this.bus.emit('hideInfo', this.infoNode);

    this.infoNode = null;
  }

  hasHighlight() {
    return this.lastHighlighted != null;
  }

  toggleChartType() {
    if (this.chartType === ChartTypes.FDG) {
      this.chartType = ChartTypes.DAG;
    }
    else {
      this.chartType = ChartTypes.FDG;
    }

    this.bus.emit('changeType');
    this.runLayout();
    
  }

  runLayout(randomise) {
    this.drawLayout(randomise).then(() => {
      this.animateView();
    });
  }

  animateView() {
    this.cy.animate({
      fit: {
        eles: this.cy,
        padding: 10
      }
    }, {
      duration: 1000
    });
  }

  drawLayout() {
    this.removedNodes.restore();
    this.removedNodes = this.cy.collection();
  
    if (!this.users) {
      this.removeNodeType("user");
    }

    if (!this.patterns)
    {
      this.removeNodeType("pattern");
    }

    if (!this.goals) {
      this.removeNodeType("goal");
    }

    if (!this.improvements) {
      this.removeNodeType("improvement");
    }

    if (!this.approaches) {
      this.removeNodeType("approach");
    }

    if (!this.assumptions) {
      this.removeNodeType("assumption");
    }

    if (!this.sagas) {
      this.removeNodeType("saga");
    }

    if (!this.orphans)
    {
      this.removeOrphans();
    }

 
    
    const promise = this.cy.promiseOn('layoutstop');

    this.cy.layout(

      this.layouts[this.chartType]

    ).run();

    return promise;
  }

  removeNodeType(type)
  {
    this.removedNodes = this.removedNodes.union(this.cy.remove('node[NodeType = "'+ type + '"]'));
  }

  removeOrphans()
  {
    let removed = this.cy.collection();
      this.cy.nodes(function (element) {
      if (element.isNode() && element.degree() < 1) {
        removed = removed.union(element.remove());
      }
      });
    
    this.removedNodes = this.removedNodes.union(removed);
  }

  togglePriority() {
    this.priority = !this.priority;
    this.unhighlight();
    this.renderPriority();
  }

  renderPriority()
    {
    const prioritisedTypes = ['improvement', 'saga'];
    prioritisedTypes.forEach(type => {
      this.togglePriorityForType(type);
    });

    this.runLayout();
  }

  togglePriorityForType(type) {
    const improvements = this.cy.elements("node[NodeType = '"+ type +"']");
    const allElles = this.cy.elements();
    
    if (this.priority) {
      this.cy.batch(function () {
        improvements.addClass('prioritised');
      });
    }
    else
    {
      this.cy.batch(function () {
        allElles.removeClass('prioritised');
      });
    }
    
  }

  resetView() {
    this.unhighlight();
    this.hideInfo();
    this.closeMenu();
    this.runLayout();
    this.renderPriority();
    
  }

  togglePatterns() {
    this.patterns = !this.patterns;
    this.resetView();
  }

  toggleUsers() {
    this.users = !this.users;
    this.resetView();
  }
  
  toggleSagas() {
    this.sagas = !this.sagas;
    this.resetView();
  }

  toggleGoals() {
    this.goals = !this.goals;
    this.resetView();
  }

  toggleAssumptions() {
    this.assumptions = !this.assumptions;
    this.resetView();
  }

  toggleApproaches() {
    this.approaches = !this.approaches;
    this.resetView();
  }

  toggleImprovements() {
    this.improvements = !this.improvements;
    this.resetView();
  }

  toggleOrphans() {
    this.orphans = !this.orphans;
    this.resetView();
  }

highlight(node){
  const { cy } = this;

  if (this.highlightInProgress) { return Promise.resolve(); }

  this.highlightInProgress = true;

  const allEles = cy.elements();
  const nhood = this.lastHighlighted = node.closedNeighborhood();
  const predecessors = node.predecessors();
  const successors = node.outgoers();
  let linked = predecessors.union(successors);
  let highlighted = nhood.union(linked);
  const others = this.lastUnhighlighted = allEles.not(highlighted);

  const runLayout = () => {

      const layout = highlighted.layout(
        {
          name: this.layouts[this.chartType].name,
          rankDir: 'TB',
          fit: true,
          avoidOverlap: true,
          levelWidth: () => { return 1; },
          padding: 10,
          springLength: 300,
          animate: false,
          centerGraph: true,
          springCoeff: 0.0008,
          mass: 20,
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
          randomize: false
        }

      );

      const promise = layout.promiseOn('layoutstop');

      layout.run();

      return promise;
  };

  const animateView = function () {
    cy.animate({
      fit: {
        eles: highlighted,
        padding: 10
      }
    }, {
      duration: 1000
    });
  };

  const resetClasses = function () {
    cy.batch(function () {
      allEles.removeClass('hidden').removeClass('faded').removeClass('highlighted');
    });

    return Promise.resolve();
  };

  const showOthersFaded = () => {
    cy.batch(() => {
      others.removeClass('hidden').addClass('faded');
    });
  };

  this.bus.emit('highlight', node);

  return (
    Promise.resolve()
      .then(resetClasses)
      .then(runLayout)
      .then(showOthersFaded)
      .then(animateView)
      .then(() => {
        this.highlightInProgress = false;
        this.bus.emit('highlightend', node);
      })
  );
}

unhighlight(){
  if (!this.hasHighlight()) { return Promise.resolve(); }

  const { cy } = this;
  const allEles = cy.elements();
  const allNodes = cy.nodes();

  cy.stop();
  allNodes.stop();

  const others = this.lastUnhighlighted;

  this.lastHighlighted = this.lastUnhighlighted = null;

  const hideOthers = function () {
    others.addClass('hidden');

    return Promise.resolve();
  };

  const resetClasses = function () {
    cy.batch(function () {
      allEles.removeClass('hidden').removeClass('faded').removeClass('highlighted');
    });

    return Promise.resolve();
  };

  const animateView = () => {
    cy.animate({
      fit: {
        eles: this.cy,
        padding: 10
      }
    }, {
      duration: 1000
    });
  };

  const runLayout = () => {
    this.bus.emit('unhighlight');
    var layout = this.cy.layout(this.layouts[this.chartType]);
    layout.run();
  };

  return (
    Promise.resolve()
      .then(hideOthers)
      .then(resetClasses)
      .then(runLayout)
    .then(animateView)
  );
}

updateSearch(queryString){
  const normalize = str => str.toLowerCase();
  const getWords = str => str.split(/\s+/);
  const queryWords = getWords(normalize(queryString));

  const addWords = (wordList, wordsStr) => {
    if (wordsStr) {
      wordList.push(...getWords(normalize(wordsStr)));
    }
  };

  const cacheNodeWords = node => {
    const data = node.data();
    const wordList = [];

    addWords(wordList, data.name);
    addWords(wordList, data.Synonym);
    addWords(wordList, data.NodeTypeFormatted);

    node.data('words', wordList);
  };

  const getStringSimilarity = (queryWord, nodeWord) => {
    const index = nodeWord.indexOf(queryWord);

    if (index === 0) {
      const diff = Math.abs(nodeWord.length - queryWord.length);
      const maxLength = Math.max(nodeWord.length, queryWord.length);

      return 1 - (diff / maxLength);
    } else {
      return 0;
    }
  };

  const getMetric = (node, queryWords) => {
    const nodeWords = node.data('words');
    let score = 0;

    for (let i = 0; i < nodeWords.length; i++) {
      let nodeWord = nodeWords[i];

      for (let j = 0; j < queryWords.length; j++) {
        let queryWord = queryWords[j];
        let similarity = getStringSimilarity(queryWord, nodeWord);

        if (similarity > minSimilarityValue) {
          score += similarity;
        }

      }
    }
    return score;
  };

  const getNodeMetric = memoize(node => getMetric(node, queryWords), node => node.id());

  if (!this.cachedNodeWords) {
    this.cy.batch(() => {
      this.nodes.forEach(cacheNodeWords);
    });

    this.cachedNodeWords = true;
  }

  this.searchMatchNodes = this.nodes.filter(node => {
    return getNodeMetric(node) > minMetricValue;
  }).sort((nodeA, nodeB) => {
    return getNodeMetric(nodeB) - getNodeMetric(nodeA);
  });

  this.bus.emit('updateSearch', this.searchMatchNodes);

  return this.searchMatchNodes;
}

getSearchMatchNodes(){
  return this.searchMatchNodes;
}
}

export default Controller;
export { Controller };