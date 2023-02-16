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
    $("#dev-links").append(listItem);

    var content = $("#template-dev-content").clone()
        .attr("id", devId + "-content");
    fillBindings(content, device);
    $("#dev-contents").append(content);

    device.updater = setInterval(() => device.api.setWallclock(new Date()), 30000);
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

