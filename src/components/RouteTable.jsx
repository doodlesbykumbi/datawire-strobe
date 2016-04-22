import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';

import { Table } from 'reactable';

const RouteTableCore = React.createClass({
  mixins: [ PureRenderMixin ],

  getUserName: function() {
    if (this.props.user) {
      return this.props.user.get('name') || "??";
    }
    else {
      return undefined;
    }
  },

  getRoutes: function() {
    return this.props.routes || {};
  },

  render: function() {
    var userName = this.getUserName();
    var routes = this.getRoutes();
    var logger = this.props.logger;

    var foldedList = []

    routes.forEach((endpoints, service) => {
      logger.info("service " + service + " endpoints " + endpoints.size + ": " + JSON.stringify(endpoints));
      foldedList.push({ Service: service, Count: endpoints.size });
    });

    return <div>
      <div>Logged in as {userName}</div>
      <Table className="table" data={ foldedList } />
    </div>;
  }
});

function mapStateToProps(state) {
  return {
    user: state.get('user'),
    routes: state.get('routes'),
    logger: state.get('logger')
  }
}

export const RouteTable = connect(mapStateToProps)( RouteTableCore );