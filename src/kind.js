'use strict';

import * as KindNames from './kindNames';
import {RGB} from './model/models';

const kinds = {};

kinds[KindNames.BINARY] = {
    components: 1,
    alpha: 0,
    bitDepth: 1
};

kinds[KindNames.GREY] = {
    components: 1,
    alpha: 1,
    bitDepth: 8
};

kinds[KindNames.RGBA] = {
    components: 3,
    alpha: 1,
    bitDepth: 8,
    colorModel: RGB
};

export function getKind(kind) {
    return kinds[kind];
}

export function getPixelArray(kind, length) {
    var arr;
    switch(kind.bitDepth) {
        case 8:
            arr = new Uint8ClampedArray(length);
            break;
        case 16:
            arr = new Uint16Array(length);
            break;
        default:
            // TODO binary
            throw new Error('Cannot create pixel array for bit depth ' + kind.bitDepth);
    }

    // alpha channel is 100% by default
    if (kind.alpha) {
        for (var i = kind.components; i < arr.length; i += kind.channels) {
            arr[i] = kind.maxValue;
        }
    }

    return arr;
}
