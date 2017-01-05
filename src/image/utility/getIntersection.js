import getClosestCommonParent from './getClosestCommonParent';
/**
 * Find intersection of points between two different masks
 * @param {Image} - a mask (1 bit image)
 * @param {Image} - a mask (1 bit image)
 * @return {Object} - object containing number of white pixels for mask1, for mask 2 and for them both
 */
export default function getIntersection(mask1, mask2) {

    let parent = getClosestCommonParent(mask1, mask2);

    let startPos1 = getRelativePosition(mask1, parent);
    //console.log("startPos1: " + startPos1);
    let allRelPos1 = getRelativePositionForAllPixels(mask1, startPos1);
    let startPos2 = getRelativePosition(mask2, parent);
    //console.log("startPos2: " + startPos2);
    let allRelPos2 = getRelativePositionForAllPixels(mask2, startPos2);

    let commonSurface = getCommonSurface(allRelPos1, allRelPos2);
    //console.log('commonSurface: ' + commonSurface);
    let intersection = {whitePixelsMask1: [], whitePixelsMask2: [], commonWhitePixels: []};

    for (let i = 0; i < commonSurface.length; i++) {
        let currentRelativePos = commonSurface[i];
        let realPos1 = [currentRelativePos[0] - startPos1[0], currentRelativePos[1] - startPos1[1]];
        let realPos2 = [currentRelativePos[0] - startPos2[0], currentRelativePos[1] - startPos2[1]];
        let valueBitMask1 = mask1.getBitXY(realPos1[0], realPos1[1]);
        let valueBitMask2 = mask2.getBitXY(realPos2[0], realPos2[1]);
        //console.log('valueBitMask1: ' + valueBitMask1 + ', valueBitMask2: ' + valueBitMask2);

        if (valueBitMask1 === 1 && valueBitMask2 === 1) {
            intersection.commonWhitePixels.push(currentRelativePos);
        }
    }

    for (let i = 0; i < allRelPos1.length; i++) {
        let posX;
        let posY;
        if (i !== 0) {
            posX = Math.floor(i / (mask1.width - 1));
            posY = i % (mask1.width - 1);
        }
        if (mask1.getBitXY(posX, posY) === 1) {
            //console.log("white px mask1 : " + allRelPos1[i]);
            intersection.whitePixelsMask1.push(allRelPos1[i]);
        }
    }

    for (let i = 0; i < allRelPos2.length; i++) {
        let posX = 0;
        let posY = 0;
        if (i !== 0) {
            posX = Math.floor(i / (mask2.width - 1));
            posY = i % (mask2.width - 1);
        }
        if (mask2.getBitXY(posX, posY) === 1) {
            //console.log("white px mask2 : " + allRelPos2[i]);
            intersection.whitePixelsMask2.push(allRelPos2[i]);
        }
    }

    return intersection;
}

/**
 * Get relative position array for all pixels in masks
 * @param {Image} - a mask (1 bit image)
 * @param {Array} - number array, start position of mask relative to parent
 * @returns {Array} - relative position of all pixels
 */
function getRelativePositionForAllPixels(mask, startPosition) {
    //console.log('startPosition: ' + startPosition);
    let relativePositions = [];
    for (let i = 0; i < mask.height; i++) {
        for (let j = 0; j < mask.width; j++) {
            let originalPos = [i, j];
            //console.log([originalPos[0] + startPosition[0], originalPos[1] + startPosition[1]]);
            relativePositions.push([originalPos[0] + startPosition[0], originalPos[1] + startPosition[1]]);

        }
    }
    //console.log('relativePositions: ' + relativePositions);
    return relativePositions;
}

/**
 * Finds common surface for two arrays containing the positions of the pixels relative to parent image
 * @param {Array} - number array containing positions of pixels relative to parent
 * @param {Array} - number array containing positions of pixels relative to parent
 * @returns {Array} - number array containing positions of common pixels for both arrays
 */
function getCommonSurface(positionArray1, positionArray2) {
    let i = 0;
    let j = 0;
    let commonSurface = [];
    while (i < positionArray1.length && j < positionArray2.length) {
        if (positionArray1[i][0] === positionArray2[j][0] && positionArray1[i][1] === positionArray2[j][1]) {
            commonSurface.push(positionArray1[i]);
            i++;
            j++;
        } else if (positionArray1[i][0] < positionArray2[j][0]
            || (positionArray1[i][0] === positionArray2[j][0] && positionArray1[i][1] < positionArray2[j][1])) {
            i++;
        } else {
            j++;
        }
    }
    //console.log('commonSurface: ', commonSurface);
    return commonSurface;
}

function getRelativePosition(mask, targetImage) {
    if (mask === targetImage) {
        return [0, 0];
    }
    let position = [0, 0];

    let currentImage = mask;
    while (currentImage) {
        //console.log("currentImage: ", currentImage);

        if (currentImage === targetImage) {
            return position;
        }
        if (currentImage.position) {
            position[0] += currentImage.position[0];
            position[1] += currentImage.position[1];
        }

        currentImage = currentImage.parent;
    }
    // we should never reach this place, this means we could not find the parent
    // throw Error('Parent image was not found, can not get relative position.')
    return position;
}