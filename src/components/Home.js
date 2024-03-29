import React from 'react';
import { get } from '../intent';
import Deals from './Deals';
import Combinator from './Combinator';
import { values } from '../utils/helpers';
import { prependToPaths, toPaths } from '../utils/helpers';
import '../public/hover.css';

class Home extends React.Component {
  static contextTypes = {
    model$: React.PropTypes.any
  };
  componentWillMount() {
    this.fetch(0, 9);
  }
  getPaths() {
    return this.paths;
  }
  static paths = (from, to, toPrepend) => prependToPaths(
    toPrepend,
    toPaths(Deals.queries())
  );
  fetch(from, to) {
    this.paths = Home.paths(from, to, ['featuredDeals', { from, to }]);
    get(this.paths);
  }
  paths = [];
  render() {
    return (
      <Combinator>
        {
          this.context.model$.getData(this.getPaths.bind(this), ['featuredDeals']).
            map(deals => <Deals
              deals={values(deals)}
              fetch={this.fetch.bind(this)}
            />)
        }
      </Combinator>
    );
  }
}

export default Home;
