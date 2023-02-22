class Configuration {
    static devices = [];
    static onDeviceAdd = function (device) { }

    static load() {
        var devices = JSON.parse(window.localStorage.getItem("devices") || "[]");
        devices.forEach(element => this.addDevice(element.address, element.description));
    }

    static store() {
        var devices = JSON.stringify(this.devices.map(i => {
            return {
                address: i.address,
                description: i.description
            }
        }))
        window.localStorage.setItem("devices", devices);
    }

    static addDevice(address, description) {
        if (this.devices.find(i => i.address == address) !== undefined) {
            throw "A device with given address has already been defined";
        }

        var device = {
            address: address,
            description: description,
            api: new DemistarApi("http://" + address)
        };
        this.devices.push(device);
        this.onDeviceAdd(device);
        this.store();
    }
}
