/******** Stroboscope utilities here ********/

export default class Stroboscope {
  constructor(state) {
    this.state = state;
  }

  connected() {
    console.log("Connected, baby!");
  }

  routesUpdated(routingTable) {
    console.log("New routes", routingTable);
  }
}
