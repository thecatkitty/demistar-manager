function updateDeviceView(device) {
    device.api.setWallclock(new Date())
        .then(_ => device.api.getWallclock())
        .then(data => {
            device.bindings.update("updated", new Date(data.time).toLocaleString());
            device.bindings.get("updated")
                .removeClass("text-danger")
                .addClass("text-success");
            device.listItem.removeClass("list-group-item-danger");
        })
        .catch(error => {
            var alert = $("#template-alert").clone()
                .removeAttr("id")
                .addClass("alert-danger");
            new Bindings(alert).fill({ message: error });
            device.bindings.element.prepend(alert);
            device.bindings.get("updated")
                .removeClass("text-success")
                .addClass("text-danger");
            device.listItem.addClass("list-group-item-danger");
        })
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

    device.listItem = listItem;
    new Bindings(listItem).fill(device);
    $("#dev-links").append(listItem);

    var content = $("#template-dev-content").clone()
        .attr("id", devId + "-content");
    device.bindings = new Bindings(content);
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

