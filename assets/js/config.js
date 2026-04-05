! function() {
	var t = sessionStorage.getItem("__BORON_CONFIG__"),
		e = document.getElementsByTagName("html")[0],
		i = {
			theme: "light",
			nav: "vertical",
			layout: {
				mode: "fluid"
			},
			topbar: {
				color: "light"
			},
			menu: {
				color: "dark"
			},
			sidenav: {
				size: "default",
				user: !1
			}
		},
		n = (this.html = document.getElementsByTagName("html")[0], config = Object.assign(JSON.parse(JSON.stringify(i)), {}), this.html.getAttribute("data-bs-theme")),
		n = (config.theme = null !== n ? n : i.theme, this.html.getAttribute("data-layout")),
		n = (config.nav = null !== n ? "topnav" === n ? "horizontal" : "vertical" : i.nav, this.html.getAttribute("data-layout-mode")),
		n = (config.layout.mode = null !== n ? n : i.layout.mode, this.html.getAttribute("data-topbar-color")),
		n = (config.topbar.color = null != n ? n : i.topbar.color, this.html.getAttribute("data-sidenav-size")),
		n = (config.sidenav.size = null !== n ? n : i.sidenav.size, this.html.getAttribute("data-sidenav-user")),
		n = (config.sidenav.user = null !== n || i.sidenav.user, this.html.getAttribute("data-menu-color"));
	if (config.menu.color = null !== n ? n : i.menu.color, window.defaultConfig = JSON.parse(JSON.stringify(config)), null !== t && (config = JSON.parse(t)), window.config = config) {
		if ("vertical" == config.nav) {
			let t = config.sidenav.size;
			window.innerWidth <= 767 ? t = "full" : 767 <= window.innerWidth && window.innerWidth <= 1140 && "full" !== self.config.sidenav.size && "fullscreen" !== self.config.sidenav.size && (t = "condensed"), e.setAttribute("data-sidenav-size", t), config.sidenav.user && "true" === config.sidenav.user.toString() ? e.setAttribute("data-sidenav-user", !0) : e.removeAttribute("data-sidenav-user")
		}
		e.setAttribute("data-bs-theme", config.theme), e.setAttribute("data-menu-color", config.menu.color), e.setAttribute("data-topbar-color", config.topbar.color), e.setAttribute("data-layout-mode", config.layout.mode)
	}

	window.PERMISOS_STATE = window.PERMISOS_STATE || {
		esAdmin: !1,
		cargo: 0,
		permisos: []
	};

	window.getPermisosState = window.getPermisosState || function() {
		if (window.__PERMISOS_PROMISE__) return window.__PERMISOS_PROMISE__;

		window.__PERMISOS_PROMISE__ = fetch("config/permisos-js.php")
			.then(r => r.json())
			.then(data => {
				const permisos = Array.isArray(data.permisos) ? data.permisos : [];
				const rol = Array.isArray(data.rol) ? data.rol : [];

				window.PERMISOS_STATE = {
					esAdmin: permisos[0] === "*",
					cargo: rol[0] ?? 0,
					permisos
				};

				return window.PERMISOS_STATE;
			})
			.catch(err => {
				console.error("Permisos:", err);
				return window.PERMISOS_STATE;
			});

		return window.__PERMISOS_PROMISE__;
	};

    document.addEventListener("DOMContentLoaded", function () {
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
			logoutBtn.addEventListener("click", function (e) {
				e.preventDefault();
				alertify.confirm("Cerrar sesión", "¿Seguro que deseas salir?",
				function() {
					window.location.href = "controller/logout.php";
				},
				function() {
					alertify.message("Cancelado");
				}
				);
			});
        }

		window.getPermisosState()
		.then(({ permisos, esAdmin }) => {

			/* ===============================
			* 1. ITEMS SIMPLES + SUBITEMS
			* =============================== */
			document
			.querySelectorAll('.side-nav a[href]:not([data-bs-toggle])')
			.forEach(a => {

				const url = a.getAttribute('href').split('/').pop();

				if (!esAdmin && !permisos.includes(url)) {
					a.closest('li')?.remove();
				}
			});

			/* ===============================
			* 2. PADRES (COLAPSABLES)
			* =============================== */
			document
			.querySelectorAll('.side-nav-item > a[data-bs-toggle]')
			.forEach(parentLink => {

				const parentLi = parentLink.closest('.side-nav-item');
				const subLinks = parentLi.querySelectorAll('.sub-menu a[href]');

				const tieneAlgunPermiso = [...subLinks].some(a => {
					const url = a.getAttribute('href').split('/').pop();
					return esAdmin || permisos.includes(url);
				});

				if (!tieneAlgunPermiso) {
					parentLi?.remove();
				}
			});

			/* ===============================
			* 3. TITULOS SIN ITEMS
			* =============================== */
			document.querySelectorAll('.side-nav > li.side-nav-title').forEach(title => {
				let sibling = title.nextElementSibling;
				let tieneItemsEnSeccion = false;

				while (sibling && !sibling.classList.contains('side-nav-title')) {
					if (sibling.classList.contains('side-nav-item')) {
						tieneItemsEnSeccion = true;
						break;
					}
					sibling = sibling.nextElementSibling;
				}

				if (!tieneItemsEnSeccion) {
					title.remove();
				}
			});

			/* ===============================
			* 4. ISADMIN 
			* =============================== */
			if (!esAdmin) {
				document
					.querySelectorAll('td.isadmin, div.isadmin, h5.isadmin')
					.forEach(el => {
						el.style.display = 'none';
					});
			}

		})
		.catch(err => console.error('Permisos:', err));

    });
}();