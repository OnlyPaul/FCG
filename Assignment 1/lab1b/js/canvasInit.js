/*
 *  DECLARING GLOBAL VARIABLES
 ------------------------------------------------- */
var gl;
var shaderProgram;
var shaderGD;
var shaderGS;
var shaderPD;
var shaderPS;

// boolean show which program is active
var useShaderProgram;
var useshaderGD;
var useShaderGS;
var useShaderPD;
var useShaderPS;

// model/view and projection matrix related
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

// buffer for the sphere
var sphereVertices;
var sphereVertexPositionBuffer;
var sphereVertexNormalBuffer;
var sphereVertexColorBuffer;
var sphereVertexIndexBuffer;

// buffer for the overlaying axes
var axisVertexPositionBuffer;
var axisVertexColorBuffer;

// light position
var lightPos = vec3.create();
lightPos[0] = 0;
lightPos[1] = 10;
lightPos[2] = 0;

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

function programInUse() {
    if (useShaderProgram)
        return shaderProgram;
    else if (useshaderGD)
        return shaderGD;
    else if (useShaderGS)
        return shaderGS;
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
    var vertexGouraudDiffuse = getShader(gl, "gd-vertex");
    var vertexGouraudSpecular = getShader(gl, "gs-vertex");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    shaderGD = gl.createProgram();
    gl.attachShader(shaderGD, vertexGouraudDiffuse);
    gl.attachShader(shaderGD, fragmentShader);
    gl.linkProgram(shaderGD);

    shaderGS = gl.createProgram();
    gl.attachShader(shaderGS, vertexGouraudSpecular);
    gl.attachShader(shaderGS, fragmentShader);
    gl.linkProgram(shaderGS);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    if (!gl.getProgramParameter(shaderGD, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    if (!gl.getProgramParameter(shaderGS, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gd_shader();
}

function setMatrixUniforms() {
    if (useShaderProgram) {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    } else if (useshaderGD) {
        var ITmvMatrix = mat3.create();
        mat3.normalFromMat4(ITmvMatrix, mvMatrix);

        gl.uniformMatrix3fv(shaderGD.itmvMatrixUniform, false, ITmvMatrix);
        gl.uniformMatrix4fv(shaderGD.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderGD.mvMatrixUniform, false, mvMatrix);
        gl.uniform3fv(shaderGD.lightPosUniform, lightPos);
    } else if (useShaderGS) {
        var ITmvMatrix = mat3.create();
        mat3.normalFromMat4(ITmvMatrix, mvMatrix);

        gl.uniformMatrix3fv(shaderGS.itmvMatrixUniform, false, ITmvMatrix);
        gl.uniformMatrix4fv(shaderGS.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderGS.mvMatrixUniform, false, mvMatrix);
        gl.uniform3fv(shaderGS.lightPosUniform, lightPos);
        gl.uniform3fv(shaderGS.camPosUniform, camPos);
    }
}

function initBuffers() {
    var vertices = [];
    var colors = [];

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


    // create and bind sphere buffer
    sphereVertices = Sphere.createSphereVertices(0.2, 24, 24);

    colors = [
        [0.996, 0.410, 0.379, 1.0],
        [1.0, 0.5, 0.5, 1.0],
        [1.0, 1.0, 0.988, 1.0],
        [0.988, 0.988, 0.586, 1.0],
        [0.793, 0.598, 0.785, 1.0],
        [0.680, 0.773, 0.809, 1.0]
    ];
    unpackedColors = [];

    for (i=0; i<sphereVertices.position.numElements; i++) {
        color = colors[i%6];
        unpackedColors = unpackedColors.concat(color);
    }

    // colors = [
    //     [1.0, 0.5, 0.5, 1.0]
    // ];
    // unpackedColors = [];
    //
    // for (i=0; i<sphereVertices.position.numElements; i++) {
    //     unpackedColors = unpackedColors.concat(colors[0]);
    // }

    sphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphereVertices.position, gl.STATIC_DRAW);
    sphereVertexPositionBuffer.itemSize = 3;
    sphereVertexPositionBuffer.numItems = sphereVertices.position.numElements;

    sphereVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
    sphereVertexColorBuffer.itemSize = 4;
    sphereVertexPositionBuffer.numItems = sphereVertices.position.numElements;

    sphereVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphereVertices.normal, gl.STATIC_DRAW);
    sphereVertexNormalBuffer.itemSize = 3;
    sphereVertexPositionBuffer.numItems = sphereVertices.normal.numElements;

    sphereVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphereVertices.indices, gl.STATIC_DRAW);
    sphereVertexIndexBuffer.itemSize = 1;
    sphereVertexIndexBuffer.numItems = sphereVertices.indices.length;
}

function webGL_main() {
    var canvas = document.getElementById('WebGL-canvas');

    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.950, 0.950, 0.950, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // onload, to get things running when users enter the website
    drawScene_3d(shaderProgram);
    bindKey();
}

/*
 * SHADER SWITCHING
 -------------------------------------------------- */

function gd_shader() {
    gl.useProgram(shaderGD);

    shaderGD.vertexPositionAttribute = gl.getAttribLocation(shaderGD, "aVertexPosition");
    gl.enableVertexAttribArray(shaderGD.vertexPositionAttribute);

    shaderGD.vertexColorAttribute = gl.getAttribLocation(shaderGD, "aVertexColor");
    gl.enableVertexAttribArray(shaderGD.vertexColorAttribute);

    shaderGD.vertexNormalAttribute = gl.getAttribLocation(shaderGD, "aVertexNormal");
    gl.enableVertexAttribArray(shaderGD.vertexNormalAttribute);

    shaderGD.pMatrixUniform = gl.getUniformLocation(shaderGD, "uPMatrix");
    shaderGD.mvMatrixUniform = gl.getUniformLocation(shaderGD, "uMVMatrix");
    shaderGD.lightPosUniform = gl.getUniformLocation(shaderGD, "uLightPos");
    shaderGD.itmvMatrixUniform = gl.getUniformLocation(shaderGD, "uMVInverseTransposeMatrix");

    useShaderProgram = false;
    useshaderGD = true;
    useShaderGS = false;
    useShaderPD = false;
    useShaderPS = false;
}

function gs_shader() {
    gl.useProgram(shaderGS);

    shaderGS.vertexPositionAttribute = gl.getAttribLocation(shaderGS, "aVertexPosition");
    gl.enableVertexAttribArray(shaderGS.vertexPositionAttribute);

    shaderGS.vertexColorAttribute = gl.getAttribLocation(shaderGS, "aVertexColor");
    gl.enableVertexAttribArray(shaderGS.vertexColorAttribute);

    shaderGS.vertexNormalAttribute = gl.getAttribLocation(shaderGS, "aVertexNormal");
    gl.enableVertexAttribArray(shaderGS.vertexNormalAttribute);

    shaderGS.pMatrixUniform = gl.getUniformLocation(shaderGS, "uPMatrix");
    shaderGS.mvMatrixUniform = gl.getUniformLocation(shaderGS, "uMVMatrix");
    shaderGS.lightPosUniform = gl.getUniformLocation(shaderGS, "uLightPos");
    shaderGS.camPosUniform = gl.getUniformLocation(shaderGS, "uCamPos");
    shaderGS.itmvMatrixUniform = gl.getUniformLocation(shaderGS, "uMVInverseTransposeMatrix");

    useShaderProgram = false;
    useshaderGD = false;
    useShaderGS = true;
    useShaderPD = false;
    useShaderPS = false;
}

function nolight_shader() {
    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    useShaderProgram = true;
    useshaderGD = false;
    useShaderGS = false;
    useShaderPD = false;
    useShaderPS = false;
}