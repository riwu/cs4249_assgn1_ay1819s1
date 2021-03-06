// Class used to track experiment
class ExperimentTracker {
  constructor() {
    this.trials = [];
    this.attempt = 0;
    this.trial = null;
    this.attempt = null;
    this.menuType = null;
    this.menuDepth = null;
    this.pointingDevice = null;
    this.targetItem = null;
    this.selectedItem = null;
    this.startTime = null;
    this.endTime = null;
    this.prevCoord = {};
    this.distMoved = 0;
    this.captureMousePosition = this.captureMousePosition.bind(this);
  }

  captureMousePosition(e) {
    if (this.prevCoord.x !== undefined) {
      this.distMoved += Math.hypot(
        e.screenX - this.prevCoord.x,
        e.screenY - this.prevCoord.y
      );
    }

    this.prevCoord = {
      x: e.screenX,
      y: e.screenY
    };
  }

  resetTimers() {
    this.startTime = null;
    this.endTime = null;
    this.prevCoord = {};
    this.distMoved = 0;
    document.removeEventListener('mousemove', this.captureMousePosition);
  }

  startTimer() {
    this.startTime = Date.now();
    document.removeEventListener('mousemove', this.captureMousePosition);
    document.addEventListener('mousemove', this.captureMousePosition);
  }

  recordSelectedItem(selectedItem) {
    this.selectedItem = selectedItem;
    this.stopTimer();
  }

  stopTimer() {
    this.endTime = Date.now();
    this.trials.push([
      this.trial,
      this.attempt,
      this.menuType,
      this.menuDepth,
      this.pointingDevice,
      this.targetItem,
      this.selectedItem,
      this.startTime,
      this.endTime,
      this.distMoved
    ]);
    this.resetTimers();
    this.attempt++;
  }

  newTrial() {
    this.attempt = 1;
  }

  toCsv() {
    var csvFile =
      'Trial,Attempt,Menu Type,Menu Depth,Pointing Device,Target Item,Selected Item,Start Time, End Time,Distance moved\n';
    for (var i = 0; i < this.trials.length; i++) {
      csvFile += this.trials[i].join(',');
      csvFile += '\n';
    }

    var hiddenLink = document.createElement('a');
    hiddenLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
    hiddenLink.target = '_blank';
    hiddenLink.download = 'experiment.csv';
    document.body.appendChild(hiddenLink);
    hiddenLink.click();
  }
}
