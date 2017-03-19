var map = [];
var obj_selection = []; // obj0 is the world CS, the rest are set according to the number of the cubes
obj_selection[0] = true; // set default value to world axes

var keydown_handler = function(e) {
    map[e.key] = true;
    if (e.key == '0' || e.key == '1' ||
        e.key == '2' || e.key == '3' ||
        e.key == '4' || e.key == '5' ||
        e.key == '6' || e.key == '7' ||
        e.key == '8' || e.key == '9' )
        change_selection(e.key);
    operate();
    /*switch (e.key) {
     case '0':
     break;
     case '1':
     break;
     case '2':
     break;
     case '3':
     break;
     case '4':
     break;
     case '5':
     break;
     case '6':
     break;
     case '7':
     break;
     case '8':
     break;
     case '9':
     break;
     case 'x':
     console.log('small');
     break;
     case 'X':
     console.log('big');
     break;
     case 'y':
     break;
     case 'Y':
     break;
     case 'z':
     break;
     case 'Z':
     break;
     case 'w':
     break;
     case 's':
     break;
     case 'e':
     break;
     case 'q':
     break;
     case 'd':
     break;
     case 'a':
     break;
     case 'ArrowRight':
     break;
     case 'ArrowLeft':
     break;
     case 'ArrowUp':
     break;
     case 'ArrowDown':
     break;
     case ',':
     break;
     case '.':
     break;
     case '-':
     rotate_mini_tri();
     break;
     default:
     console.log(e.key);
     }*/
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
        for (i=1; i<=9; i++)
            obj_selection[i] = false;
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
    var i = map['a'] ? 1:0;
    var j = map['s'] ? 1:0;
    var k = map['d'] ? 1:0;

    if (map['w'] || map['s'] || map['e'] ||
        map['q'] || map['d'] || map['a'])
        rotate_shapes();

    if (map['.'])
        test_tr();
}