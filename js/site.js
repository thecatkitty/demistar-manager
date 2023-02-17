function updateDeviceView(device) {
    device.api.setWallclock(new Date())
        .then(_ => device.api.getWallclock())
        .then(response => response.json())
        .then(data =>
            device.bindings.update("updated", new Date(data.time).toLocaleString()));
}

function createUpdater(device, interval) {
    updateDeviceView(device);
    return setInterval(() => updateDeviceView(device), interval);
}

Configuration.onDeviceAdd = device => {
    var devId = "dev-" + device.address.replaceAll(".", "-");
    if ($("#" + devId).length) {
        return;
    }

    var listItem = $("#template-dev").clone()
        .attr("id", devId)
        .attr("href", "#" + devId + "-content")
        .on("click", function (e) {
            e.preventDefault()
            $(this).tab("show")
        });

    new Bindings(listItem).fill(device);
    $("#dev-links").append(listItem);

    var content = $("#template-dev-content").clone()
        .attr("id", devId + "-content");
    device.bindings = new Bindings(content);
    device.bindings.fill(device);
    device.updater = createUpdater(device, 60000);
    $("#dev-contents").append(content);
}

Configuration.load();

$("#btn-add-dev").click(() => {
    var address = $("#in-address").val();
    var description = $("#in-description").val();

    try {
        Configuration.addDevice(address, description);
    } catch (e) {
        alert(e);
    }
    return false;
})

