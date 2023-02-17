class Bindings {
    constructor(element) {
        this.element = element;
    }

    get(name) {
        return $(this.element)
            .find("[data-bind=" + name + "]");
    }

    update(name, value) {
        this.get(name)
            .each(function (i) {
                $(this).html(value)
            });
    }

    fill(model) {
        for (const [name, value] of Object.entries(model)) {
            this.update(name, value);
        }
    }
}
