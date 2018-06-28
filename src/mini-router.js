
import React from 'react'
import {createBrowserHistory} from 'history'
import * as PropTypes from 'prop-types'


class Router extends React.Component {

  constructor(props) {
    super(props);

    const history = createBrowserHistory();
    this.state = {
      history: history,
    };
  }


  static childContextTypes = {
    history: PropTypes.object.isRequired,
  };


  getChildContext() {
    return this.state
  }

  render() {
    return this.props.children
  }
}


class Route extends React.Component {

  handleHistoryChange() {
    this.setState({location: this.history.location})
  }

  constructor(props, context) {
    super(props, context);
    this.handleHistoryChange = this.handleHistoryChange.bind(this);
    this.history = context.history;
    this.state = {
      location: this.history.location,
    };
    this.historyUnsubscribe = this.history.listen(this.handleHistoryChange);
  }


  static contextTypes = {
    history: PropTypes.object.isRequired
  };


  componentWillUnmount() {
    this.historyUnsubscribe();
  }


  render() {
    const {exact, path, component: Component, render} = this.props;
    const {location} = this.state;

    let isVisible = false;
    if (exact)
      isVisible = path === location.pathname;
    else
      isVisible = !!location.pathname.match(path);

    return !isVisible ? null : ((Component && <Component/>) || render() || null)
  }
}


class Link extends React.Component {
  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.context = context;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (e) => {
    e.preventDefault();
    this.context.history.push(this.props.to);
  };

  render() {
    return (
      <a
        href={`${this.props.to}`}
        onClick={this.handleClick}
      >
        {this.props.children}
      </a>
    )
  }
}

export {Router, Route, Link}
