var Sphere = function() {
    createSphereVertices = function(
        radius,
        subdivisionsAxis,
        subdivisionsHeight,
        opt_startLatitudeInRadians,
        opt_endLatitudeInRadians,
        opt_startLongitudeInRadians,
        opt_endLongitudeInRadians) {
        if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
            throw Error('subdivisionAxis and subdivisionHeight must be > 0');
        }

        opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
        opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
        opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
        opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);

        var latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
        var longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

        var numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
        var positions = ArrayUtils.createAugmentedTypedArray(3, numVertices);
        var normals   = ArrayUtils.createAugmentedTypedArray(3, numVertices);

        // Generate the individual vertices in our vertex buffer.
        for (var y = 0; y <= subdivisionsHeight; y++) {
            for (var x = 0; x <= subdivisionsAxis; x++) {
                // Generate a vertex based on its spherical coordinates
                var u = x / subdivisionsAxis;
                var v = y / subdivisionsHeight;
                var theta = longRange * u;
                var phi = latRange * v;
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
                var ux = cosTheta * sinPhi;
                var uy = cosPhi;
                var uz = sinTheta * sinPhi;
                positions.push(radius * ux, radius * uy, radius * uz);
                normals.push(ux, uy, uz);
            }
        }

        var numVertsAround = subdivisionsAxis + 1;
        var indices = ArrayUtils.createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array);
        for (x = 0; x < subdivisionsAxis; x++) {
            for (y = 0; y < subdivisionsHeight; y++) {
                // Make triangle 1 of quad.
                indices.push(
                    (y) * numVertsAround + x,
                    (y) * numVertsAround + x + 1,
                    (y + 1) * numVertsAround + x
                );

                // Make triangle 2 of quad.
                indices.push(
                    (y + 1) * numVertsAround + x,
                    (y) * numVertsAround + x + 1,
                    (y + 1) * numVertsAround + x + 1
                );
            }
        }

        return {
            position: positions,
            normal: normals,
            indices: indices
        };
    };

    // create specific monotone color on vertices
    var makeVertexColor = function(vertices, r, g, b, a) {
        var numElements = vertices.position.numElements;
        var vcolors = ArrayUtils.createAugmentedTypedArray(4, numElements, Uint8Array);

        if (vertices.indices) {
            // if there are indices
            for (i=0; i<numElements; i++)
                vcolors.push(r, g, b, a);
        } else {
            // if no indices defined
            var numVertsPerColor = 3; // triangle mesh
            var numSets = numElements/numVertsPerColor;
            for (i=0; i<numSets; i++) {
                for (j=0; j<numVertsPerColor; j++)
                    vcolors.push(r, g, b, a);
            }
        }

        vertices.color = vcolors;

        return vertices;
    };

    return {
        createSphereVertices: createSphereVertices,
        makeVertexColor: makeVertexColor
    };
}();