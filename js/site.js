function updateBinding(element, name, value) {
    $(element)
        .find("[data-bind=" + name + "]")
        .each(function (i) {
            $(this).text(value)
        });
}

function fillBindings(element, model) {
    for (const [name, value] of Object.entries(model)) {
        updateBinding(element, name, value);
    }
}

function updateDeviceView(device) {
    device.api.setWallclock(new Date())
        .then(_ => device.api.getWallclock())
        .then(response => response.json())
        .then(data =>
            updateBinding(device.element, "updated", new Date(data.time).toLocaleString()));
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
    fillBindings(listItem, device);
    $("#dev-links").append(listItem);

    var content = $("#template-dev-content").clone()
        .attr("id", devId + "-content");
    fillBindings(content, device);
    $("#dev-contents").append(content);

    device.element = content;
    device.updater = createUpdater(device, 60000);
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

