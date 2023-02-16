Configuration.onDeviceAdd = device => {
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

