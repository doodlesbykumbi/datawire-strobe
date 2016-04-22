/******** Stroboscope utilities here ********/

export default class Stroboscope {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  connected() {
    console.log("Connected, baby!");
  }

  routesUpdated(routingTable) {
    console.log("New routes", routingTable);

    this.dispatch({ type: "UPDATE", routes: routingTable.routes });
  }
}
