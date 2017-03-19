var rCubeStack = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var tr = 0;

function drawScene_3d() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(rCubeStack[0]), [1, 1, 1]);

    var cubePos = [
        [-0.6,  0.6,  0.0],
        [ 0.0,  0.6,  0.0],
        [ 0.6,  0.6,  0.0],
        [-0.6,  0.0,  0.0],
        [ 0.0,  0.0,  0.0],
        [ 0.6,  0.0,  0.0],
        [-0.6, -0.6,  0.0],
        [ 0.0, -0.6,  0.0],
        [ 0.6, -0.6,  0.0]
    ];

    var n_cube = 9;

    // bind cubes' buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

    for (i=0; i<n_cube; i++) {
        mvPushMatrix();
        mat4.translate(mvMatrix, mvMatrix, cubePos[i]);
        mat4.rotate(mvMatrix, mvMatrix, degToRad(rCubeStack[i+1]), [1, 1, 1]);
        mat4.translate(mvMatrix, mvMatrix, [tr, 0, 0]);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
    }

    // bind axis line buffers
    gl.disable(gl.DEPTH_TEST);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, axisVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, axisVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    for (i=0; i<n_cube; i++) {
        if (obj_selection[i+1]) {
            mvPushMatrix();
            mat4.translate(mvMatrix, mvMatrix, cubePos[i]);
            mat4.rotate(mvMatrix, mvMatrix, degToRad(rCubeStack[i + 1]), [1, 1, 1]);
            setMatrixUniforms();
            gl.drawArrays(gl.LINES, 0, axisVertexPositionBuffer.numItems);
            mvPopMatrix();
        }
    }

    // global CS axis
    if (obj_selection[0]) {
        mvPushMatrix();
        mat4.scale(mvMatrix, mvMatrix, [2.5, 2.5, 2.5]);
        setMatrixUniforms();
        gl.drawArrays(gl.LINES, 0, axisVertexPositionBuffer.numItems);
        mvPopMatrix();
    }

    gl.enable(gl.DEPTH_TEST);
}

function rotate_mini_tri() {
    for (i=0; i<=9; i++) {
        if (obj_selection[i]) {
            rCubeStack[i] += 2;
            rCubeStack[i] %= 360;
        }
    }

    drawScene_3d();
}

function test_tr() {
    tr += 0.01;
    drawScene_3d();
}