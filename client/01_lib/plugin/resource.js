Tracker.addPlugin('resource', {
    data: function (types) {
        var win = window,
            performance = win.performance || win.mozPerformance || win.msPerformance || win.webkitPerformance;

        if (!performance) {
            return;
        }

        /*1: forward; 2: back*/
        if (performance.navigation.type !== 0) {
            return;
        }

        var data = [];
        var resourceLst = performance.getEntriesByType("resource");

        if (resourceLst && resourceLst.length) {
            for (var i = 0, length = resourceLst.length; i < length; i++) {
                var resource = resourceLst[i];

                var span = {};
                var name = resource.name && resource.name.split("?")[0];
                span.spanId = '0.' + (i + 1).toString();
                span.name = name;
                span.ns = parseInt(performance.timing.navigationStart);
                span.st = parseInt(resource.startTime);
                span.rds = parseInt(resource.redirectStart);
                span.rde = parseInt(resource.redirectEnd);
                span.fs = parseInt(resource.fetchStart);
                span.dls = parseInt(resource.domainLookupStart);
                span.dle = parseInt(resource.domainLookupEnd);
                span.cs = parseInt(resource.connectStart);
                span.scs = parseInt(resource.secureConnectionStart);
                span.ce = parseInt(resource.connectEnd);
                span.rqs = parseInt(resource.requestStart);
                span.rss = parseInt(resource.responseStart);
                span.rse = parseInt(resource.responseEnd);
                span.dataType = 'resource',
                span.source = 0;

                if (!types) {
                    data.push(span);
                }
                else if (util.ArrayIndexOf(types, resource["initiatorType"]) > -1) {
                    data.push(span);
                }
            }
        }
        return data;
    }
});
