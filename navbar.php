 <div class="page-container topbar-menu">
    <div class="d-flex align-items-center gap-2">
        <a href="index.html" class="logo">
            <span class="logo-light">
                <span class="logo-lg"><img src="./assets/images/logo.png" alt="logo"></span>
                <span class="logo-sm"><img src="./assets/images/logo-sm.png" alt="small logo"></span>
            </span>

            <span class="logo-dark">
                <span class="logo-lg"><img src="./assets/images/logo-dark.png" alt="dark logo"></span>
                <span class="logo-sm"><img src="./assets/images/logo-sm.png" alt="small logo"></span>
            </span>
        </a>

        <button class="sidenav-toggle-button btn btn-secondary btn-icon">
            <i class="ti ti-menu-deep fs-24"></i>
        </button>

        <button class="topnav-toggle-button" data-bs-toggle="collapse" data-bs-target="#topnav-menu-content">
            <i class="ti ti-menu-deep fs-22"></i>
        </button>

        <div class="topbar-search text-muted d-none d-xl-flex gap-2 align-items-center" data-bs-toggle="modal" data-bs-target="#searchModal" type="button">
            <i class="ti ti-search fs-18"></i>
            <span class="me-2">Search something..</span>
            <button type="submit" class="ms-auto btn btn-sm btn-primary shadow-none">⌘K</span>
        </div>
        <!--Pages Dropdown
        <div class="topbar-item d-none d-md-flex">
            <div class="dropdown">
                <a href="" class="topbar-link btn btn-link px-2 dropdown-toggle drop-arrow-none fw-medium" data-bs-toggle="dropdown" data-bs-trigger="hover" data-bs-offset="0,24" aria-haspopup="false" aria-expanded="false">
                    Pages <i class="ti ti-chevron-down ms-1"></i>
                </a>

                <div class="dropdown-menu dropdown-menu-xxl p-0">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <div class="p-3">
                                <h5 class="mb-2 fw-semibold">UI Components</h5>
                                <ul class="list-unstyled megamenu-list">
                                    <li>
                                        <a href="#!">Widgets</a>
                                    </li>
                                    <li>
                                        <a href="extended-dragula.html">Dragula</a>
                                    </li>
                                    <li>
                                        <a href="ui-dropdowns.html">Dropdowns</a>
                                    </li>
                                    <li>
                                        <a href="extended-ratings.html">Ratings</a>
                                    </li>
                                    <li>
                                        <a href="extended-sweetalerts.html">Sweet Alerts</a>
                                    </li>
                                    <li>
                                        <a href="extended-scrollbar.html">Scrollbar</a>
                                    </li>
                                    <li>
                                        <a href="form-range-slider.html">Range Slider</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="p-3">
                                <h5 class="mb-2 fw-semibold">Applications</h5>
                                <ul class="list-unstyled megamenu-list">
                                    <li>
                                        <a href="apps-ecommerce-products.html">eCommerce Pages</a>
                                    </li>
                                    <li>
                                        <a href="#!">Hospital</a>
                                    </li>
                                    <li>
                                        <a href="apps-email.html">Email</a>
                                    </li>
                                    <li>
                                        <a href="apps-calendar.html">Calendar</a>
                                    </li>
                                    <li>
                                        <a href="#!">Kanban Board</a>
                                    </li>
                                    <li>
                                        <a href="apps-invoices.html">Invoice Management</a>
                                    </li>
                                    <li>
                                        <a href="pages-pricing.html">Pricing</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-md-4 bg-light bg-opacity-50">
                            <div class="p-3">
                                <h5 class="mb-2 fw-semibold">Extra Pages</h5>
                                <ul class="list-unstyled megamenu-list">
                                    <li>
                                        <a href="javascript:void(0);">Left Sidebar with User</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);">Menu Collapsed</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);">Small Left Sidebar</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);">New Header Style</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);">My Account</a>
                                    </li>
                                    <li>
                                        <a href="pages-coming-soon.html">Maintenance & Coming Soon</a>
                                    </li>
                                </ul>
                            </div> 
                        </div> 
                    </div> 
                </div> 
            </div> 
        </div>--> 
    </div>

    <div class="d-flex align-items-center gap-2">
        <div class="topbar-item d-flex d-xl-none">
            <button class="topbar-link btn btn-outline-primary btn-icon" data-bs-toggle="modal" data-bs-target="#searchModal" type="button">
                <i class="ti ti-search fs-22"></i>
            </button>
        </div>

        <!-- Language
        <div class="topbar-item">
            <div class="dropdown">
                <button class="topbar-link btn btn-outline-primary btn-icon" data-bs-toggle="dropdown" data-bs-offset="0,24" type="button" aria-haspopup="false" aria-expanded="false">
                    <img src="./assets/images/flags/us.svg" alt="user-image" class="w-100 rounded" height="18" id="selected-language-image">
                </button>

                <div class="dropdown-menu dropdown-menu-end">
                    <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="en">
                        <img src="./assets/images/flags/us.svg" alt="user-image" class="me-1 rounded" height="18" data-translator-image> <span class="align-middle">English</span>
                    </a>
                    <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="hi">
                        <img src="./assets/images/flags/in.svg" alt="user-image" class="me-1 rounded" height="18" data-translator-image> <span class="align-middle">Hindi</span>
                    </a>
                    <a href="javascript:void(0);" class="dropdown-item">
                        <img src="./assets/images/flags/de.svg" alt="user-image" class="me-1 rounded" height="18"> <span class="align-middle">German</span>
                    </a>
                    <a href="javascript:void(0);" class="dropdown-item">
                        <img src="./assets/images/flags/it.svg" alt="user-image" class="me-1 rounded" height="18"> <span class="align-middle">Italian</span>
                    </a>
                    <a href="javascript:void(0);" class="dropdown-item">
                        <img src="./assets/images/flags/es.svg" alt="user-image" class="me-1 rounded" height="18"> <span class="align-middle">Spanish</span>
                    </a>
                    <a href="javascript:void(0);" class="dropdown-item">
                        <img src="./assets/images/flags/ru.svg" alt="user-image" class="me-1 rounded" height="18"> <span class="align-middle">Russian</span>
                    </a>

                </div>
            </div>
        </div>-->

        <div class="topbar-item">
            <div class="dropdown">
                <button class="topbar-link btn btn-outline-primary btn-icon dropdown-toggle drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,24" type="button" data-bs-auto-close="outside" aria-haspopup="false" aria-expanded="false">
                    <i class="ti ti-bell animate-ring fs-22"></i>
                    <span class="noti-icon-badge"></span>
                </button>

                <div class="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg" style="min-height: 300px;">
                    <div class="p-3 border-bottom border-dashed">
                        <div class="row align-items-center">
                            <div class="col">
                                <h6 class="m-0 fs-16 fw-semibold"> Notifications</h6>
                            </div>
                            <div class="col-auto">
                                <div class="dropdown">
                                    <a href="#" class="dropdown-toggle drop-arrow-none link-dark" data-bs-toggle="dropdown" data-bs-offset="0,15" aria-expanded="false">
                                        <i class="ti ti-settings fs-22 align-middle"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <a href="javascript:void(0);" class="dropdown-item">Mark as Read</a>
                                        <a href="javascript:void(0);" class="dropdown-item">Delete All</a>
                                        <a href="javascript:void(0);" class="dropdown-item">Do not Disturb</a>
                                        <a href="javascript:void(0);" class="dropdown-item">Other Settings</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="position-relative z-2 rounded-0" style="max-height: 300px;" data-simplebar>
                        <!-- item-->
                        <div class="dropdown-item notification-item py-2 text-wrap active" id="notification-1">
                            <span class="d-flex align-items-center">
                                <span class="me-3 position-relative flex-shrink-0">
                                    <img src="./assets/images/users/avatar-2.jpg" class="avatar-md rounded-circle" alt="" />
                                    <span class="position-absolute rounded-pill bg-danger notification-badge">
                                        <i class="ti ti-message-circle"></i>
                                        <span class="visually-hidden">unread messages</span>
                                    </span>
                                </span>
                                <span class="flex-grow-1 text-muted">
                                    <span class="fw-medium text-body">Glady Haid</span> commented on <span class="fw-medium text-body">paces admin status</span>
                                    <br />
                                    <span class="fs-12">25m ago</span>
                                </span>
                                <span class="notification-item-close">
                                    <button type="button" class="btn btn-ghost-danger rounded-circle btn-sm btn-icon" data-dismissible="#notification-1">
                                        <i class="ti ti-x fs-16"></i>
                                    </button>
                                </span>
                            </span>
                        </div>

                        <!-- item-->
                        <div class="dropdown-item notification-item py-2 text-wrap" id="notification-2">
                            <span class="d-flex align-items-center">
                                <span class="me-3 position-relative flex-shrink-0">
                                    <img src="./assets/images/users/avatar-4.jpg" class="avatar-md rounded-circle" alt="" />
                                    <span class="position-absolute rounded-pill bg-info notification-badge">
                                        <i class="ti ti-currency-dollar"></i>
                                        <span class="visually-hidden">unread messages</span>
                                    </span>
                                </span>
                                <span class="flex-grow-1 text-muted">
                                    <span class="fw-medium text-body">Tommy Berry</span> donated <span class="text-success">$100.00</span> for <span class="fw-medium text-body">Carbon removal program</span>
                                    <br />
                                    <span class="fs-12">58m ago</span>
                                </span>
                                <span class="notification-item-close">
                                    <button type="button" class="btn btn-ghost-danger rounded-circle btn-sm btn-icon" data-dismissible="#notification-2">
                                        <i class="ti ti-x fs-16"></i>
                                    </button>
                                </span>
                            </span>
                        </div>

                        <!-- item-->
                        <div class="dropdown-item notification-item py-2 text-wrap" id="notification-3">
                            <span class="d-flex align-items-center">
                                <div class="avatar-md flex-shrink-0 me-3">
                                    <span class="avatar-title bg-success-subtle text-success rounded-circle fs-22">
                                        <iconify-icon icon="solar:wallet-money-bold-duotone"></iconify-icon>
                                    </span>
                                </div>
                                <span class="flex-grow-1 text-muted">
                                    You withdraw a <span class="fw-medium text-body">$500</span> by <span class="fw-medium text-body">New York ATM</span>
                                    <br />
                                    <span class="fs-12">2h ago</span>
                                </span>
                                <span class="notification-item-close">
                                    <button type="button" class="btn btn-ghost-danger rounded-circle btn-sm btn-icon" data-dismissible="#notification-3">
                                        <i class="ti ti-x fs-16"></i>
                                    </button>
                                </span>
                            </span>
                        </div>

                        <!-- item-->
                        <div class="dropdown-item notification-item py-2 text-wrap" id="notification-4">
                            <span class="d-flex align-items-center">
                                <span class="me-3 position-relative flex-shrink-0">
                                    <img src="./assets/images/users/avatar-7.jpg" class="avatar-md rounded-circle" alt="" />
                                    <span class="position-absolute rounded-pill bg-secondary notification-badge">
                                        <i class="ti ti-plus"></i>
                                        <span class="visually-hidden">unread messages</span>
                                    </span>
                                </span>
                                <span class="flex-grow-1 text-muted">
                                    <span class="fw-medium text-body">Richard Allen</span> followed you in <span class="fw-medium text-body">Facebook</span>
                                    <br />
                                    <span class="fs-12">3h ago</span>
                                </span>
                                <span class="notification-item-close">
                                    <button type="button" class="btn btn-ghost-danger rounded-circle btn-sm btn-icon" data-dismissible="#notification-4">
                                        <i class="ti ti-x fs-16"></i>
                                    </button>
                                </span>
                            </span>
                        </div>

                        <!-- item-->
                        <div class="dropdown-item notification-item py-2 text-wrap" id="notification-5">
                            <span class="d-flex align-items-center">
                                <span class="me-3 position-relative flex-shrink-0">
                                    <img src="./assets/images/users/avatar-10.jpg" class="avatar-md rounded-circle" alt="" />
                                    <span class="position-absolute rounded-pill bg-danger notification-badge">
                                        <i class="ti ti-heart-filled"></i>
                                        <span class="visually-hidden">unread messages</span>
                                    </span>
                                </span>
                                <span class="flex-grow-1 text-muted">
                                    <span class="fw-medium text-body">Victor Collier</span> liked you recent photo in <span class="fw-medium text-body">Instagram</span>
                                    <br />
                                    <span class="fs-12">10h ago</span>
                                </span>
                                <span class="notification-item-close">
                                    <button type="button" class="btn btn-ghost-danger rounded-circle btn-sm btn-icon" data-dismissible="#notification-5">
                                        <i class="ti ti-x fs-16"></i>
                                    </button>
                                </span>
                            </span>
                        </div>
                    </div>

                    <!-- All-->
                    <a href="javascript:void(0);" class="dropdown-item notification-item text-center text-reset text-decoration-underline link-offset-2 fw-bold notify-item border-top border-light py-2">
                        View All
                    </a>
                </div>
            </div>
        </div>

        <!-- Apps Dropdown -->
        <div class="topbar-item d-none d-sm-flex">
            <div class="dropdown">
                <button class="topbar-link btn btn-outline-primary btn-icon dropdown-toggle drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,24" type="button" aria-haspopup="false" aria-expanded="false">
                    <i class="ti ti-apps fs-22"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-end dropdown-menu-lg p-0">
                    <div class="p-2">
                        <div class="row g-0">
                            <div class="col">
                                <a class="dropdown-icon-item" href="#">
                                    <img src="./assets/images/brands/slack.svg" alt="slack">
                                    <span>Slack</span>
                                </a>
                            </div>
                            <div class="col">
                                <a class="dropdown-icon-item" href="#">
                                    <img src="./assets/images/brands/gitlab.svg" alt="Github">
                                    <span>Gitlab</span>
                                </a>
                            </div>
                            <div class="col">
                                <a class="dropdown-icon-item" href="#">
                                    <img src="./assets/images/brands/dribbble.svg" alt="dribbble">
                                    <span>Dribbble</span>
                                </a>
                            </div>
                        </div>

                        <div class="row g-0">
                            <div class="col">
                                <a class="dropdown-icon-item" href="#">
                                    <img src="./assets/images/brands/bitbucket.svg" alt="bitbucket">
                                    <span>Bitbucket</span>
                                </a>
                            </div>
                            <div class="col">
                                <a class="dropdown-icon-item" href="#">
                                    <img src="./assets/images/brands/dropbox.svg" alt="dropbox">
                                    <span>Dropbox</span>
                                </a>
                            </div>
                            <div class="col">
                                <a class="dropdown-icon-item" href="#">
                                    <img src="./assets/images/brands/google-cloud.svg" alt="G Suite">
                                    <span>G Cloud</span>
                                </a>
                            </div>
                        </div> <!-- end row-->

                        <div class="row g-0">
                            <div class="col">
                                <a class="dropdown-icon-item" href="#">
                                    <img src="./assets/images/brands/aws.svg" alt="bitbucket">
                                    <span>AWS</span>
                                </a>
                            </div>
                            <div class="col">
                                <a class="dropdown-icon-item" href="#">
                                    <img src="./assets/images/brands/digital-ocean.svg" alt="dropbox">
                                    <span>Server</span>
                                </a>
                            </div>
                            <div class="col">
                                <a class="dropdown-icon-item" href="#">
                                    <img src="./assets/images/brands/bootstrap.svg" alt="G Suite">
                                    <span>Bootstrap</span>
                                </a>
                            </div>
                        </div> <!-- end row-->
                    </div>
                </div>
            </div>
        </div>

        <!-- Button Trigger Customizer Offcanvas -->
        <div class="topbar-item d-none d-sm-flex">
            <button class="topbar-link btn btn-outline-primary btn-icon" data-bs-toggle="offcanvas" data-bs-target="#theme-settings-offcanvas" type="button">
                <i class="ti ti-settings fs-22"></i>
            </button>
        </div>

        <!-- Light/Dark Mode Button -->
        <div class="topbar-item d-none d-sm-flex">
            <button class="topbar-link btn btn-outline-primary btn-icon" id="light-dark-mode" type="button">
                <i class="ti ti-moon fs-22"></i>
            </button>
        </div>

        <!-- User Dropdown -->
        <div class="topbar-item">
            <div class="dropdown">
                <a class="topbar-link btn btn-outline-primary dropdown-toggle drop-arrow-none" data-bs-toggle="dropdown" data-bs-offset="0,22" type="button" aria-haspopup="false" aria-expanded="false">
                    <img src="./assets/images/users/avatar-1.jpg" width="24" class="rounded-circle me-lg-2 d-flex" alt="user-image">
                    <span class="d-lg-flex flex-column gap-1 d-none">
                        <?php echo $_SESSION['session_nombre'];?>
                    </span>
                    <i class="ti ti-chevron-down d-none d-lg-block align-middle ms-2"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-end">
                    <div class="dropdown-header noti-title">
                        <h6 class="text-overflow m-0">Bienvenido !</h6>
                    </div>
                    <a href="javascript:void(0);" class="dropdown-item">
                        <i class="ti ti-user-hexagon me-1 fs-17 align-middle"></i>
                        <span class="align-middle">Mi cuenta</span>
                    </a>
                    <a href="javascript:void(0);" class="dropdown-item">
                        <i class="ti ti-settings me-1 fs-17 align-middle"></i>
                        <span class="align-middle">Settings</span>
                    </a>

                    <div class="dropdown-divider"></div>

                    <a href="javascript:void(0);" class="dropdown-item active fw-semibold text-danger" id="logout-btn">
                        <i class="ti ti-logout me-1 fs-17 align-middle"></i>
                        <span class="align-middle">Salir</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>