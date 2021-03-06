/*
 *  DECLARING GLOBAL VARIABLES
 ------------------------------------------------- */
var gl;
var shaderProgram;

// model/view and projection matrix related
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

// buffer storing triangle data
var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;

// buffer for the cubes
var cubeVertexPositionBuffer;
var cubeVertexColorBuffer;
var cubeVertexIndexBuffer;

// buffer for the overlaying axes
var axisVertexPositionBuffer;
var axisVertexColorBuffer;

/*
 * AUXILIARY FUNCTIONS ZONE
 -------------------------------------------------- */
function degToRad(degree) {
    return degree*Math.PI/180;
}

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0)
        throw "Invalid Stacks. Zero member.";

    mvMatrix = mvMatrixStack.pop();
}

/*
 *  CORE FUNCTIONS ZONE
 ------------------------------------------------- */

function initGL(canvas) {
    try {
        gl = WebGLUtils.setupWebGL(canvas);
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL");
    }
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() {
    var fragmentShader = getShader(gl, "fs-default");
    var vertexShader = getShader(gl, "vs-default");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function initBuffers() {
    var vertices = [];
    var colors = [];

    // create and bind triangle's buffer
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    vertices = [
        0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;

    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    colors = [
        0.937, 0.325, 0.314, 1.0,
        0.120, 0.080, 0.080, 1.0,
        0.937, 0.325, 0.314, 0.7
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 4;
    triangleVertexColorBuffer.numItems = 3;

    // create and bind cubes' buffer
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    vertices = [
        // Front face
        -0.15, -0.15,  0.15,
        0.15, -0.15,  0.15,
        0.15,  0.15,  0.15,
        -0.15,  0.15,  0.15,

        // Back face
        -0.15, -0.15, -0.15,
        -0.15,  0.15, -0.15,
        0.15,  0.15, -0.15,
        0.15, -0.15, -0.15,

        // Top face
        -0.15,  0.15, -0.15,
        -0.15,  0.15,  0.15,
        0.15,  0.15,  0.15,
        0.15,  0.15, -0.15,

        // Bottom face
        -0.15, -0.15, -0.15,
        0.15, -0.15, -0.15,
        0.15, -0.15,  0.15,
        -0.15, -0.15,  0.15,

        // Right face
        0.15, -0.15, -0.15,
        0.15,  0.15, -0.15,
        0.15,  0.15,  0.15,
        0.15, -0.15,  0.15,

        // Left face
        -0.15, -0.15, -0.15,
        -0.15, -0.15,  0.15,
        -0.15,  0.15,  0.15,
        -0.15,  0.15, -0.15
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 24;

    cubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    colors = [
        [0.996, 0.410, 0.379, 1.0], // Front face
        [1.0, 0.5, 0.5, 1.0], // Back face
        [1.0, 1.0, 0.988, 1.0], // Top face
        [0.988, 0.988, 0.586, 1.0], // Bottom face
        [0.793, 0.598, 0.785, 1.0], // Right face
        [0.680, 0.773, 0.809, 1.0]  // Left face
    ];
    var unpackedColors = [];
    for (var i in colors) {
        var color = colors[i];
        for (var j=0; j < 4; j++) {
            unpackedColors = unpackedColors.concat(color);
        }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
    cubeVertexColorBuffer.itemSize = 4;
    cubeVertexColorBuffer.numItems = 24;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    var cubeVertexIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;

    // create and bind axis-lines' buffer
    axisVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexPositionBuffer);
    vertices = [
        // line along x-axis
        0.0, 0.0, 0.0,
        0.1, 0.0, 0.0,

        // line along y-axis
        0.0, 0.0, 0.0,
        0.0, 0.1, 0.0,

        // line along z-axis
        0.0, 0.0, 0.0,
        0.0, 0.0, 0.1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    axisVertexPositionBuffer.itemSize = 3;
    axisVertexPositionBuffer.numItems = 6;

    axisVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, axisVertexColorBuffer);
    colors = [
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    axisVertexColorBuffer.itemSize = 4;
    axisVertexColorBuffer.numItems = 6;
}

function webGL_main() {
    var canvas = document.getElementById('WebGL-canvas');

    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.950, 0.950, 0.950, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // onload, to get things running when users enter the website
    renderLoop_triangle();
}