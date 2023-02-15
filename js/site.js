var Manager = {
    getDevices: () => JSON.parse(window.localStorage.getItem("devices") || "[]"),
    setDevices: (devices) => window.localStorage.setItem("devices", JSON.stringify(devices)),

    addDevice: (address, description) => {
        var devices = Manager.getDevices();
        if (devices.find(i => i.address == address) !== undefined) {
            throw "Urządzenie już istnieje!";
        }

        devices.push({
            address: address,
            description: description
        });
        Manager.setDevices(devices);
    }
};

function renderDevices() {
    Manager.getDevices().forEach(device => {
        var devId = "dev-" + device.address.replaceAll(".", "-");
        if ($("#" + devId).length) {
            return;
        }

        var listItem = $("<a>")
            .addClass("list-group-item")
            .addClass("list-group-item-action")
            .attr("id", devId)
            .attr("role", "tabpanel")
            .attr("href", "#" + devId + "-content")
            .data("toggle", "list")
            .text(device.description + " (" + device.address + ")")
            .on("click", function (e) {
                e.preventDefault()
                $(this).tab("show")
            });
        $("#devices").append(listItem);
    });
}

$("#btnAddDevice").click(() => {
    var address = $("#inAddress").val();
    var description = $("#inDescription").val();

    try {
        Manager.addDevice(address, description);
        renderDevices();
    } catch (e) {
        alert(e);
    }
    return false;
})

renderDevices();

setInterval(() => {
    Manager.getDevices().forEach(device => {
        var date = new Date();
        var offset = date.getTimezoneOffset();

        var dateStr = (new Date(date - offset * 60000)).toISOString().split(".")[0];
        $.ajax("http://" + device.address + ":2137/wallclock", {
            data: JSON.stringify({
                "time":dateStr
            }),
            contentType: "application/json",
            type: "POST"
        });
    });
}, 30000);
