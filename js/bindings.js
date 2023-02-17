class Bindings {
    constructor(element) {
        this.element = element;
    }

    update(name, value) {
        $(this.element)
            .find("[data-bind=" + name + "]")
            .each(function (i) {
                $(this).text(value)
            });
    }

    fill(model) {
        for (const [name, value] of Object.entries(model)) {
            this.update(name, value);
        }
    }
}
