var baseurl = 'http://discovery.gillespy.net/heating/index.php/api/';

function AppViewModel() {
    var self = this;
    self.currentTemp = ko.observable(16);
    self.boilerOn = ko.observable(true);
    self.nextTime = ko.observable('23:59');
    self.nextTarget = ko.observable(17);
    self.targetTemp = ko.observable(18);
    self.targetSince = ko.observable('18:00');
    self.targetSource = ko.observable('TIMER');

    self.heatingiconsrc = ko.computed(function () {
        if (self.boilerOn()) {
            return 'images/heating-on.png';
        } else {
            return 'images/heating-off.png';
        }
    });
    self.targetTemp = ko.observable(18);
    self.refreshData = function () {
        $.getJSON(baseurl + 'boiler_status', {}, function (data) {
            self.boilerOn(data.status);
        });
        $.getJSON(baseurl + 'average_temp', {}, function (data) {
            self.currentTemp(data.temp.toFixed(1));
        });
        $.getJSON(baseurl + 'current_target', {}, function (data) {
            if (data.status == 1) {
                self.targetTemp(data.target);
                self.targetSince(data.time);
                self.targetSource(data.source);
            } else {
                self.targetTemp(0);
                self.targetSince('00:00');
                self.targetSource('NONE');
            }
        });
    }

    window.setInterval(function () {
        self.refreshData();
    }, 10000);
    self.refreshData();
}
var vm = new AppViewModel();
ko.applyBindings(vm);