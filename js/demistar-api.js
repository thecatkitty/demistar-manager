class DemistarApi {
    constructor(rootUrl) {
        this.root = rootUrl;
    }

    post(endpoint, data) {
        return fetch(this.root + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/javascript"
            },
            body: JSON.stringify(data)
        })
    }

    setWallclock(date) {
        var offset = date.getTimezoneOffset();
        var dateStr = (new Date(date - offset * 60000)).toISOString().split(".")[0];

        return this.post("/wallclock", { time: dateStr });
    }
}
