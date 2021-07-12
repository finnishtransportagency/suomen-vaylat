export class Layer {
    constructor (id, name, opacity, visible) {
        this.id = id;
        this.name = name;
        this.opacity = opacity;
        this.visible = visible;
    }
    getId () {
        return this.id;
    }
    getName () {
        return this.name;
    }
    getOpacity () {
        return this.opacity;
    }
    getVisible () {
        return this.visible;
    }
};
