var test = 0;
var tr = 0;

function drawScene_3d() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

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
        mat4.rotate(mvMatrix, mvMatrix, degToRad(test), [1, 1, 1]);
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
        mvPushMatrix();
        mat4.translate(mvMatrix, mvMatrix, cubePos[i]);
        mat4.rotate(mvMatrix, mvMatrix, degToRad(test), [1, 1, 1]);
        setMatrixUniforms();
        gl.drawArrays(gl.LINES, 0, axisVertexPositionBuffer.numItems);
        mvPopMatrix();
    }

    gl.enable(gl.DEPTH_TEST);

    /*
    // 1st cube
    mvPushMatrix();
    mat4.translate(mvMatrix, mvMatrix, cubePos[0]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();

    // 2nd cube
    mvPushMatrix();
    mat4.translate(mvMatrix, mvMatrix, cubePos[1]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();

    // 3rd cube
    mvPushMatrix();
    mat4.translate(mvMatrix, mvMatrix, cubePos[2]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();

    // 4th cube
    mvPushMatrix();
    mat4.translate(mvMatrix, mvMatrix, cubePos[3]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();

    // 5th cube
    mvPushMatrix();
    mat4.translate(mvMatrix, mvMatrix, cubePos[4]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();

    // 6th cube
    mvPushMatrix();
    mat4.translate(mvMatrix, mvMatrix, cubePos[5]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();

    // 7th cube
    mvPushMatrix();
    mat4.translate(mvMatrix, mvMatrix, cubePos[6]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();

    // 8th cube
    mvPushMatrix();
    mat4.translate(mvMatrix, mvMatrix, cubePos[7]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [1, 1, 1]);

    //gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    //gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    //gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();

    // 9th cube
    mvPushMatrix();
    mat4.translate(mvMatrix, mvMatrix, cubePos[8]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();


    // test axis lines

    gl.disable(gl.DEPTH_TEST);
    mvPushMatrix();

    mat4.translate(mvMatrix, mvMatrix, cubePos[0]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, axisVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, axisVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.LINES, 0, axisVertexPositionBuffer.numItems);

    mvPopMatrix(); */

    /*mvPushMatrix();
    //console.log('baka1');
    mat4.translate(mvMatrix, mvMatrix, [0.5, 0.0, 0.0]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, shapeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, shapeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //console.log('baka2');

    gl.bindBuffer(gl.ARRAY_BUFFER, shapeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, shapeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //console.log('baka3');

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shapeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, 0, shapeVertexIndexBuffer.numItems, gl.UNSIGN_SHORT, 0);
    //console.log('baka4');

    mvPopMatrix();*/
}

function rotate_mini_tri() {
    test += 2;
    test %= 360;
    drawScene_3d();
}

function test_tr() {
    tr += 0.01;
    drawScene_3d();
}