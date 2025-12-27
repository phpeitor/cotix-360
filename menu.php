<div class="sidenav-menu">
    <a href="index.php" class="logo">
        <span class="logo-light">
            <span class="logo-lg"><img src="./assets/images/logo.png" alt="logo"></span>
            <span class="logo-sm text-center"><img src="./assets/images/logo-sm.png" alt="small logo"></span>
        </span>

        <span class="logo-dark">
            <span class="logo-lg"><img src="./assets/images/logo-dark.png" alt="dark logo"></span>
            <span class="logo-sm text-center"><img src="./assets/images/logo-sm.png" alt="small logo"></span>
        </span>
    </a>

    <button class="button-sm-hover">
        <i class="ti ti-circle align-middle"></i>
    </button>

    <button class="button-close-fullsidebar">
        <i class="ti ti-x align-middle"></i>
    </button>

    <div data-simplebar>
        <ul class="side-nav">

            <li class="side-nav-item">
                <a href="home.php" class="side-nav-link">
                    <span class="menu-icon"><i class="ti ti-dashboard"></i></span>
                    <span class="menu-text"> Dashboard </span>
                </a>
            </li>

            <li class="side-nav-title mt-2">Users & Items</li>

            <li class="side-nav-item">
                <a href="usuarios.php" class="side-nav-link">
                    <span class="menu-icon"><i class="ti ti-user"></i></span>
                    <span class="menu-text"> Usuarios </span>
                </a>
            </li>

            <li class="side-nav-item">
                <a data-bs-toggle="collapse" href="#sidebarEcommerce" aria-expanded="false" aria-controls="sidebarEcommerce" class="side-nav-link">
                    <span class="menu-icon"><i class="ti ti-basket-filled"></i></span>
                    <span class="menu-text"> Items </span>
                    <span class="menu-arrow"></span>
                </a>
                <div class="collapse" id="sidebarEcommerce">
                    <ul class="sub-menu">
                        <li class="side-nav-item">
                            <a href="cargar_items.php" class="side-nav-link">
                                <span class="menu-text">Cargar</span>
                            </a>
                        </li>
                        <li class="side-nav-item">
                            <a href="items.php" class="side-nav-link">
                                <span class="menu-text">Lista</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>

            <li class="side-nav-title mt-2">Cotiza Templates</li>

            <li class="side-nav-item">
                <a data-bs-toggle="collapse" href="#sidebarExtendedUI" aria-expanded="false" aria-controls="sidebarExtendedUI" class="side-nav-link">
                    <span class="menu-icon"><i class="ti ti-box-multiple-3"></i></span>
                    <span class="menu-text"> Templates X </span>
                    <span class="menu-arrow"></span>
                </a>
                <div class="collapse" id="sidebarExtendedUI">
                    <ul class="sub-menu">
                        <li class="side-nav-item">
                            <a href="calculo.php" class="side-nav-link">
                                <span class="menu-text">Plantilla de Cálculo</span>
                            </a>
                        </li>
                        <li class="side-nav-item">
                            <a href="cotizaciones.php" class="side-nav-link">
                                <span class="menu-text">Cotizaciones</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
        <div class="clearfix"></div>
    </div>
</div>
