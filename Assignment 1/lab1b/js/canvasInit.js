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
lightPos[1] = 0;
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
    else if (useShaderPD)
        return shaderPD;
    else if (useShaderPS)
        return shaderPS;
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
    var fragmentPhongDiffuse = getShader(gl, "pd-fragment");
    var fragmentPhongSpecular = getShader(gl, "ps-fragment");
    var vertexShader = getShader(gl, "vs-default");
    var vertexGouraudDiffuse = getShader(gl, "gd-vertex");
    var vertexGouraudSpecular = getShader(gl, "gs-vertex");
    var vertexPhong = getShader(gl, "phong-vertex");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    shaderGD = gl.createProgram();
    gl.attachShader(shaderGD, vertexGouraudDiffuse);
    gl.attachShader(shaderGD, fragmentShader);
    gl.linkProgram(shaderGD);

    if (!gl.getProgramParameter(shaderGD, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    shaderGS = gl.createProgram();
    gl.attachShader(shaderGS, vertexGouraudSpecular);
    gl.attachShader(shaderGS, fragmentShader);
    gl.linkProgram(shaderGS);

    if (!gl.getProgramParameter(shaderGS, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    shaderPD = gl.createProgram();
    gl.attachShader(shaderPD, vertexPhong);
    gl.attachShader(shaderPD, fragmentPhongDiffuse);
    gl.linkProgram(shaderPD);

    if (!gl.getProgramParameter(shaderPD, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    shaderPS = gl.createProgram();
    gl.attachShader(shaderPS, vertexPhong);
    gl.attachShader(shaderPS, fragmentPhongSpecular);
    gl.linkProgram(shaderPS);

    if (!gl.getProgramParameter(shaderPD, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gd_shader();
}

function setMatrixUniforms() {
    var ITmvMatrix = mat3.create();
    mat3.normalFromMat4(ITmvMatrix, mvMatrix);

    if (useShaderProgram) {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    } else if (useshaderGD) {
        gl.uniformMatrix3fv(shaderGD.itmvMatrixUniform, false, ITmvMatrix);
        gl.uniformMatrix4fv(shaderGD.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderGD.mvMatrixUniform, false, mvMatrix);
        gl.uniform3fv(shaderGD.lightPosUniform, lightPos);
    } else if (useShaderGS) {
        gl.uniformMatrix3fv(shaderGS.itmvMatrixUniform, false, ITmvMatrix);
        gl.uniformMatrix4fv(shaderGS.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderGS.mvMatrixUniform, false, mvMatrix);
        gl.uniform3fv(shaderGS.lightPosUniform, lightPos);
        gl.uniform3fv(shaderGS.camPosUniform, camPos);
    } else if (useShaderPD) {
        gl.uniformMatrix3fv(shaderPD.itmvMatrixUniform, false, ITmvMatrix);
        gl.uniformMatrix4fv(shaderPD.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderPD.mvMatrixUniform, false, mvMatrix);
        gl.uniform3fv(shaderPD.lightPosUniform, lightPos);
        gl.uniform3fv(shaderPD.camPosUniform, camPos);
    } else if (useShaderPS) {
        gl.uniformMatrix3fv(shaderPS.itmvMatrixUniform, false, ITmvMatrix);
        gl.uniformMatrix4fv(shaderPS.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderPS.mvMatrixUniform, false, mvMatrix);
        gl.uniform3fv(shaderPS.lightPosUniform, lightPos);
        gl.uniform3fv(shaderPS.camPosUniform, camPos);
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
        [1.0, 0.5, 0.5, 1.0]
    ];
    unpackedColors = [];

    for (i=0; i<sphereVertices.position.numElements; i++) {
        unpackedColors = unpackedColors.concat(colors[0]);
    }

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
    shaderGD.useLighting = gl.getUniformLocation(shaderGD, "uUseLighting");

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
    shaderGS.useLighting = gl.getUniformLocation(shaderGS, "uUseLighting");

    useShaderProgram = false;
    useshaderGD = false;
    useShaderGS = true;
    useShaderPD = false;
    useShaderPS = false;
}

function pd_shader() {
    gl.useProgram(shaderPD);

    shaderPD.vertexPositionAttribute = gl.getAttribLocation(shaderPD, "aVertexPosition");
    gl.enableVertexAttribArray(shaderPD.vertexPositionAttribute);

    shaderPD.vertexColorAttribute = gl.getAttribLocation(shaderPD, "aVertexColor");
    gl.enableVertexAttribArray(shaderPD.vertexColorAttribute);

    shaderPD.vertexNormalAttribute = gl.getAttribLocation(shaderPD, "aVertexNormal");
    gl.enableVertexAttribArray(shaderPD.vertexNormalAttribute);

    shaderPD.pMatrixUniform = gl.getUniformLocation(shaderPD, "uPMatrix");
    shaderPD.mvMatrixUniform = gl.getUniformLocation(shaderPD, "uMVMatrix");
    shaderPD.lightPosUniform = gl.getUniformLocation(shaderPD, "uLightPos");
    shaderPD.camPosUniform = gl.getUniformLocation(shaderPD, "uCamPos");
    shaderPD.itmvMatrixUniform = gl.getUniformLocation(shaderPD, "uMVInverseTransposeMatrix");
    shaderPD.useLighting = gl.getUniformLocation(shaderPD, "uUseLighting");

    useShaderProgram = false;
    useshaderGD = false;
    useShaderGS = false;
    useShaderPD = true;
    useShaderPS = false;
}

function ps_shader() {
    gl.useProgram(shaderPS);

    shaderPS.vertexPositionAttribute = gl.getAttribLocation(shaderPS, "aVertexPosition");
    gl.enableVertexAttribArray(shaderPS.vertexPositionAttribute);

    shaderPS.vertexColorAttribute = gl.getAttribLocation(shaderPS, "aVertexColor");
    gl.enableVertexAttribArray(shaderPS.vertexColorAttribute);

    shaderPS.vertexNormalAttribute = gl.getAttribLocation(shaderPS, "aVertexNormal");
    gl.enableVertexAttribArray(shaderPS.vertexNormalAttribute);

    shaderPS.pMatrixUniform = gl.getUniformLocation(shaderPS, "uPMatrix");
    shaderPS.mvMatrixUniform = gl.getUniformLocation(shaderPS, "uMVMatrix");
    shaderPS.lightPosUniform = gl.getUniformLocation(shaderPS, "uLightPos");
    shaderPS.camPosUniform = gl.getUniformLocation(shaderPS, "uCamPos");
    shaderPS.itmvMatrixUniform = gl.getUniformLocation(shaderPS, "uMVInverseTransposeMatrix");
    shaderPS.useLighting = gl.getUniformLocation(shaderPS, "uUseLighting");

    useShaderProgram = false;
    useshaderGD = false;
    useShaderGS = false;
    useShaderPD = false;
    useShaderPS = true;
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