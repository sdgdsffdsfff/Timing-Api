function Beacon(url) {
    this.url = url;
}

Beacon.MAX_URL_LENGTH = ${MAX_URL_LENGTH};

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
