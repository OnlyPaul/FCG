function switch_to_triangle() {
	var tri_menu = document.getElementById('tri-menu');
	var three_d_menu = document.getElementById('3d-menu');

    tri_menu.className = 'active';
	three_d_menu.className = '';

	document.getElementById('tri-infotab').style.display = '';
    document.getElementById('3d-infotab').style.display = 'none';

	renderLoop_triangle();
}

function switch_to_3d() {
	var tri_menu = document.getElementById('tri-menu');
	var three_d_menu = document.getElementById('3d-menu');

    tri_menu.className = '';
	three_d_menu.className = 'active';

    document.getElementById('tri-infotab').style.display = 'none';
    document.getElementById('3d-infotab').style.display = '';

	triangle_stop();
	drawScene_3d(test);
}