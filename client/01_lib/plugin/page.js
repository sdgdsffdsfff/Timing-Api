Tracker.addPlugin('page', {
    data: function () {
        /* jshint -W106 */
        var win = window,
            performance = win.performance || win.mozPerformance || win.msPerformance || win.webkitPerformance;

        if (!performance) {
            return;
        }

        /*1: forward; 2: back*/
        if (performance.navigation.type !== 0) {
            return;
        }

        // append data from window.performance
        var timing = performance.timing;
        var data = [];
        
        var spanPage = {
            /*page data*/
            spanId: '0',
            ns: timing.navigationStart,
            rds: timing.redirectStart,
            ues: timing.unloadEventStart,
            uee: timing.unloadEventEnd,
            rde: timing.redirectEnd,
            fs: timing.fetchStart,
            dls: timing.domainLookupStart,
            dle: timing.domainLookupEnd,
            cs: timing.connectStart,
            scs: timing.secureConnectionStart,
            ce: timing.connectEnd,
            rqs: timing.requestStart,
            rss: timing.responseStart,
            rse: timing.responseEnd,
            dl: timing.domLoading,
            di: timing.domInteractive,
            dcs: timing.domContentLoadedEventStart,
            dce: timing.domContentLoadedEventEnd,
            dc: timing.domComplete,
            le: timing.loadEventEnd,
            ls: timing.loadEventStart,
            dataType: 'page',
            source: 0
        };


        if (timing.msFirstPaint) {
            spanPage.fp = timing.msFirstPaint;
        }

        if (win.chrome && win.chrome.loadTimes) {
            var loadTimes = win.chrome.loadTimes();
            spanPage.fp = Math.round(loadTimes.firstPaintTime * 1000);
        }

        data.push(spanPage);

        return data;
    }
});