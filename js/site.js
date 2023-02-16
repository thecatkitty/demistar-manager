function fillBindings(element, model) {
    $(element)
        .find("[data-bind]")
        .each(function (i) {
            $(this).text(model[$(this).data("bind")])
        });
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
    $("#devices").append(listItem);

    var content = $("#template-dev-content").clone()
        .attr("id", devId + "-content");
    fillBindings(content, device);
    $("#devicesContent").append(content);

    device.updater = setInterval(() => device.api.setWallclock(new Date()), 30000);
}

Configuration.load();

$("#btnAddDevice").click(() => {
    var address = $("#inAddress").val();
    var description = $("#inDescription").val();

    try {
        Configuration.addDevice(address, description);
    } catch (e) {
        alert(e);
    }
    return false;
})

