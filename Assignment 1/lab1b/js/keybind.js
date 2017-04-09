var map = [];
var obj_selection = []; // obj0 is the world CS, the rest are set according to the number of the cubes
obj_selection[0] = true; // set default value to world axes

var keydown_handler = function(e) {
    map[e.key] = true;
    if (e.key == '0' || e.key == '1' ||
        e.key == '2' || e.key == '3' ||
        e.key == '4' || e.key == '5' ||
        e.key == '6' || e.key == '7' ||
        e.key == '8' || e.key == '9' ||
        e.key == 'l'
    )
        change_selection(e.key);
    operate();
};

var keyup_handler = function(e) {
    map[e.key] = false;
};

function bindKey() {
    document.addEventListener('keydown', keydown_handler);
    document.addEventListener('keyup', keyup_handler);
}

function unbindKey() {
    document.removeEventListener('keydown', keydown_handler);
    document.removeEventListener('keyup', keyup_handler);
}

function change_selection(key) {
    var isSelected = false;

    if (key==0) {
        obj_selection[0] = true;
        for (i=1; i<=10; i++)
            obj_selection[i] = false;
    } else if (key=='l') {
        // obj_selection[10] is for the light source
        if (obj_selection[10]) {
            obj_selection[0] = true;
            obj_selection[10] = false;
        } else {
            for (i=0; i<=9; i++)
                obj_selection[i] = false;
            obj_selection[10] = true;
        }
    } else if (!obj_selection[key]) {
        obj_selection[0] = false;
        obj_selection[key] = true;
    } else {
        // if the key is selected, disable it
        obj_selection[key] = false;
        // then check if there's other selected figures
        for (i=1; i<=9; i++) {
            if (obj_selection[i]) {
                isSelected = true;
                break;
            }
        }
        // if nothing is selected, do back to world coordinates
        if (!isSelected)
            obj_selection[0] = true;
    }

    drawScene_3d();
}

function operate() {
    if (map['w'] || map['s'] || map['e'] ||
        map['q'] || map['d'] || map['a'])
        rotate_shapes();

    if (map['ArrowRight'] || map['ArrowLeft'] || map['ArrowUp'] ||
        map['ArrowDown'] || map[','] || map['.'])
        translate_shapes();

    if (map['x'] || map['X'] || map['y'] ||
        map['Y'] || map['z'] || map['Z'])
        scale_shapes();

    if (map['u']) {
        gd_shader();
        drawScene_3d();
    }

    if (map['i']) {
        gs_shader();
        drawScene_3d();
    }

    // if (map['o']) {
    //     pd_shader();
    //     drawScene_3d();
    // }
    //
    // if (map['p']) {
    //     ps_shader();
    //     drawScene_3d();
    // }
}