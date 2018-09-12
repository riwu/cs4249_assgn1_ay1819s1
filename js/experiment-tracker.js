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
    this.area = {};
    this.captureMousePosition = this.captureMousePosition.bind(this);
  }

  captureMousePosition(e) {
    if (this.area.x1 === undefined) {
      this.area = {
        x1: e.screenX,
        x2: e.screenX,
        y1: e.screenY,
        y2: e.screenY
      };
      return;
    }

    if (e.screenX < this.area.x1) {
      this.area.x1 = e.screenX;
    } else if (e.screenX > this.area.x2) {
      this.area.x2 = e.screenX;
    }

    if (e.screenY < this.area.y1) {
      this.area.y1 = e.screenY;
    } else if (e.screenY > this.area.y2) {
      this.area.y2 = e.screenY;
    }
  }

  resetTimers() {
    this.startTime = null;
    this.endTime = null;
    this.area = {};
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
      this.area.x1,
      this.area.x2,
      this.area.y1,
      this.area.y2
    ]);
    this.resetTimers();
    this.attempt++;
  }

  newTrial() {
    this.attempt = 1;
  }

  toCsv() {
    var csvFile =
      'Trial,Attempt,Menu Type,Menu Depth,Pointing Device,Target Item,Selected Item,Start Time, End Time,Area X1,Area X2,Area Y1,Area Y2\n';
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
