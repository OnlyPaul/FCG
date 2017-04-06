/*
*  DECLARING GLOBAL VARIABLES
------------------------------------------------- */
// other
var lastTime = 0; // storing last timestamp of animation
var rTri = 0; // referring to rotation angle of the triangle in degree

/*
* AUXILIARY FUNCTIONS ZONE
-------------------------------------------------- */
function animate_triangle() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        rTri %= 360;
        rTri += (90*elapsed) / 1000.0;
    }
    lastTime = timeNow;
}

/*
 *  CORE FUNCTIONS ZONE
 ------------------------------------------------- */

function drawScene_triangle() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.identity(mvMatrix);

	mat4.scale(mvMatrix, mvMatrix, [0.5, 0.5, 0.5]);

	mvPushMatrix();

	mat4.rotate(mvMatrix, mvMatrix, degToRad(rTri), [0, 1, 0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

	mvPopMatrix();
}

var myReq;
function renderLoop_triangle() {
    myReq = requestAnimFrame(renderLoop_triangle);
    drawScene_triangle();
    animate_triangle();
}

function triangle_stop() {
    //window.cancelAnimationFrame(myReq);
	cancelAnimFrame(myReq);
}