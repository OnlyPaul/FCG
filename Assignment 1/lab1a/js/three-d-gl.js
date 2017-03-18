var test = 0;

function drawScene_3d(deg) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.identity(mvMatrix);

    mat4.scale(mvMatrix, mvMatrix, [0.5, 0.5, 0.5]);

    mvPushMatrix();

    mat4.translate(mvMatrix, mvMatrix, [-0.8, 0.0, 0.0]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(-deg), [1, 0, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

    mvPopMatrix();

    mvPushMatrix();

    mat4.translate(mvMatrix, mvMatrix, [0.5, 0.0, 0.0]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(deg), [0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer2);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer2.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer2);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer2.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer2.numItems);

    mvPopMatrix();
}

function rotate_mini_tri() {
    test += 2;
    test %= 360;
    drawScene_3d(test);
}