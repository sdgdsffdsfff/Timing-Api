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
