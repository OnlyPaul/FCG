var Camera = function() {
    var pointAt = function(camPos, target, upDirection) {
        var out = new Float32Array(16);
        var x_axis = vec3.create();
        var y_axis = vec3.create();
        var z_axis = vec3.create();
        vec3.subtract(z_axis, camPos, target);
        vec3.normalize(z_axis, z_axis);

        vec3.cross(x_axis, upDirection, z_axis);
        vec3.normalize(x_axis, x_axis);

        vec3.cross(y_axis, z_axis, x_axis);
        vec3.normalize(y_axis, y_axis);

        out[0] = x_axis[0];
        out[1] = x_axis[1];
        out[2] = x_axis[2];
        out[3] = 0;
        out[4] = y_axis[0];
        out[5] = y_axis[1];
        out[6] = y_axis[2];
        out[7] = 0;
        out[8] = z_axis[0];
        out[9] = z_axis[1];
        out[10] = z_axis[2];
        out[11] = 0;
        out[12] = camPos[0];
        out[13] = camPos[1];
        out[14] = camPos[2];
        out[15] = 1;

        return out;
    };

    return {
        pointAt: pointAt
    };
}();