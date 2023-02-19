function formatDuration(seconds) {
    var str = "";
    if (seconds >= 3600) {
        var hours = Math.floor(seconds / 3600);
        str += hours + "h ";
        seconds -= hours * 3600;
    }

    if (seconds >= 60) {
        var minutes = Math.floor(seconds / 60);
        str += minutes + "min ";
        seconds -= minutes * 60;
    }

    if ((seconds > 0) || (str.length == 0)) {
        str += seconds + "s";
    }

    return str.trim();
}

function hexToRgb(hex) {
    var shortPattern = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shortPattern, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function renderStage(stage) {
    var template = $("#template-stage-" + stage.name);
    if (template.length != 0) {
        var div = template.clone().removeAttr("id");
        new Bindings(div).fill(stage);
        return div;
    }

    var div = $("<div>");

    div.append("<b>" + stage.name + "</b>");
    for (const [key, value] of Object.entries(stage)) {
        if (key != "name") {
            div.append("<p>" + key + ": " + JSON.stringify(value) + "</p>")
        }
    }

    return div;
}

function updateBacklogView(device, data) {
    var template = $("#template-timeline-item");
    var backlog = device.bindings.get("backlog");
    backlog.empty();
    for (const item of data.backlog.sort(i => i.start)) {
        var row = template.clone().removeAttr("id")
            .data("dev", device.address)
            .data("item", item.id);
        new Bindings(row).fill({
            start: new Date(item.start).toLocaleString(),
            duration: item.duration ? formatDuration(item.duration) : "∞",
            screentime: formatDuration(item.screentime),
            stage: renderStage(item.stage)
        });
        backlog.append(row);
    }
}

function showAlert(element, severity, message) {
    var alert = $("#template-alert").clone()
        .removeAttr("id")
        .addClass("alert-" + severity);
    new Bindings(alert).fill({ message: message });
    element.prepend(alert);
}

function updateDeviceView(device) {
    device.api.setWallclock(new Date())
        .then(_ => device.api.getWallclock())
        .then(data => {
            device.bindings.update("updated", new Date(data.time).toLocaleString());
            device.bindings.get("updated")
                .removeClass("text-danger")
                .addClass("text-success");
            device.listItem.removeClass("list-group-item-danger");

            return device.api.getTimeline();
        })
        .then(data => updateBacklogView(device, data))
        .catch(error => {
            showAlert(device.bindings.element, "danger", error);
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

function removeItem(initiator) {
    var row = $(initiator).parents("tr");
    var device = Configuration.devices.find(i => i.address == row.data("dev"));
    var itemid = row.data("item");

    device.api.deleteTimelineItem(itemid)
        .then(row.remove())
        .catch(error => showAlert(device.bindings.element, "danger", error));
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
        .data("device", device.address)
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

$("#btn-apply-stage").click(() => {
    var item = {
        room: $("#in-stage-room").val() * 1,
        start: $("#in-stage-start").val(),
        duration: $("#in-stage-duration").val() * 60,
        screentime: $("#in-stage-screentime").val() * 1,
        stage: {
            name: $("input[name=in-stage-name]:checked").val()
        }
    };

    if (item.stage.name == "meeting") {
        item.stage.title = $("#in-stage-top").val();
        item.stage.host = $("#in-stage-bottom").val();
    }

    if (item.stage.name == "manual") {
        item.stage.top = $("#in-stage-top").val();
        item.stage.bottom = $("#in-stage-bottom").val();

        var innerColor = hexToRgb($("#in-stage-inner-color").val());
        item.stage.inner = [
            $("#in-stage-inner-animation").val(),
            innerColor.r,
            innerColor.g,
            innerColor.b,
            $("#in-stage-inner-interval").val() * 1
        ];

        var outerColor = hexToRgb($("#in-stage-outer-color").val());
        item.stage.outer = [
            $("#in-stage-outer-animation").val(),
            outerColor.r,
            outerColor.g,
            outerColor.b,
            $("#in-stage-outer-interval").val() * 1
        ];
    }

    var address = $("#dev-contents>.active").data("device");
    var device = Configuration.devices.find(i => i.address == address);
    device.api.postTimelineItem(item)
        .then(response => {
            if (response.error) {
                showAlert($("#dlg-add-stage .modal-body"), "danger", response.error);
            } else {
                $("#dlg-add-stage").modal("hide");
                clearInterval(device.updater);
                device.updater = createUpdater(device, 60000);
            }
        })
        .catch(e => showAlert($("#dlg-add-stage .modal-body"), "danger", e));
})

$("input[name=in-stage-name]").change(function () {
    var checked = $("input[name=in-stage-name]:checked").val();
    if (checked == "manual") {
        $("#grp-stage-inner").show();
        $("#grp-stage-outer").show();
    } else {
        $("#grp-stage-inner").hide();
        $("#grp-stage-outer").hide();
    }

    if (checked == "wallclock") {
        $("#in-stage-top").prop("disabled", true);
        $("#in-stage-bottom").prop("disabled", true);
    } else {
        $("#in-stage-top").prop("disabled", false);
        $("#in-stage-bottom").prop("disabled", false);
    }
});

var date = new Date();
var offset = date.getTimezoneOffset();
$("#in-stage-start").val((new Date(date - offset * 60000)).toISOString().split(".")[0]);
$("#grp-stage-inner").hide();
$("#grp-stage-outer").hide();
