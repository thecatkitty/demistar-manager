class DemistarApi {
    constructor(rootUrl) {
        this.root = rootUrl;
    }

    // Lower layer - HTTP methods and JSON
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

    delete(endpoint) {
        return fetch(this.root + endpoint, { method: "DELETE" })
            .then(response => response.json());
    }

    // API - Local time settings
    setWallclock(date) {
        var offset = date.getTimezoneOffset();
        var dateStr = (new Date(date - offset * 60000)).toISOString().split(".")[0];

        return this.post("/wallclock", { time: dateStr });
    }

    getWallclock() {
        return this.get("/wallclock");
    }

    // API - Timeline programming
    getTimeline() {
        return this.get("/timeline");
    }

    postTimelineItem(item) {
        return this.post("/timeline", item);
    }

    deleteTimeline() {
        return this.delete("/timeline");
    }

    deleteTimelineItem(id) {
        return this.delete("/timeline/" + id);
    }
}
