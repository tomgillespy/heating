var baseurl = 'http://discovery.gillespy.net/heating/index.php/api/';

function timer(day, start, end, target) {
    var self = this;
    self.day = ko.observable(day);
    self.start = ko.observable(start);
    self.end = ko.observable(end);
    self.target = ko.observable(target);
}

function AppViewModel() {
    var self = this;
    //Navigation
    self.dayoptions = [
        { 'Mon': 'Monday' },
        { 'Tue': 'Tuesday' },
        { 'Wed': 'Wednesday' },
        { 'Thu': 'Thursday' },
        { 'Fri': 'Friday' },
        { 'Sat': 'Saturday' },
        { 'Sun': 'Sunday' },
    ];


    self.page = ko.observable('home');
    self.changepage = function (page) {
        self.page(page);
        self.selectedtimer(null);
    }


    //Front Page
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
    //Timer
    self.timerentries = ko.observableArray();
    self.selectedtimer = ko.observable(null);
    self.selecttimer = function (s) {
        console.log(s);
        self.selectedtimer(s);
    }


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
    self.setupData = function () {
        $.getJSON(baseurl + 'gettimer', {}, function (data) {
            var mapped = $.map(data, function (item, idx) {
                console.log(item);
                return new timer(item.day, item.start, item.end, item.target);
            });
            console.log(mapped);
            self.timerentries(mapped);
        });
    }

    window.setInterval(function () {
        self.refreshData();
    }, 10000);
    self.refreshData();
    self.setupData();



    self.currentpage = ko.computed(function () {
        if (self.selectedtimer() != null) {
            return false;
        } //else if () {

        return self.page();
    });
}
var vm = new AppViewModel();
ko.applyBindings(vm);