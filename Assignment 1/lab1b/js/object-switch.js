function switch_to_triangle() {
	var tri_menu = document.getElementById('tri-menu');
	var three_d_menu = document.getElementById('3d-menu');
    var tri_menu_mobile = document.getElementById('tri-menu-mobile');
    var three_d_menu_mobile = document.getElementById('3d-menu-mobile');

    tri_menu.className = 'active';
	three_d_menu.className = '';
    tri_menu_mobile.className = 'active';
    three_d_menu_mobile.className = '';

	document.getElementById('tri-infotab').style.display = '';
    document.getElementById('3d-infotab').style.display = 'none';

	renderLoop_triangle();
	unbindKey();
}

function switch_to_3d() {
	var tri_menu = document.getElementById('tri-menu');
	var three_d_menu = document.getElementById('3d-menu');
    var tri_menu_mobile = document.getElementById('tri-menu-mobile');
    var three_d_menu_mobile = document.getElementById('3d-menu-mobile');

    tri_menu.className = '';
	three_d_menu.className = 'active';
    tri_menu_mobile.className = '';
    three_d_menu_mobile.className = 'active';

    document.getElementById('tri-infotab').style.display = 'none';
    document.getElementById('3d-infotab').style.display = '';

	triangle_stop();
	drawScene_3d();
	bindKey();
}