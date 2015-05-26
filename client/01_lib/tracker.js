var SEND_DELAY = 300;
function Tracker(config) {
    this._config = util.merge({
        sampleRate: 100,
        beacon: "${REQURL}"
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

Tracker.VERSION = "${VERSION}";

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