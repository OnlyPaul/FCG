// store translation information
// start the system with z = -2.8 to compensate the perspective
var trSphereStack = {
	0: { 'x': 0, 'y': 0, 'z': 0 },
	1: { 'x': 0, 'y': 0, 'z': 0 },
	2: { 'x': 0, 'y': 0, 'z': 0 },
	3: { 'x': 0, 'y': 0, 'z': 0 },
	4: { 'x': 0, 'y': 0, 'z': 0 },
	5: { 'x': 0, 'y': 0, 'z': 0 },
	6: { 'x': 0, 'y': 0, 'z': 0 },
	7: { 'x': 0, 'y': 0, 'z': 0 },
	8: { 'x': 0, 'y': 0, 'z': 0 },
	9: { 'x': 0, 'y': 0, 'z': 0 },
    10: { 'x': 0, 'y': 0, 'z': 0 }
};

// store scaling information
var scSphereStack = {
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
for (i=0; i<11; i++) {
    rotMatArray.push(mat4.create());
    mat4.identity(rotMatArray[i]);

}

var camPos = [0, 0, 2.8];
var target = [0, 0, 0];
var up = [0, 1, 0];
var camMatrix = Camera.pointAt(camPos, target, up);

function drawScene_3d() {
	var prog = programInUse();

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // light position
    lightPos[0] = 0;
    lightPos[1] = 10;
    lightPos[2] = 0;

    lightPos[0] += trSphereStack[10].x;
    lightPos[1] += trSphereStack[10].y;
    lightPos[2] += trSphereStack[10].z;
    // vec3.transformMat4(lightPos, lightPos, rotMatArray[10]);

    console.log(trSphereStack[10]);
    console.log(lightPos);

	mat4.perspective(pMatrix, degToRad(45), gl.viewportWidth / gl.viewportHeight, 0.01, 2000.0);
	//mat4.ortho(pMatrix, -1, 1, -1, 1, 0.01, 2000);

	mat4.identity(mvMatrix);
	mat4.invert(mvMatrix, camMatrix);

    //mat4.translate(mvMatrix, mvMatrix, [0, 0, -2.8]);
    mat4.translate(mvMatrix, mvMatrix, [trSphereStack[0].x, trSphereStack[0].y, trSphereStack[0].z]);
    mat4.multiply(mvMatrix, mvMatrix, rotMatArray[0]);
	mat4.scale(mvMatrix, mvMatrix, [scSphereStack[0].x, scSphereStack[0].y, scSphereStack[0].z]);

	var spherePos = [
		[-0.7,  0.7,  0.0],
		[ 0.0,  0.7,  0.0],
		[ 0.7,  0.7,  0.0],
		[-0.7,  0.0,  0.0],
		[ 0.0,  0.0,  0.0],
		[ 0.7,  0.0,  0.0],
		[-0.7, -0.7,  0.0],
		[ 0.0, -0.7,  0.0],
		[ 0.7, -0.7,  0.0]
	];

	var n_sphere = 9;

    // bind sphere buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.vertexAttribPointer(prog.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    if (useshaderGD || useShaderGS) {
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
        gl.vertexAttribPointer(prog.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
    gl.vertexAttribPointer(prog.vertexColorAttribute, sphereVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	for (i=0; i<n_sphere; i++) {
		mvPushMatrix();
		mat4.translate(mvMatrix, mvMatrix, spherePos[i]); // move to its position

		// the transitions after this are controlled by the user
        mat4.translate(mvMatrix, mvMatrix, [trSphereStack[i+1].x, trSphereStack[i+1].y, trSphereStack[i+1].z]);
        mat4.multiply(mvMatrix, mvMatrix, rotMatArray[i+1]);
        mat4.scale(mvMatrix, mvMatrix, [scSphereStack[i+1].x, scSphereStack[i+1].y, scSphereStack[i+1].z]);

        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		mvPopMatrix();
	}

	// bind axis line buffers
	gl.disable(gl.DEPTH_TEST);

	gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexPositionBuffer);
	gl.vertexAttribPointer(prog.vertexPositionAttribute, axisVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexColorBuffer);
	gl.vertexAttribPointer(prog.vertexColorAttribute, axisVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// global CS axes
	if (obj_selection[0] || obj_selection[10]) {
		mvPushMatrix();
		mat4.scale(mvMatrix, mvMatrix, [2.5, 2.5, 2.5]);
		mat4.scale(mvMatrix, mvMatrix, [1/scSphereStack[0].x, 1/scSphereStack[0].y, 1/scSphereStack[0].z]);
		setMatrixUniforms();
		gl.drawArrays(gl.LINES, 0, axisVertexPositionBuffer.numItems);
		mvPopMatrix();
	}

	// individual CS axes
	for (i=0; i<n_sphere; i++) {
		if (obj_selection[i+1]) {
			mvPushMatrix();
			mat4.translate(mvMatrix, mvMatrix, spherePos[i]); // analog to the spheres

			// the transitions after this are controlled by the user
            mat4.translate(mvMatrix, mvMatrix, [trSphereStack[i+1].x, trSphereStack[i+1].y, trSphereStack[i+1].z]);
            mat4.multiply(mvMatrix, mvMatrix, rotMatArray[i+1]);

			setMatrixUniforms();
			gl.drawArrays(gl.LINES, 0, axisVertexPositionBuffer.numItems);
			mvPopMatrix();
		}
	}

	gl.enable(gl.DEPTH_TEST);
}

function rotate_shapes() {
	for (i=0; i<=10; i++) {
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
    for (i=0; i<=10; i++) {
        if (obj_selection[i]) {
        	console.log("i: " + i);
            if (map['ArrowRight']) {
                trSphereStack[i].x += 0.01;
                //mat4.translate(rotMatArray[i], rotMatArray[i], [0.01, 0, 0]);
            }
            if (map['ArrowLeft']) {
                trSphereStack[i].x -= 0.01;
                // mat4.translate(rotMatArray[i], rotMatArray[i], [-0.01, 0, 0]);
            }
            if (map['ArrowUp']) {
                trSphereStack[i].y += 0.01;
                // mat4.translate(rotMatArray[i], rotMatArray[i], [0, 0.01, 0]);
            }
            if (map['ArrowDown']) {
                trSphereStack[i].y -= 0.01;
                // mat4.translate(rotMatArray[i], rotMatArray[i], [0, -0.01, 0]);
            }
            if (map[',']) {
                trSphereStack[i].z -= 0.01;
                // mat4.translate(rotMatArray[i], rotMatArray[i], [0, 0, -0.01]);
            }
            if (map['.']) {
                trSphereStack[i].z += 0.01;
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
                scSphereStack[i].x *= 0.9;
            }
            if (map['X']) {
                scSphereStack[i].x *= 1.1;
            }
            if (map['y']) {
                scSphereStack[i].y *= 0.9;
            }
            if (map['Y']) {
                scSphereStack[i].y *= 1.1;
            }
            if (map['z']) {
                scSphereStack[i].z *= 0.9;
            }
            if (map['Z']) {
                scSphereStack[i].z *= 1.1;
            }
        }
    }
    drawScene_3d();
}

function test_tr() {
	drawScene_3d();
}