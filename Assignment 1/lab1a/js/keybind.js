var keys = [];
var obj_selection;

document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
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
});

document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
});

function operate() {
    var i = keys['a'] ? 1:0;
    var j = keys['s'] ? 1:0;
    var k = keys['d'] ? 1:0;

    if (keys['-'])
        rotate_mini_tri();

    if (keys['.'])
        test_tr();
    console.log('(' + i + ', ' + j + ', ' + k + ')');
}