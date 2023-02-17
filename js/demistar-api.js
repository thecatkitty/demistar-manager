class DemistarApi {
    constructor(rootUrl) {
        this.root = rootUrl;
    }

    get(endpoint) {
        return fetch(this.root + endpoint)
            .then(response => response.json());
    }

    post(endpoint, data) {
        return fetch(this.root + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/javascript"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json());
    }

    setWallclock(date) {
        var offset = date.getTimezoneOffset();
        var dateStr = (new Date(date - offset * 60000)).toISOString().split(".")[0];

        return this.post("/wallclock", { time: dateStr });
    }

    getWallclock() {
        return this.get("/wallclock");
    }
}
