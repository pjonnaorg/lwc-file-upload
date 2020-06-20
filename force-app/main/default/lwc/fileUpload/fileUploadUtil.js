export function isNarrow(variant) {
    return typeof variant === 'string' && variant.toLowerCase() === 'narrow';
}

export function isBase(variant) {
    return typeof variant === 'string' && variant.toLowerCase() === 'base';
}

export const proto = {
    add(className) {
        if (typeof className === 'string') {
            this[className] = true;
        } else {
            Object.assign(this, className);
        }
        return this;
    },
    invert() {
        Object.keys(this).forEach(key => {
            this[key] = !this[key];
        });
        return this;
    },
    toString() {
        return Object.keys(this)
            .filter(key => this[key])
            .join(' ');
    }
};