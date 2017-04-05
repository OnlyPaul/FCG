// store translation information
// start the system with z = -2.8 to compensate the perspective
var trCubeStack = {
	0: { 'x': 0, 'y': 0, 'z': -2.8 },
	1: { 'x': 0, 'y': 0, 'z': 0 },
	2: { 'x': 0, 'y': 0, 'z': 0 },
	3: { 'x': 0, 'y': 0, 'z': 0 },
	4: { 'x': 0, 'y': 0, 'z': 0 },
	5: { 'x': 0, 'y': 0, 'z': 0 },
	6: { 'x': 0, 'y': 0, 'z': 0 },
	7: { 'x': 0, 'y': 0, 'z': 0 },
	8: { 'x': 0, 'y': 0, 'z': 0 },
	9: { 'x': 0, 'y': 0, 'z': 0 }
};

// store scaling information
var scCubeStack = {
	0: { 'x': 1, 'y': 1, 'z': 1 },
	1: { 'x': 1, 'y': 1, 'z': 1 },
	2: { 'x': 1, 'y': 1, 'z': 1 },
	3: { 'x': 1, 'y': 1, 'z': 1 },
	4: { 'x': 1, 'y': 1, 'z': 1 },
	5: { 'x': 1, 'y': 1, 'z': 1 },
	6: { 'x': 1, 'y': 1, 'z': 1 },
	7: { 'x': 1, 'y': 1, 'z': 1 },
	8: { 'x': 1, 'y': 1, 'z': 1 },
	9: { 'x': 1, 'y': 1, 'z': 1 }
};

var rotMatArray = [];
for (i=0; i<10; i++) {
    rotMatArray.push(mat4.create());
    mat4.identity(rotMatArray[i]);

}

function drawScene_3d() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(pMatrix, degToRad(45), gl.viewportWidth / gl.viewportHeight, 0.01, 2000.0);
	//mat4.ortho(pMatrix, -1, 1, -1, 1, 0.01, 2000);

	mat4.identity(mvMatrix);

    //mat4.translate(mvMatrix, mvMatrix, [0, 0, -2.8]);
    mat4.translate(mvMatrix, mvMatrix, [trCubeStack[0].x, trCubeStack[0].y, trCubeStack[0].z]);
    mat4.multiply(mvMatrix, mvMatrix, rotMatArray[0]);
	mat4.scale(mvMatrix, mvMatrix, [scCubeStack[0].x, scCubeStack[0].y, scCubeStack[0].z]);

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
		mat4.translate(mvMatrix, mvMatrix, cubePos[i]); // move to its position

		// the transitions after this are controlled by the user
        mat4.translate(mvMatrix, mvMatrix, [trCubeStack[i+1].x, trCubeStack[i+1].y, trCubeStack[i+1].z]);
        mat4.multiply(mvMatrix, mvMatrix, rotMatArray[i+1]);
        mat4.scale(mvMatrix, mvMatrix, [scCubeStack[i+1].x, scCubeStack[i+1].y, scCubeStack[i+1].z]);

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

	// global CS axes
	if (obj_selection[0]) {
		mvPushMatrix();
		mat4.scale(mvMatrix, mvMatrix, [2.5, 2.5, 2.5]);
		mat4.scale(mvMatrix, mvMatrix, [1/scCubeStack[0].x, 1/scCubeStack[0].y, 1/scCubeStack[0].z]);
		setMatrixUniforms();
		gl.drawArrays(gl.LINES, 0, axisVertexPositionBuffer.numItems);
		mvPopMatrix();
	}

	// individual CS axes
	for (i=0; i<n_cube; i++) {
		if (obj_selection[i+1]) {
			mvPushMatrix();
			mat4.translate(mvMatrix, mvMatrix, cubePos[i]); // analog to the cubes

			// the transitions after this are controlled by the user
            mat4.translate(mvMatrix, mvMatrix, [trCubeStack[i+1].x, trCubeStack[i+1].y, trCubeStack[i+1].z]);
            mat4.multiply(mvMatrix, mvMatrix, rotMatArray[i+1]);

			setMatrixUniforms();
			gl.drawArrays(gl.LINES, 0, axisVertexPositionBuffer.numItems);
			mvPopMatrix();
		}
	}

	gl.enable(gl.DEPTH_TEST);
}

function rotate_shapes() {
	for (i=0; i<=9; i++) {
		if (obj_selection[i]) {
			if (map['w']) {
				mat4.rotateX(rotMatArray[i], rotMatArray[i], degToRad(-2));
			}
			if (map['s']) {
                mat4.rotateX(rotMatArray[i], rotMatArray[i], degToRad(2));
			}
			if (map['e']) {
                mat4.rotateY(rotMatArray[i], rotMatArray[i], degToRad(-2));
			}
			if (map['q']) {
                mat4.rotateY(rotMatArray[i], rotMatArray[i], degToRad(2));
			}
			if (map['d']) {
                mat4.rotateZ(rotMatArray[i], rotMatArray[i], degToRad(-2));
			}
			if (map['a']) {
                mat4.rotateZ(rotMatArray[i], rotMatArray[i], degToRad(2));
			}
		}
	}
	drawScene_3d();
}

function translate_shapes() {
    for (i=0; i<=9; i++) {
        if (obj_selection[i]) {
            if (map['ArrowRight']) {
                trCubeStack[i].x += 0.01;
                //mat4.translate(rotMatArray[i], rotMatArray[i], [0.01, 0, 0]);
            }
            if (map['ArrowLeft']) {
                trCubeStack[i].x -= 0.01;
                // mat4.translate(rotMatArray[i], rotMatArray[i], [-0.01, 0, 0]);
            }
            if (map['ArrowUp']) {
                trCubeStack[i].y += 0.01;
                // mat4.translate(rotMatArray[i], rotMatArray[i], [0, 0.01, 0]);
            }
            if (map['ArrowDown']) {
                trCubeStack[i].y -= 0.01;
                // mat4.translate(rotMatArray[i], rotMatArray[i], [0, -0.01, 0]);
            }
            if (map[',']) {
                trCubeStack[i].z -= 0.01;
                // mat4.translate(rotMatArray[i], rotMatArray[i], [0, 0, -0.01]);
            }
            if (map['.']) {
                trCubeStack[i].z += 0.01;
                // mat4.translate(rotMatArray[i], rotMatArray[i], [0, 0, 0.01]);
            }
        }
    }
    drawScene_3d();
}

function scale_shapes() {
    for (i=0; i<=9; i++) {
        if (obj_selection[i]) {
            if (map['x']) {
                scCubeStack[i].x *= 0.9;
            }
            if (map['X']) {
                scCubeStack[i].x *= 1.1;
            }
            if (map['y']) {
                scCubeStack[i].y *= 0.9;
            }
            if (map['Y']) {
                scCubeStack[i].y *= 1.1;
            }
            if (map['z']) {
                scCubeStack[i].z *= 0.9;
            }
            if (map['Z']) {
                scCubeStack[i].z *= 1.1;
            }
        }
    }
    drawScene_3d();
}

function test_tr() {
	drawScene_3d();
}