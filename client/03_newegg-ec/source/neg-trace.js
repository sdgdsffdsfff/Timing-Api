(function (window, document) {
    
    
    var hasOwnProp = Object.prototype.hasOwnProperty;
var util = {
    hash: function (str) {
        var hash = 1,
        charCode = 0,
        idx;
        if (str) {
            hash = 0;
            for (idx = str.length - 1; idx >= 0; idx--) {
                charCode = str.charCodeAt(idx);
                hash = (hash << 6 & 268435455) + charCode + (charCode << 14);
                charCode = hash & 266338304;
                hash = charCode !== 0 ? hash ^ charCode >> 21 : hash;
            }
        }
        return hash;
    },
    ArrayIndexOf: Array.prototype.indexOf
                    ? function (array, el) {
                        array = [].slice.call(array, 0);
                        return array.indexOf(el);
                    }
                    : function (array, el) {
                        for (var i = array.length, isExist = false; i-- && !isExist;) {
                            isExist = array[i] === el;
                            if (isExist) {
                                return i;
                            }
                        }
                        return i;
                    },
    keyPaths: function (obj, fn) {

        var kfunc = Object.keys || function keyFunc(obj) {
            var ks = [];
            for (var k in obj) {
                if (hasOwnProp.call(obj, k)) {
                    ks.push(k);
                }
            }
            return ks;
        };

        var keys = [];

        function traverse(obj) {
            if (keys.length >= 10) {
                fn(keys.concat(), obj);
                return;
            }

            if (!(obj instanceof Object)) {
                fn(keys.concat(), obj);
                return;
            }

            kfunc(obj).forEach(function (key) {
                keys.push(key);
                traverse(obj[key]);
                keys.pop();
            });
        }

        traverse(obj);
    },

    whitelistify: function (obj, whitelist) {
        var whitePaths = [];
        util.keyPaths(whitelist, function (path) {
            whitePaths.push(path.join('.'));
        });
        var whitePathsString = '|' + whitePaths.join("|") + '|';
        var res = {};
        util.keyPaths(obj, function (path, val) {
            if (whitePathsString.indexOf('|' + path.join('.') + '|') !== -1) {
                var cur = res;
                for (var i = 0; i < path.length; i++) {
                    if (!cur[path[i]]) {
                        cur[path[i]] = {};
                    }
                    if (i === path.length - 1) {
                        cur[path[i]] = val;
                    }
                    cur = cur[path[i]];
                }
            }
        });
        return res;
    },

    random: function () {
        return Math.round(Math.random() * 2147483647);
    },

    stringify: function (data) {
        if (typeof JSON !== 'undefined' && JSON.stringify) {
            return JSON.stringify(data);
        }
        var type = typeof data;
        switch (type) {
            case 'string':
                return '"' + data + '"';
            case 'boolean':
            case 'number':
                return String(data);
            case 'object':
                if (null === data) {
                    return 'null';
                }
                var c = false,
                    d = '';
                for (var prop in data) {
                    if (hasOwnProp.call(data, prop)) {
                        var e = '' + prop,
                            f = util.stringify(data[prop]);
                        if (f.length) {
                            if (c) {
                                d += ',';
                            } else {
                                c = true;
                            }
                            d += (data instanceof Array) ? f : '"' + e + '":' + f;
                        }
                    }
                }
                return (data instanceof Array) ? '[' + d + ']' : '{' + d + '}';
            default:
                return '';
        }
    },

    encode: function (uri, isAll) {
        if (encodeURIComponent instanceof Function) {
            return isAll ? encodeURI(uri) : encodeURIComponent(uri);
        } else {
            return escape(uri);
        }
    },

    decode: function (encodedURI, isAll) {
        var uri;
        encodedURI = encodedURI.split("+").join(" ");
        if (decodeURIComponent instanceof Function) {
            try {
                uri = isAll ? decodeURI(encodedURI) : decodeURIComponent(encodedURI);
            } catch (ex) {
                uri = unescape(encodedURI);
            }
        } else {
            uri = unescape(encodedURI);
        }
        return uri;
    },

    merge: function (receiver, supplier) {
        for (var key in supplier) {
            if (hasOwnProp.call(supplier, key)) {
                receiver[key] = supplier[key];
            }
        }
        return receiver;
    },

    buildQueryString: function (data) {
        var encode = util.encode;

        // construct query string
        var key, dataStr = [];
        for (key in data) {
            if (hasOwnProp.call(data, key)) {
                var value = typeof data[key] === 'object' ? util.stringify(data[key]) : data[key];
                dataStr.push(encode(key) + '=' + encode(value));
            }
        }
        return dataStr.join('&');
    },

    addEventListener: function (name, callback, useCapture) {
        if (window.addEventListener) {
            return window.addEventListener(name, callback, useCapture);
        } else if (window.attachEvent) {
            return window.attachEvent('on' + name, callback);
        }
    },

    onload: function (callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            util.addEventListener('load', callback, false);
        }
    },

    onunload: function(callback){
        util.addEventListener("unload",callback);
    },

    domready: function (callback) {
        if (document.readyState === 'interactive') {
            callback();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', callback, false);
        } else if (document.attachEvent) {
            document.attachEvent('onreadystatechange', callback);
        }
    },

    onunload: function (callback) {
        util.addEventListener('unload', callback, false);
        util.addEventListener('beforeunload', callback, false);
    },

    now: function () {
        return (new Date()).getTime();
    },

    ajax: function (settings) {
        if (window.XMLHttpRequest && window.location.protocol !== 'file:') {
            try {
                var xhr = new XMLHttpRequest();
                if (xhr) {
                    var config = util.merge({
                        method: 'GET',
                        async: true
                    }, settings);
                    xhr.open(config.method, config.url, config.async);
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.send(JSON.stringify(config.data));
                }
            } catch (e) {
            }
        }
    },

    getGUID: function () {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    },

    Cookie: {
        get:function(name){
            var cookie = document.cookie,
                arg = name + "=",
                alen = arg.length,
                clen = cookie.length,
                i = 0;
            while (i < clen) {
                var j = i + alen;
                if (cookie.substring(i, j) === arg) {
                    return this._getValue(j);
                }
                i = cookie.indexOf(" ", i) + 1;
                if (i === 0) break;
            }
            return "";
        },
        _getValue: function(offset) {
            var cookie = document.cookie,
                endstr = cookie.indexOf(";", offset);
            if (endstr === -1) {
                endstr = cookie.length;
            }
            return decodeURIComponent(cookie.substring(offset, endstr));
        },
    }
};
    function Client() {
    var empty = "-",
        encode = util.encode,
        screen = window.screen,
        navigator = window.navigator,
        viewport = this._getViewport();

    this.screen = screen ? screen.width + "x" + screen.height : empty;
    this.viewport = viewport.width + "x" + viewport.height;
    this.charset = encode(document.characterSet ? document.characterSet : document.charset ? document.charset : empty);
    this.language = (navigator && navigator.language ? navigator.language : navigator && navigator.browserLanguage ? navigator.browserLanguage : empty).toLowerCase();
    this.isFirstVisit = false;
    this.serverName = typeof nt_serverName != "undefined" ? nt_serverName : (document.getElementById("nt_serverName") ? document.getElementById("nt_serverName").value : "");
    this.varnish = util.Cookie.get("nt-varnish");
}


Client.prototype = {
    _getViewport: function () {
        // This works for all browsers except IE8 and before
        if (window.innerWidth !== null) {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }

        // For IE (or any browser) in Standards mode
        if (document.compatMode === "CSS1Compat") {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        }

        // For browsers in Quirks mode
        return {
            width: document.body.clientWidth,
            height: document.body.clientWidth
        };
    },
    getInfo: function () {
        return {
            /*jshint camelcase:false*/
            sr: this.screen,
            vp: this.viewport,
            cacheServer: this.varnish,
            serverName: this.serverName
        };
    }
};

    function Beacon(url) {
    this.url = url;
}

Beacon.MAX_URL_LENGTH = 4096;

Beacon.prototype = {
    /**
     * Update beacon url
     * @param {string} url
     */
    config: function (url) {
        this.url = url;
    },
    /**
     * send a beacon request
     */
    send: function (data) {
        data.version = Tracker.VERSION;
        var dataStr = util.buildQueryString(data);

        // fast return when nothing to send
        if (!dataStr.length) {
            return;
        }

        // send beacon request, max url length comes from google analytics
        if (dataStr.length <= Beacon.MAX_URL_LENGTH) {
            this._sendByImage(dataStr);
        } else {
            this.post(data);
        }
    },
    /**
     * As a matter of fact, beacon itself don't have the meaning of post data
     * to server. The reason to put post code in here just for simplicity.
     * Only when querystring too long this method will be used.
     *
     * @param {Object} data
     */
    post: function (data) {
        util.ajax({
            url: this.url,
            method: 'POST',
            data: data
        });
    },
    _sendByImage: function(param) {
        var img = document.createElement("IMG");
        img.src = this.url + '?' + param;
        img.style.display="none";

        document.body.insertBefore(img, document.body.lastChild);
    },
    _sendByScript: function (param) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = this.url + '?' + param;
        var head = document.getElementsByTagName('script')[0];
        head.parentNode.insertBefore(script, head);
    }
};

    var SEND_DELAY = 300;
function Tracker(config) {
    this._config = util.merge({
        sampleRate: 100,
        beacon: "//10.16.50.56:8080/_.gif"
    }, config || {});

    this._client = new Client();
    this._beacon = new Beacon(this._config.beacon);
    this._queue = [];
    this._timer = null;

    this._app = null;
    this._tags = {};

    this.trackerId = util.getGUID();
    this.visitorCode = util.random();
}

Tracker.VERSION = "0.0.1";

Tracker.Plugins = {};
Tracker.addPlugin = function (name, plugin) {
    if (typeof plugin.data !== 'function') {
        throw new Error('cannot add plugin: ' + name);
    }
    Tracker.Plugins[name] = plugin;
};

Tracker.prototype = {
    create: function (appName, config) {
        this._app = appName;
        for (var i in config) {
            this.config(i, config[i]);
        }
    },

    config: function (key, value) {

        if (value !== undefined) {
            switch (key) {
                case 'beacon':
                    this._beacon.config(this._config.beacon = value);
                    break;
            }
        }
    },
    push: function ( /* command */) {
        var slice = Array.prototype.slice;
        for (var error = 0, i = 0, n = arguments.length; i < n; i++) {
            try {
                var command = arguments[i];
                if (typeof command === "function") {
                    arguments[i](this);
                } else {
                    command = slice.call(command, 0);
                    var fn = command[0];
                    this[fn].apply(this, command.slice(1));
                }
            } catch (exception) {
                error++;
            }
        }
        return error;
    },
    send: function (key, data, type, sampleRate) {

        if (!key) {
            return;
        }
        var plugin = Tracker.Plugins[key];
        var hasNewData = false;
        if (plugin) {
            sampleRate = data;
            data = plugin.data(type);
            if (data) {
                hasNewData = true;
                this._push({
                    category: key,
                    data: data
                }, sampleRate);
            }
        } else if (typeof data === 'number') {
            var tmp = {};
            tmp[key] = data;
            hasNewData = true;
            this._push({
                data: tmp
            }, sampleRate);
        } else if (typeof data === 'object') {
            hasNewData = true;
            this._push({
                category: key,
                data: data
            }, sampleRate);
        }

        if (hasNewData) {
            var tracker = this;
            if (this._timer) {
                window.clearTimeout(this._timer);
                this._timer = null;
            }
            this._timer = window.setTimeout(function () {
                tracker._send.call(tracker, sampleRate);
            }, SEND_DELAY);
        }
    },
    _push: function (data, sampleRate) {
        var merge = util.merge,
                clientInfo = this._client.getInfo();
        var header = merge({
            app: this._app,
            page: window.location.pathname
        },
            this._tags
        );

        header = merge(header, clientInfo);

        var payload = merge({
            header: header,
            traceId: this.trackerId,
        }, data);
            
        this._queue.push(payload);

        // the queue is large enough to trigger a send
        if (util.buildQueryString(payload).length > Beacon.MAX_URL_LENGTH) {
            this._send(sampleRate);
        }
    },
    _send: function (sampleRate) {
        if (!this._app || !this._isSample(sampleRate)) {
            return;
        }

        if (this._queue.length) {

            // single send
            for (var i = 0, n = this._queue.length; i < n; i++) {
                this._beacon.send(this._queue[i]);
            }

            // reset queue
            this._queue = [];
        }
    },
    _isSample: function (sampleRate) {
        sampleRate = sampleRate > 0 ? sampleRate : this._config.sampleRate;
        return (this.visitorCode % 1E4) < (sampleRate * 100);
    }
};
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
