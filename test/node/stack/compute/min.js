import {Image, getHash} from '../../common';
import min from '../../../../src/stack/compute/min';

describe('check stack min method', function () {
    it ('should return global minimal for GREY image', function() {

        let images=[];

        images.push(
            new Image(2, 2,
                [
                    4, 5,
                    6, 7
                ],
                {kind: 'GREY'}
            )
        );

        images.push(
            new Image(2, 2,
                [
                    2, 3,
                    4, 5
                ],
                {kind: 'GREY'}
            )
        );

        images.push(
            new Image(2, 2,
                [
                    1, 5,
                    6, 7
                ],
                {kind: 'GREY'}
            )
        );

        min(images).should.eql([1]);
    });


    it ('should return global minimal for RGBA image', function() {

        let images=[];

        images.push(
            new Image(2, 1,
                [
                    1, 2, 3, 4,
                    5, 6, 7, 8
                ]
            )
        );

        images.push(
            new Image(2, 1,
                [
                    2, 3, 1, 5,
                    6, 7, 8, 9
                ]
            )
        );

        images.push(
            new Image(2, 1,
                [
                    3, 1, 5, 6,
                    7, 8, 9, 10
                ]
            )
        );

        min(images).should.eql([1,1,1,4]);
    });

});

