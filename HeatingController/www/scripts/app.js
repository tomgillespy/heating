
function AppViewModel() {
    var self = this;
    self.currentTemp = ko.observable(16);
    self.boilerOn = ko.observable(true);
    self.nextTime = ko.observable('23:59');
    self.nextTarget = ko.observable(17);
    self.targetTemp = ko.observable(18);
    self.targetSince = ko.observable('18:00');

    self.heatingiconsrc = ko.computed(function () {
        if (self.boilerOn()) {
            return 'images/heating-on.png';
        } else {
            return 'images/heating-off.png';
        }
    });
    self.targetTemp = ko.observable(18);
}
var vm = new AppViewModel();
ko.applyBindings(vm);