ArrayUtils = function() {
    // augment typed array e.g. Float32Array with useful functions such as push, reset
    function augmentTypedArray(typedArray, numComponents) {
        var cursor = 0;
        typedArray.push = function() {
            for (var ii = 0; ii < arguments.length; ++ii) {
                var value = arguments[ii];
                if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
                    for (var jj = 0; jj < value.length; ++jj) {
                        typedArray[cursor++] = value[jj];
                    }
                } else {
                    typedArray[cursor++] = value;
                }
            }
        };
        typedArray.reset = function(opt_index) {
            cursor = opt_index || 0;
        };
        typedArray.numComponents = numComponents;
        Object.defineProperty(typedArray, 'numElements', {
            get: function() {
                return this.length / this.numComponents | 0;
            }
        });
        return typedArray;
    }

    var createAugmentedTypedArray = function (numComponents, numElements, opt_type) {
        var Type = opt_type || Float32Array;
        return augmentTypedArray(new Type(numComponents * numElements), numComponents);
    };

    return {
        createAugmentedTypedArray: createAugmentedTypedArray
    };
}();