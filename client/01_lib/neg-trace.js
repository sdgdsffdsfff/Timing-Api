(function (window, document) {
    
    
    @@include('./util.js')
    @@include('./client.js')
    @@include('./beacon.js')
    @@include('./tracker.js')
    @@include('./plugin/page.js')
    @@include('./plugin/resource.js')
    
    
    util.onload(function () {
        if (!window['NeweggAnlyticsObject']) {
            return;
        }
        var toString = Object.prototype.toString,
            tracker = new Tracker(),
            obj = window[window['NeweggAnlyticsObject']],
            commands = obj ? obj.q : [];

        obj.q = tracker;
        if (commands && toString.call(commands) === "[object Array]") {
            tracker.push.apply(tracker, commands);
        }

    });

})(window, document);
