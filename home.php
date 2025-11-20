<?php
  require_once __DIR__ . "/controller/check_session.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Dashboard | Cotix360 Admin Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="A fully featured admin theme which can be used to build CRM, CMS, etc." name="description" />
    <meta content="Coderthemes" name="author" />
    <link rel="shortcut icon" href="./assets/images/favicon.ico">
    <script src="./assets/js/config.js"></script>
    <link href="./assets/css/vendor.min.css" rel="stylesheet" type="text/css" />
    <link href="./assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />
    <link href="./assets/css/icons.min.css" rel="stylesheet" type="text/css" />
</head>

<body>
    <div class="wrapper">
        <div class="sidenav-menu">
            <a href="index.html" class="logo">
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
                        <a href="index.html" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-dashboard"></i></span>
                            <span class="menu-text"> Dashboard </span>
                            <span class="badge bg-success rounded-pill">5</span>
                        </a>
                    </li>

                    <li class="side-nav-title mt-2">Apps & Pages</li>

                    <li class="side-nav-item">
                        <a href="apps-chat.html" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-message-filled"></i></span>
                            <span class="menu-text"> Chat </span>
                        </a>
                    </li>

                    <li class="side-nav-item">
                        <a href="apps-calendar.html" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-calendar-filled"></i></span>
                            <span class="menu-text"> Calendar </span>
                        </a>
                    </li>

                    <li class="side-nav-item">
                        <a href="apps-email.html" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-inbox"></i></span>
                            <span class="menu-text"> Email </span>
                        </a>
                    </li>

                    <li class="side-nav-item">
                        <a href="apps-file-manager.html" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-folder-filled"></i></span>
                            <span class="menu-text"> File Manager </span>
                        </a>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarEcommerce" aria-expanded="false" aria-controls="sidebarEcommerce" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-basket-filled"></i></span>
                            <span class="menu-text"> Ecommerce </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarEcommerce">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="apps-ecommerce-products.html" class="side-nav-link">
                                        <span class="menu-text">Products</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="apps-ecommerce-products-grid.html" class="side-nav-link">
                                        <span class="menu-text">Products Grid</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="apps-ecommerce-product-details.html" class="side-nav-link">
                                        <span class="menu-text">Product Details</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="apps-ecommerce-products-add.html" class="side-nav-link">
                                        <span class="menu-text">Add Products</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="apps-ecommerce-categories.html" class="side-nav-link">
                                        <span class="menu-text">Categories</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="apps-ecommerce-orders.html" class="side-nav-link">
                                        <span class="menu-text">Orders</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="apps-ecommerce-order-details.html" class="side-nav-link">
                                        <span class="menu-text">Order Details</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="apps-ecommerce-customers.html" class="side-nav-link">
                                        <span class="menu-text">Customers</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="apps-ecommerce-sellers.html" class="side-nav-link">
                                        <span class="menu-text">Sellers</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarInvoice" aria-expanded="false" aria-controls="sidebarInvoice" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-file-invoice"></i></span>
                            <span class="menu-text"> Invoice</span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarInvoice">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="apps-invoices.html" class="side-nav-link">
                                        <span class="menu-text">Invoices</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="apps-invoice-details.html" class="side-nav-link">
                                        <span class="menu-text">View Invoice</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="apps-invoice-create.html" class="side-nav-link">
                                        <span class="menu-text">Create Invoice</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarPages" aria-expanded="false" aria-controls="sidebarPages" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-files"></i></span>
                            <span class="menu-text"> Pages </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarPages">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="pages-starter.html" class="side-nav-link">
                                        <span class="menu-text">Starter Page</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="pages-faq.html" class="side-nav-link">
                                        <span class="menu-text">FAQ</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="pages-maintenance.html" class="side-nav-link">
                                        <span class="menu-text">Maintenance</span>
                                    </a>
                                </li>                      
                                <li class="side-nav-item">
                                    <a href="pages-timeline.html" class="side-nav-link">
                                        <span class="menu-text">Timeline</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="pages-coming-soon.html" class="side-nav-link">
                                        <span class="menu-text">Coming Soon</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="pages-pricing.html" class="side-nav-link">
                                        <span class="menu-text">Pricing</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="pages-terms-conditions.html" class="side-nav-link">
                                        <span class="menu-text">Terms & Conditions</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarPagesAuth" aria-expanded="false" aria-controls="sidebarPagesAuth" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-lock-filled"></i></span>
                            <span class="menu-text"> Auth Pages </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarPagesAuth">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="auth-login.html" class="side-nav-link">
                                        <span class="menu-text">Login</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="auth-register.html" class="side-nav-link">
                                        <span class="menu-text">Register</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="auth-logout.html" class="side-nav-link">
                                        <span class="menu-text">Logout</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="auth-recoverpw.html" class="side-nav-link">
                                        <span class="menu-text">Recover Password</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="auth-createpw.html" class="side-nav-link">
                                        <span class="menu-text">Create Password</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="auth-lock-screen.html" class="side-nav-link">
                                        <span class="menu-text">Lock Screen</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="auth-confirm-mail.html" class="side-nav-link">
                                        <span class="menu-text">Confirm Mail</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="auth-login-pin.html" class="side-nav-link">
                                        <span class="menu-text">Login with PIN</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="auth-2fa.html" class="side-nav-link">
                                        <span class="menu-text">2FA</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="auth-account-deactivation.html" class="side-nav-link">
                                        <span class="menu-text">Account Deactivation</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarPagesError" aria-expanded="false" aria-controls="sidebarPagesError" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-server-2"></i></span>
                            <span class="menu-text"> Error Pages </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarPagesError">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="error-401.html" class="side-nav-link">
                                        <span class="menu-text">401 Unauthorized</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="error-400.html" class="side-nav-link">
                                        <span class="menu-text">400 Bad Request</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="error-403.html" class="side-nav-link">
                                        <span class="menu-text">403 Forbidden</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="error-404.html" class="side-nav-link">
                                        <span class="menu-text">404 Not Found</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="error-408.html" class="side-nav-link">
                                        <span class="menu-text">408 Request Timeout</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="error-500.html" class="side-nav-link">
                                        <span class="menu-text">500 Internal Server</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="error-501.html" class="side-nav-link">
                                        <span class="menu-text">501 Not Implemented</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="error-502.html" class="side-nav-link">
                                        <span class="menu-text">502 Service Overloaded</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="error-service-unavailable.html" class="side-nav-link">
                                        <span class="menu-text">Service Unavailable</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="error-404-alt.html" class="side-nav-link">
                                        <span class="menu-text">Error 404 Alt</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-title mt-2">Components</li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarBaseUI" aria-expanded="false" aria-controls="sidebarBaseUI" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-brightness-filled"></i></span>
                            <span class="menu-text"> Base UI </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarBaseUI">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="ui-accordions.html" class="side-nav-link">
                                        <span class="menu-text">Accordions</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-alerts.html" class="side-nav-link">
                                        <span class="menu-text">Alerts</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-avatars.html" class="side-nav-link">
                                        <span class="menu-text">Avatars</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-badges.html" class="side-nav-link">
                                        <span class="menu-text">Badges</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-breadcrumb.html" class="side-nav-link">
                                        <span class="menu-text">Breadcrumb</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-buttons.html" class="side-nav-link">
                                        <span class="menu-text">Buttons</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-cards.html" class="side-nav-link">
                                        <span class="menu-text">Cards</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-carousel.html" class="side-nav-link">
                                        <span class="menu-text">Carousel</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-collapse.html" class="side-nav-link">
                                        <span class="menu-text">Collapse</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-dropdowns.html" class="side-nav-link">
                                        <span class="menu-text">Dropdowns</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-ratios.html" class="side-nav-link">
                                        <span class="menu-text">Ratios</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-grid.html" class="side-nav-link">
                                        <span class="menu-text">Grid</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-links.html" class="side-nav-link">
                                        <span class="menu-text">Links</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-list-group.html" class="side-nav-link">
                                        <span class="menu-text">List Group</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-modals.html" class="side-nav-link">
                                        <span class="menu-text">Modals</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-notifications.html" class="side-nav-link">
                                        <span class="menu-text">Notifications</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-offcanvas.html" class="side-nav-link">
                                        <span class="menu-text">Offcanvas</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-placeholders.html" class="side-nav-link">
                                        <span class="menu-text">Placeholders</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-pagination.html" class="side-nav-link">
                                        <span class="menu-text">Pagination</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-popovers.html" class="side-nav-link">
                                        <span class="menu-text">Popovers</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-progress.html" class="side-nav-link">
                                        <span class="menu-text">Progress</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-scrollspy.html" class="side-nav-link">
                                        <span class="menu-text">Scrollspy</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-spinners.html" class="side-nav-link">
                                        <span class="menu-text">Spinners</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-tabs.html" class="side-nav-link">
                                        <span class="menu-text">Tabs</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-tooltips.html" class="side-nav-link">
                                        <span class="menu-text">Tooltips</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-typography.html" class="side-nav-link">
                                        <span class="menu-text">Typography</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="ui-utilities.html" class="side-nav-link">
                                        <span class="menu-text">Utilities</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarExtendedUI" aria-expanded="false" aria-controls="sidebarExtendedUI" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-alien-filled"></i></span>
                            <span class="menu-text"> Extended UI </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarExtendedUI">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="extended-dragula.html" class="side-nav-link">
                                        <span class="menu-text">Dragula</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="extended-sweetalerts.html" class="side-nav-link">
                                        <span class="menu-text">Sweet Alerts</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="extended-ratings.html" class="side-nav-link">
                                        <span class="menu-text">Ratings</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="extended-scrollbar.html" class="side-nav-link">
                                        <span class="menu-text">Scrollbar</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarIcons" aria-expanded="false" aria-controls="sidebarIcons" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-leaf"></i></span>
                            <span class="menu-text"> Icons </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarIcons">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="icons-tabler.html" class="side-nav-link">
                                        <span class="menu-text">Tabler</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="icons-solar.html" class="side-nav-link">
                                        <span class="menu-text">Solar</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarCharts" aria-expanded="false" aria-controls="sidebarCharts" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-chart-arcs"></i></span>
                            <span class="menu-text"> Charts </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarCharts">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="charts-apex-area.html" class="side-nav-link">
                                        <span class="menu-text">Area</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-bar.html" class="side-nav-link">
                                        <span class="menu-text">Bar</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-bubble.html" class="side-nav-link">
                                        <span class="menu-text">Bubble</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-candlestick.html" class="side-nav-link">
                                        <span class="menu-text">Candlestick</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-column.html" class="side-nav-link">
                                        <span class="menu-text">Column</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-heatmap.html" class="side-nav-link">
                                        <span class="menu-text">Heatmap</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-line.html" class="side-nav-link">
                                        <span class="menu-text">Line</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-mixed.html" class="side-nav-link">
                                        <span class="menu-text">Mixed</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-timeline.html" class="side-nav-link">
                                        <span class="menu-text">Timeline</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-boxplot.html" class="side-nav-link">
                                        <span class="menu-text">Boxplot</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-treemap.html" class="side-nav-link">
                                        <span class="menu-text">Treemap</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-pie.html" class="side-nav-link">
                                        <span class="menu-text">Pie</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-radar.html" class="side-nav-link">
                                        <span class="menu-text">Radar</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-radialbar.html" class="side-nav-link">
                                        <span class="menu-text">RadialBar</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-scatter.html" class="side-nav-link">
                                        <span class="menu-text">Scatter</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-polar-area.html" class="side-nav-link">
                                        <span class="menu-text">Polar Area</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="charts-apex-sparklines.html" class="side-nav-link">
                                        <span class="menu-text">Sparklines</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarForms" aria-expanded="false" aria-controls="sidebarForms" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-forms"></i></span>
                            <span class="menu-text"> Forms </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarForms">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="form-elements.html" class="side-nav-link">
                                        <span class="menu-text">Basic Elements</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="form-inputmask.html" class="side-nav-link">
                                        <span class="menu-text">Inputmask</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="form-picker.html" class="side-nav-link">
                                        <span class="menu-text">Picker</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="form-select.html" class="side-nav-link">
                                        <span class="menu-text">Select</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="form-range-slider.html" class="side-nav-link">
                                        <span class="menu-text">Range Slider</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="form-validation.html" class="side-nav-link">
                                        <span class="menu-text">Validation</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="form-wizard.html" class="side-nav-link">
                                        <span class="menu-text">Wizard</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="form-fileuploads.html" class="side-nav-link">
                                        <span class="menu-text">File Uploads</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="form-editors.html" class="side-nav-link">
                                        <span class="menu-text">Editors</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="form-layouts.html" class="side-nav-link">
                                        <span class="menu-text">Layouts</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarTables" aria-expanded="false" aria-controls="sidebarTables" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-table-filled"></i></span>
                            <span class="menu-text"> Tables </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarTables">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="tables-basic.html" class="side-nav-link">
                                        <span class="menu-text">Basic Tables</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="tables-gridjs.html" class="side-nav-link">
                                        <span class="menu-text">Gridjs Tables</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarMaps" aria-expanded="false" aria-controls="sidebarMaps" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-map-pin-filled"></i></span>
                            <span class="menu-text"> Maps </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarMaps">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a href="maps-google.html" class="side-nav-link">
                                        <span class="menu-text">Google Maps</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="maps-vector.html" class="side-nav-link">
                                        <span class="menu-text">Vector Maps</span>
                                    </a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="maps-leaflet.html" class="side-nav-link">
                                        <span class="menu-text">Leaflet Maps</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-title mt-2">
                        More
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarLayouts" aria-expanded="false" aria-controls="sidebarLayouts" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-layout-filled"></i></span>
                            <span class="menu-text"> Layouts </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarLayouts">
                            <ul class="sub-menu">                        
                                <li class="side-nav-item">
                                    <a href="layouts-horizontal.html" target="_blank" class="side-nav-link">Horizontal</a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="layouts-full.html" target="_blank" class="side-nav-link">Full View</a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="layouts-fullscreen.html" target="_blank" class="side-nav-link">Fullscreen View</a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="layouts-hover.html" target="_blank" class="side-nav-link">Hover Menu</a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="layouts-compact.html" target="_blank" class="side-nav-link">Compact</a>
                                </li>
                                <li class="side-nav-item">
                                    <a href="layouts-icon-view.html" target="_blank" class="side-nav-link">Icon View</a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="side-nav-item">
                        <a data-bs-toggle="collapse" href="#sidebarMultiLevel" aria-expanded="false" aria-controls="sidebarMultiLevel" class="side-nav-link">
                            <span class="menu-icon"><i class="ti ti-box-multiple-3"></i></span>
                            <span class="menu-text"> Multi Level </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="sidebarMultiLevel">
                            <ul class="sub-menu">
                                <li class="side-nav-item">
                                    <a data-bs-toggle="collapse" href="#sidebarSecondLevel" aria-expanded="false" aria-controls="sidebarSecondLevel" class="side-nav-link">
                                        <span class="menu-text"> Second Level </span>
                                        <span class="menu-arrow"></span>
                                    </a>
                                    <div class="collapse" id="sidebarSecondLevel">
                                        <ul class="sub-menu">
                                            <li class="side-nav-item">
                                                <a href="javascript: void(0);" class="side-nav-link">
                                                    <span class="menu-text">Item 1</span>
                                                </a>
                                            </li>
                                            <li class="side-nav-item">
                                                <a href="javascript: void(0);" class="side-nav-link">
                                                    <span class="menu-text">Item 2</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li class="side-nav-item">
                                    <a data-bs-toggle="collapse" href="#sidebarThirdLevel" aria-expanded="false" aria-controls="sidebarThirdLevel" class="side-nav-link">
                                        <span class="menu-text"> Third Level </span>
                                        <span class="menu-arrow"></span>
                                    </a>
                                    <div class="collapse" id="sidebarThirdLevel">
                                        <ul class="sub-menu">
                                            <li class="side-nav-item">
                                                <a href="javascript: void(0);" class="side-nav-link">Item 1</a>
                                            </li>
                                            <li class="side-nav-item">
                                                <a data-bs-toggle="collapse" href="#sidebarFourthLevel" aria-expanded="false" aria-controls="sidebarFourthLevel" class="side-nav-link">
                                                    <span class="menu-text"> Item 2 </span>
                                                    <span class="menu-arrow"></span>
                                                </a>
                                                <div class="collapse" id="sidebarFourthLevel">
                                                    <ul class="sub-menu">
                                                        <li class="side-nav-item">
                                                            <a href="javascript: void(0);" class="side-nav-link">
                                                                <span class="menu-text">Item 2.1</span>
                                                            </a>
                                                        </li>
                                                        <li class="side-nav-item">
                                                            <a href="javascript: void(0);" class="side-nav-link">
                                                                <span class="menu-text">Item 2.2</span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>

                <div class="clearfix"></div>
            </div>
        </div>
        <!-- Sidenav Menu End -->
        

        <!-- Topbar Start -->
        <header class="app-topbar">
            <div class="page-container topbar-menu">
                <div class="d-flex align-items-center gap-2">

                    <!-- Brand Logo -->
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

                    <!-- Sidebar Menu Toggle Button -->
                    <button class="sidenav-toggle-button btn btn-secondary btn-icon">
                        <i class="ti ti-menu-deep fs-24"></i>
                    </button>

                    <!-- Horizontal Menu Toggle Button -->
                    <button class="topnav-toggle-button" data-bs-toggle="collapse" data-bs-target="#topnav-menu-content">
                        <i class="ti ti-menu-deep fs-22"></i>
                    </button>

                    <!-- Button Trigger Search Modal -->
                    <div class="topbar-search text-muted d-none d-xl-flex gap-2 align-items-center" data-bs-toggle="modal" data-bs-target="#searchModal" type="button">
                        <i class="ti ti-search fs-18"></i>
                        <span class="me-2">Search something..</span>
                        <button type="submit" class="ms-auto btn btn-sm btn-primary shadow-none">⌘K</span>
                    </div>

                    <!-- Mega Menu Dropdown -->
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
                                        </div> <!-- end .bg-light-->
                                    </div> <!-- end col-->
                                </div> <!-- end row-->
                            </div> <!-- .dropdown-menu-->
                        </div> <!-- .dropdown-->
                    </div> <!-- end topbar-item -->
                </div>

                <div class="d-flex align-items-center gap-2">

                    <!-- Search for small devices -->
                    <div class="topbar-item d-flex d-xl-none">
                        <button class="topbar-link btn btn-outline-primary btn-icon" data-bs-toggle="modal" data-bs-target="#searchModal" type="button">
                            <i class="ti ti-search fs-22"></i>
                        </button>
                    </div>

                    <!-- Language Dropdown -->
                    <div class="topbar-item">
                        <div class="dropdown">
                            <button class="topbar-link btn btn-outline-primary btn-icon" data-bs-toggle="dropdown" data-bs-offset="0,24" type="button" aria-haspopup="false" aria-expanded="false">
                                <img src="./assets/images/flags/us.svg" alt="user-image" class="w-100 rounded" height="18" id="selected-language-image">
                            </button>

                            <div class="dropdown-menu dropdown-menu-end">
                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="en">
                                    <img src="./assets/images/flags/us.svg" alt="user-image" class="me-1 rounded" height="18" data-translator-image> <span class="align-middle">English</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item" data-translator-lang="hi">
                                    <img src="./assets/images/flags/in.svg" alt="user-image" class="me-1 rounded" height="18" data-translator-image> <span class="align-middle">Hindi</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item">
                                    <img src="./assets/images/flags/de.svg" alt="user-image" class="me-1 rounded" height="18"> <span class="align-middle">German</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item">
                                    <img src="./assets/images/flags/it.svg" alt="user-image" class="me-1 rounded" height="18"> <span class="align-middle">Italian</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item">
                                    <img src="./assets/images/flags/es.svg" alt="user-image" class="me-1 rounded" height="18"> <span class="align-middle">Spanish</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item">
                                    <img src="./assets/images/flags/ru.svg" alt="user-image" class="me-1 rounded" height="18"> <span class="align-middle">Russian</span>
                                </a>

                            </div>
                        </div>
                    </div>

                    <!-- Notification Dropdown -->
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
                                                    <!-- item-->
                                                    <a href="javascript:void(0);" class="dropdown-item">Mark as Read</a>
                                                    <!-- item-->
                                                    <a href="javascript:void(0);" class="dropdown-item">Delete All</a>
                                                    <!-- item-->
                                                    <a href="javascript:void(0);" class="dropdown-item">Do not Disturb</a>
                                                    <!-- item-->
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
                                    Dhanoo K.
                                </span>
                                <i class="ti ti-chevron-down d-none d-lg-block align-middle ms-2"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <!-- item-->
                                <div class="dropdown-header noti-title">
                                    <h6 class="text-overflow m-0">Welcome !</h6>
                                </div>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item">
                                    <i class="ti ti-user-hexagon me-1 fs-17 align-middle"></i>
                                    <span class="align-middle">My Account</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item">
                                    <i class="ti ti-wallet me-1 fs-17 align-middle"></i>
                                    <span class="align-middle">Wallet : <span class="fw-semibold">$985.25</span></span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item">
                                    <i class="ti ti-settings me-1 fs-17 align-middle"></i>
                                    <span class="align-middle">Settings</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item">
                                    <i class="ti ti-lifebuoy me-1 fs-17 align-middle"></i>
                                    <span class="align-middle">Support</span>
                                </a>

                                <div class="dropdown-divider"></div>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item">
                                    <i class="ti ti-lock-square-rounded me-1 fs-17 align-middle"></i>
                                    <span class="align-middle">Lock Screen</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item active fw-semibold text-danger">
                                    <i class="ti ti-logout me-1 fs-17 align-middle"></i>
                                    <span class="align-middle">Sign Out</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <!-- Topbar End -->

        <!-- Search Modal -->
        <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-transparent">
                    <div class="card mb-0 shadow-none">
                        <div class="px-3 py-2 d-flex flex-row align-items-center" id="top-search">
                            <i class="ti ti-search fs-22"></i>
                            <input type="search" class="form-control border-0" id="search-modal-input" placeholder="Search for actions, people,">
                            <button type="button" class="btn p-0" data-bs-dismiss="modal" aria-label="Close">[esc]</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================================== -->
        <!-- Start Page Content here -->
        <!-- ============================================================== -->
        <div class="page-content">
            <div class="page-container">

                <div class="row">
                    <div class="col-12">
                        <div class="page-title-head d-flex align-items-sm-center flex-sm-row flex-column">
                            <div class="flex-grow-1">
                                <h4 class="fs-18 text-uppercase fw-bold m-0">Dashboard</h4>
                            </div>
                            <div class="mt-3 mt-sm-0">
                                <form action="javascript:void(0);">
                                    <div class="row g-2 mb-0 align-items-center">
                                        <div class="col-auto">
                                            <a href="javascript: void(0);" class="btn btn-outline-primary">
                                                <i class="ti ti-sort-ascending me-1"></i> Sort By
                                            </a>
                                        </div>
                                        <!--end col-->
                                        <div class="col-sm-auto">
                                            <div class="input-group">
                                                <input type="text" class="form-control" data-provider="flatpickr" data-deafult-date="01 May to 31 May" data-date-format="d M" data-range-date="true">
                                                <span class="input-group-text bg-primary border-primary text-white">
                                                    <i class="ti ti-calendar fs-15"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <!--end col-->
                                    </div>
                                    <!--end row-->
                                </form>
                            </div>
                        </div><!-- end card header -->
                    </div>
                    <!--end col-->
                </div> <!-- end row-->

                <div class="row">
                    <div class="col">
                        <div class="row row-cols-xxl-4 row-cols-md-2 row-cols-1 text-center">
                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Number of Orders">Total Orders</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:case-round-minimalistic-bold-duotone"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 class="mb-0 fw-bold">687.3k</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="text-danger me-2"><i class="ti ti-caret-down-filled"></i> 9.19%</span>
                                            <span class="text-nowrap">Since last month</span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Number of Orders">Total Returns</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:bill-list-bold-duotone"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 class="mb-0 fw-bold">9.62k</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="text-success me-2"><i class="ti ti-caret-up-filled"></i> 26.87%</span>
                                            <span class="text-nowrap">Since last month</span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Number of Orders">Avg. Sales Earnings</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:wallet-money-bold-duotone"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 class="mb-0 fw-bold">$98.24 <small class="text-muted">USD</small></h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="text-success me-2"><i class="ti ti-caret-up-filled"></i> 3.51%</span>
                                            <span class="text-nowrap">Since last month</span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="text-muted fs-13 text-uppercase" title="Number of Orders">Number of Visits</h5>
                                        <div class="d-flex align-items-center justify-content-center gap-2 my-2 py-1">
                                            <div class="user-img fs-42 flex-shrink-0">
                                                <span class="avatar-title text-bg-primary rounded-circle fs-22">
                                                    <iconify-icon icon="solar:eye-bold-duotone"></iconify-icon>
                                                </span>
                                            </div>
                                            <h3 class="mb-0 fw-bold">87.94M</h3>
                                        </div>
                                        <p class="mb-0 text-muted">
                                            <span class="text-danger me-2"><i class="ti ti-caret-down-filled"></i> 1.05%</span>
                                            <span class="text-nowrap">Since last month</span>
                                        </p>
                                    </div>
                                </div>
                            </div><!-- end col -->
                        </div><!-- end row -->

                        <div class="row">
                            <div class="col-xxl-4">
                                <div class="card">
                                    <div class="card-header d-flex justify-content-between align-items-center border-bottom border-dashed">
                                        <h4 class="header-title">Top Traffic by Source</h4>
                                        <div class="dropdown">
                                            <a href="#" class="dropdown-toggle drop-arrow-none card-drop p-0" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="ti ti-dots-vertical"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end">
                                                <a href="javascript:void(0);" class="dropdown-item">Refresh Report</a>
                                                <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="card-body">
                                        <div id="multiple-radialbar" class="apex-charts" data-colors="#6ac75a,#313a46,#ce7e7e,#669776"></div>

                                        <div class="row mt-2">
                                            <div class="col">
                                                <div class="d-flex justify-content-between align-items-center p-1">
                                                    <div>
                                                        <i class="ti ti-circle-filled fs-12 align-middle me-1 text-primary"></i>
                                                        <span class="align-middle fw-semibold">Direct</span>
                                                    </div>
                                                    <span class="fw-semibold text-muted float-end"><i class="ti ti-arrow-badge-down text-danger"></i> 965</span>
                                                </div>

                                                <div class="d-flex justify-content-between align-items-center p-1">
                                                    <div>
                                                        <i class="ti ti-circle-filled fs-12 text-success align-middle me-1"></i>
                                                        <span class="align-middle fw-semibold">Social</span>
                                                    </div>
                                                    <span class="fw-semibold text-muted float-end"><i class="ti ti-arrow-badge-up text-success"></i> 75</span>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="d-flex justify-content-between align-items-center p-1">
                                                    <div>
                                                        <i class="ti ti-circle-filled fs-12 text-secondary align-middle me-1"></i>
                                                        <span class="align-middle fw-semibold"> Marketing</span>
                                                    </div>
                                                    <span class="fw-semibold text-muted float-end"><i class="ti ti-arrow-badge-up text-success"></i> 102</span>
                                                </div>

                                                <div class="d-flex justify-content-between align-items-center p-1">
                                                    <div>
                                                        <i class="ti ti-circle-filled fs-12 text-danger align-middle me-1"></i>
                                                        <span class="align-middle fw-semibold">Affiliates</span>
                                                    </div>
                                                    <span class="fw-semibold text-muted float-end"><i class="ti ti-arrow-badge-down text-danger"></i> 96</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> <!-- end card-->
                            </div> <!-- end col-->

                            <div class="col-xxl-8">
                                <div class="card">
                                    <div class="card-header d-flex justify-content-between align-items-center">
                                        <h4 class="header-title">Overview</h4>
                                        <div class="dropdown">
                                            <a href="#" class="dropdown-toggle drop-arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="ti ti-dots-vertical"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end">
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Sales Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Profit</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Action</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="bg-danger bg-opacity-10">
                                        <div class="row text-center">
                                            <div class="col-md-3 col-6">
                                                <p class="text-muted mt-3 mb-1">Revenue</p>
                                                <h4 class="mb-3">
                                                    <span class="ti ti-square-rounded-arrow-down text-success me-1"></span>
                                                    <span>$29.5k</span>
                                                </h4>
                                            </div>
                                            <div class="col-md-3 col-6">
                                                <p class="text-muted mt-3 mb-1">Expenses</p>
                                                <h4 class="mb-3">
                                                    <span class="ti ti-square-rounded-arrow-up text-danger me-1"></span>
                                                    <span>$15.07k</span>
                                                </h4>
                                            </div>
                                            <div class="col-md-3 col-6">
                                                <p class="text-muted mt-3 mb-1">Investment</p>
                                                <h4 class="mb-3">
                                                    <span class="ti ti-chart-infographic me-1"></span>
                                                    <span>$3.6k</span>
                                                </h4>
                                            </div>
                                            <div class="col-md-3 col-6">
                                                <p class="text-muted mt-3 mb-1">Savings</p>
                                                <h4 class="mb-3">
                                                    <span class="ti ti-pig me-1"></span>
                                                    <span>$6.9k</span>
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="card-body pt-0">
                                        <div dir="ltr">
                                            <div id="revenue-chart" class="apex-charts" data-colors="#6ac75a,#313a46,#ce7e7e,#669776"></div>
                                        </div>
                                    </div>
                                </div> <!-- end card-->
                            </div> <!-- end col-->
                        </div> <!-- end row-->

                        <div class="row">
                            <div class="col-xxl-6">
                                <div class="card">
                                    <div class="d-flex card-header justify-content-between align-items-center">
                                        <h4 class="header-title">Brands Listing</h4>
                                        <a href="javascript:void(0);" class="btn btn-sm btn-secondary">Add Brand <i class="ti ti-plus ms-1"></i></a>
                                    </div>
                                    <div class="card-body p-0">
                                        <div class="bg-success bg-opacity-10 py-1 text-center">
                                            <p class="m-0"><b>69</b> Active brands out of <span class="fw-medium">102</span></p>
                                        </div>
                                        <div class="table-responsive">
                                            <table class="table table-custom table-centered table-sm table-nowrap table-hover mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-center">
                                                                <div class="avatar-md flex-shrink-0 me-2">
                                                                    <span class="avatar-title bg-primary-subtle rounded-circle">
                                                                        <img src="./assets/images/products/logo/logo-1.svg" alt="" height="22">
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span class="text-muted fs-12">Clothing</span> <br />
                                                                    <h5 class="fs-14 mt-1">Zaroan - Brazil</h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Established</span>
                                                            <h5 class="fs-14 mt-1 fw-normal">Since 2020</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Stores</span> <br />
                                                            <h5 class="fs-14 mt-1 fw-normal">1.5k</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Products</span>
                                                            <h5 class="fs-14 mt-1 fw-normal">8,950</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Status</span>
                                                            <h5 class="fs-14 mt-1 fw-normal"><i class="ti ti-circle-filled fs-12 text-success"></i> Active</h5>
                                                        </td>
                                                        <td style="width: 30px;">
                                                            <div class="dropdown">
                                                                <a href="#" class="dropdown-toggle text-muted drop-arrow-none card-drop p-0" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i class="ti ti-dots-vertical"></i>
                                                                </a>
                                                                <div class="dropdown-menu dropdown-menu-end">
                                                                    <a href="javascript:void(0);" class="dropdown-item">Refresh Report</a>
                                                                    <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-center">
                                                                <div class="avatar-md flex-shrink-0 me-2">
                                                                    <span class="avatar-title bg-info-subtle rounded-circle">
                                                                        <img src="./assets/images/products/logo/logo-4.svg" alt="" height="22">
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span class="text-muted fs-12">Clothing</span> <br />
                                                                    <h5 class="fs-14 mt-1">Jocky-Johns - USA</h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Established</span>
                                                            <h5 class="fs-14 mt-1 fw-normal">Since 1985</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Stores</span> <br />
                                                            <h5 class="fs-14 mt-1 fw-normal">205</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Products</span>
                                                            <h5 class="fs-14 mt-1 fw-normal">1,258</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Status</span>
                                                            <h5 class="fs-14 mt-1 fw-normal"><i class="ti ti-circle-filled fs-12 text-success"></i> Active</h5>
                                                        </td>
                                                        <td style="width: 30px;">
                                                            <div class="dropdown">
                                                                <a href="#" class="dropdown-toggle text-muted drop-arrow-none card-drop p-0" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i class="ti ti-dots-vertical"></i>
                                                                </a>
                                                                <div class="dropdown-menu dropdown-menu-end">
                                                                    <a href="javascript:void(0);" class="dropdown-item">Refresh Report</a>
                                                                    <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-center">
                                                                <div class="avatar-md flex-shrink-0 me-2">
                                                                    <span class="avatar-title bg-secondary-subtle rounded-circle">
                                                                        <img src="./assets/images/products/logo/logo-5.svg" alt="" height="22">
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span class="text-muted fs-12">Lifestyle</span> <br />
                                                                    <h5 class="fs-14 mt-1">Ginne - India</h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Established</span>
                                                            <h5 class="fs-14 mt-1 fw-normal">Since 2001</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Stores</span> <br />
                                                            <h5 class="fs-14 mt-1 fw-normal">89</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Products</span>
                                                            <h5 class="fs-14 mt-1 fw-normal">338</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Status</span>
                                                            <h5 class="fs-14 mt-1 fw-normal"><i class="ti ti-circle-filled fs-12 text-success"></i> Active</h5>
                                                        </td>
                                                        <td style="width: 30px;">
                                                            <div class="dropdown">
                                                                <a href="#" class="dropdown-toggle text-muted drop-arrow-none card-drop p-0" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i class="ti ti-dots-vertical"></i>
                                                                </a>
                                                                <div class="dropdown-menu dropdown-menu-end">
                                                                    <a href="javascript:void(0);" class="dropdown-item">Refresh Report</a>
                                                                    <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-center">
                                                                <div class="avatar-md flex-shrink-0 me-2">
                                                                    <span class="avatar-title bg-danger-subtle rounded-circle">
                                                                        <img src="./assets/images/products/logo/logo-6.svg" alt="" height="22">
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span class="text-muted fs-12">Fashion</span> <br />
                                                                    <h5 class="fs-14 mt-1">DDoen - Brazil</h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Established</span>
                                                            <h5 class="fs-14 mt-1 fw-normal">Since 1995</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Stores</span> <br />
                                                            <h5 class="fs-14 mt-1 fw-normal">650</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Products</span>
                                                            <h5 class="fs-14 mt-1 fw-normal">6,842</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Status</span>
                                                            <h5 class="fs-14 mt-1 fw-normal"><i class="ti ti-circle-filled fs-12 text-success"></i> Active</h5>
                                                        </td>
                                                        <td style="width: 30px;">
                                                            <div class="dropdown">
                                                                <a href="#" class="dropdown-toggle text-muted drop-arrow-none card-drop p-0" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i class="ti ti-dots-vertical"></i>
                                                                </a>
                                                                <div class="dropdown-menu dropdown-menu-end">
                                                                    <a href="javascript:void(0);" class="dropdown-item">Refresh Report</a>
                                                                    <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <div class="d-flex align-items-center">
                                                                <div class="avatar-md flex-shrink-0 me-2">
                                                                    <span class="avatar-title bg-primary-subtle rounded-circle">
                                                                        <img src="./assets/images/products/logo/logo-8.svg" alt="" height="22">
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span class="text-muted fs-12">Manufacturing</span> <br />
                                                                    <h5 class="fs-14 mt-1">Zoddiak - Canada</h5>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Established</span>
                                                            <h5 class="fs-14 mt-1 fw-normal">Since 1963</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Stores</span> <br />
                                                            <h5 class="fs-14 mt-1 fw-normal">109</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Products</span>
                                                            <h5 class="fs-14 mt-1 fw-normal">952</h5>
                                                        </td>
                                                        <td>
                                                            <span class="text-muted fs-12">Status</span>
                                                            <h5 class="fs-14 mt-1 fw-normal"><i class="ti ti-circle-filled fs-12 text-success"></i> Active</h5>
                                                        </td>
                                                        <td style="width: 30px;">
                                                            <div class="dropdown">
                                                                <a href="#" class="dropdown-toggle text-muted drop-arrow-none card-drop p-0" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i class="ti ti-dots-vertical"></i>
                                                                </a>
                                                                <div class="dropdown-menu dropdown-menu-end">
                                                                    <a href="javascript:void(0);" class="dropdown-item">Refresh Report</a>
                                                                    <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div> <!-- end table-responsive-->
                                    </div> <!-- end card-body-->

                                    <div class="card-footer border-0">
                                        <div class="align-items-center justify-content-between row text-center text-sm-start">
                                            <div class="col-sm">
                                                <div class="text-muted">
                                                    Showing <span class="fw-semibold">5</span> of <span class="fw-semibold">15</span> Results
                                                </div>
                                            </div>
                                            <div class="col-sm-auto mt-3 mt-sm-0">
                                                <ul class="pagination pagination-boxed pagination-sm mb-0 justify-content-center">
                                                    <li class="page-item disabled">
                                                        <a href="#" class="page-link"><i class="ti ti-chevron-left"></i></a>
                                                    </li>
                                                    <li class="page-item active">
                                                        <a href="#" class="page-link">1</a>
                                                    </li>
                                                    <li class="page-item">
                                                        <a href="#" class="page-link">2</a>
                                                    </li>
                                                    <li class="page-item">
                                                        <a href="#" class="page-link">3</a>
                                                    </li>
                                                    <li class="page-item">
                                                        <a href="#" class="page-link"><i class="ti ti-chevron-right"></i></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div> <!-- -->
                                    </div>

                                </div> <!-- end card-->
                            </div> <!-- end col-->

                            <div class="col-xxl-6">
                                <div class="card">
                                    <div class="card-header d-flex flex-wrap align-items-center gap-2 border-bottom border-dashed">
                                        <h4 class="header-title me-auto">Top Selling Products</h4>

                                        <div class="d-flex gap-2 justify-content-end text-end">
                                            <a href="javascript:void(0);" class="btn btn-sm btn-secondary">Import <i class="ti ti-download ms-1"></i></a>
                                            <a href="javascript:void(0);" class="btn btn-sm btn-primary">Export <i class="ti ti-file-export ms-1"></i></a>
                                        </div>
                                    </div>

                                    <div class="card-body p-0">
                                        <div class="table-responsive">
                                            <table class="table table-custom align-middle table-nowrap table-hover mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div class="avatar-lg">
                                                                <img src="./assets/images/products/p-1.png" alt="Product-1" class="img-fluid rounded-2">
                                                            </div>
                                                        </td>
                                                        <td class="ps-0">
                                                            <h5 class="fs-14 my-1"><a href="apps-ecommerce-product-details.html" class="link-reset">ASOS High Waist Tshirt</a></h5>
                                                            <span class="text-muted fs-12">07 April 2024</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="fs-14 my-1">$79.49</h5>
                                                            <span class="text-muted fs-12">Price</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="fs-14 my-1">82</h5>
                                                            <span class="text-muted fs-12">Quantity</span>
                                                        </td>
                                                        <td>
                                                            <div class="d-flex align-items-center justify-content-end">
                                                                <div class="me-2">
                                                                    <h5 class="fs-14 my-1">$6,518.18</h5>
                                                                    <span class="text-muted fs-12">Amount</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="avatar-lg">
                                                                <img src="./assets/images/products/p-7.png" alt="Product-1" class="img-fluid rounded-2">
                                                            </div>
                                                        </td>
                                                        <td class="ps-0">
                                                            <h5 class="fs-14 my-1"><a href="apps-ecommerce-product-details.html" class="link-reset">Marco Single Sofa</a></h5>
                                                            <span class="text-muted fs-12">25 March 2024</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="fs-14 my-1">$128.50</h5>
                                                            <span class="text-muted fs-12">Price</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="fs-14 my-1">37</h5>
                                                            <span class="text-muted fs-12">Quantity</span>
                                                        </td>
                                                        <td>
                                                            <div class="d-flex align-items-center justify-content-end">
                                                                <div class="me-2">
                                                                    <h5 class="fs-14 my-1">$4,754.50</h5>
                                                                    <span class="text-muted fs-12">Amount</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="avatar-lg">
                                                                <img src="./assets/images/products/p-4.png" alt="Product-1" class="img-fluid rounded-2">
                                                            </div>
                                                        </td>
                                                        <td class="ps-0">
                                                            <h5 class="fs-14 my-1"><a href="apps-ecommerce-product-details.html" class="link-reset">Smart Headphone </a></h5>
                                                            <span class="text-muted fs-12">17 March 2024</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="fs-14 my-1">$39.99</h5>
                                                            <span class="text-muted fs-12">Price</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="fs-14 my-1">64</h5>
                                                            <span class="text-muted fs-12">Quantity</span>
                                                        </td>
                                                        <td>
                                                            <div class="d-flex align-items-center justify-content-end">
                                                                <div class="me-2">
                                                                    <h5 class="fs-14 my-1">$2,559.36</h5>
                                                                    <span class="text-muted fs-12">Amount</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="avatar-lg">
                                                                <img src="./assets/images/products/p-5.png" alt="Product-1" class="img-fluid rounded-2">
                                                            </div>
                                                        </td>
                                                        <td class="ps-0">
                                                            <h5 class="fs-14 my-1"><a href="apps-ecommerce-product-details.html" class="link-reset">Lightweight Jacket</a></h5>
                                                            <span class="text-muted fs-12">12 March 2024</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="fs-14 my-1">$20.00</h5>
                                                            <span class="text-muted fs-12">Price</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="fs-14 my-1">184</h5>
                                                            <span class="text-muted fs-12">Quantity</span>
                                                        </td>
                                                        <td>
                                                            <div class="d-flex align-items-center justify-content-end">
                                                                <div class="me-2">
                                                                    <h5 class="fs-14 my-1">$3,680.00</h5>
                                                                    <span class="text-muted fs-12">Amount</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <div class="avatar-lg">
                                                                <img src="./assets/images/products/p-6.png" alt="Product-1" class="img-fluid rounded-2">
                                                            </div>
                                                        </td>
                                                        <td class="ps-0">
                                                            <h5 class="fs-14 my-1"><a href="apps-ecommerce-product-details.html" class="link-reset">Marco Shoes</a></h5>
                                                            <span class="text-muted fs-12">05 March 2024</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="fs-14 my-1">$28.49</h5>
                                                            <span class="text-muted fs-12">Price</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="fs-14 my-1">69</h5>
                                                            <span class="text-muted fs-12">Quantity</span>
                                                        </td>
                                                        <td>
                                                            <div class="d-flex align-items-center justify-content-end">
                                                                <div class="me-2">
                                                                    <h5 class="fs-14 my-1">$1,965.81</h5>
                                                                    <span class="text-muted fs-12">Amount</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div> <!-- end table-responsive-->
                                    </div> <!-- end card-body-->

                                    <div class="card-footer border-0">
                                        <div class="align-items-center justify-content-between row text-center text-sm-start">
                                            <div class="col-sm">
                                                <div class="text-muted">
                                                    Showing <span class="fw-semibold">5</span> of <span class="fw-semibold">10</span> Results
                                                </div>
                                            </div>
                                            <div class="col-sm-auto mt-3 mt-sm-0">
                                                <ul class="pagination pagination-boxed pagination-sm mb-0 justify-content-center">
                                                    <li class="page-item disabled">
                                                        <a href="#" class="page-link"><i class="ti ti-chevron-left"></i></a>
                                                    </li>
                                                    <li class="page-item active">
                                                        <a href="#" class="page-link">1</a>
                                                    </li>
                                                    <li class="page-item">
                                                        <a href="#" class="page-link">2</a>
                                                    </li>
                                                    <li class="page-item">
                                                        <a href="#" class="page-link"><i class="ti ti-chevron-right"></i></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div> <!-- -->
                                    </div>
                                </div> <!-- end card-->
                            </div> <!-- end col-->
                        </div> <!-- end row-->

                    </div> <!-- end col-->

                    <div class="col-auto info-sidebar">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex mb-3 justify-content-between align-items-center">
                                    <h4 class="header-title">Recent Orders:</h4>
                                    <div>
                                        <a href="javascript:void(0);" class="btn btn-sm btn-primary rounded-circle btn-icon"><i class="ti ti-plus"></i></a>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center gap-2 position-relative mb-2">
                                    <div class="avatar-md flex-shrink-0">
                                        <img src="./assets/images/products/p-6.png" alt="product-pic" height="36">
                                    </div>
                                    <div>
                                        <h5 class="fs-14 my-1"><a href="apps-ecommerce-order-details.html" class="stretched-link link-reset">Marco Shoes</a></h5>
                                        <span class="text-muted fs-12">$29.99 x 1 = $29.99</span>
                                    </div>
                                    <div class="ms-auto">
                                        <span class="badge badge-soft-success px-2 py-1">Sold</span>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center gap-2 position-relative mb-2">
                                    <div class="avatar-md flex-shrink-0">
                                        <img src="./assets/images/products/p-1.png" alt="product-pic" height="36">
                                    </div>
                                    <div>
                                        <h5 class="fs-14 my-1"><a href="apps-ecommerce-order-details.html" class="stretched-link link-reset">High Waist Tshirt</a></h5>
                                        <span class="text-muted fs-12">$9.99 x 3 = $29.97</span>
                                    </div>
                                    <div class="ms-auto">
                                        <span class="badge badge-soft-success px-2 py-1">Sold</span>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center gap-2 position-relative mb-2">
                                    <div class="avatar-md flex-shrink-0">
                                        <img src="./assets/images/products/p-3.png" alt="product-pic" height="36">
                                    </div>
                                    <div>
                                        <h5 class="fs-14 my-1"><a href="apps-ecommerce-order-details.html" class="stretched-link link-reset">Comfirt Chair</a></h5>
                                        <span class="text-muted fs-12">$49.99 x 1 = $49.99</span>
                                    </div>
                                    <div class="ms-auto">
                                        <span class="badge badge-soft-danger px-2 py-1">Return</span>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center gap-2 position-relative mb-2">
                                    <div class="avatar-md flex-shrink-0">
                                        <img src="./assets/images/products/p-4.png" alt="product-pic" height="36">
                                    </div>
                                    <div>
                                        <h5 class="fs-14 my-1"><a href="apps-ecommerce-order-details.html" class="stretched-link link-reset">Smart Headphone</a></h5>
                                        <span class="text-muted fs-12">$39.99 x 1 = $39.99</span>
                                    </div>
                                    <div class="ms-auto">
                                        <span class="badge badge-soft-success px-2 py-1">Sold</span>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center gap-2 position-relative">
                                    <div class="avatar-md flex-shrink-0">
                                        <img src="./assets/images/products/p-2.png" alt="product-pic" height="36">
                                    </div>
                                    <div>
                                        <h5 class="fs-14 my-1"><a href="apps-ecommerce-order-details.html" class="stretched-link link-reset">Laptop Bag</a></h5>
                                        <span class="text-muted fs-12">$12.99 x 4 = $51.96</span>
                                    </div>
                                    <div class="ms-auto">
                                        <span class="badge badge-soft-success px-2 py-1">Sold</span>
                                    </div>
                                </div>

                                <div class="mt-3 text-center">
                                    <a href="#!" class="text-decoration-underline fw-semibold ms-auto link-offset-2 link-dark">View All</a>
                                </div>
                            </div>
                            <div class="card-body p-0 border-top border-dashed">
                                <h4 class="header-title px-3 mb-2 mt-3">Recent Activity:</h4>
                                <div class="my-3 px-3" data-simplebar style="max-height: 370px;">
                                    <div class="timeline-alt py-0">
                                        <div class="timeline-item">
                                            <i class="ti ti-basket bg-info-subtle text-info timeline-icon"></i>
                                            <div class="timeline-item-info">
                                                <a href="javascript:void(0);" class="link-reset fw-semibold mb-1 d-block">You sold an item</a>
                                                <span class="mb-1">Paul Burgess just purchased “My - Admin Dashboard”!</span>
                                                <p class="mb-0 pb-3">
                                                    <small class="text-muted">5 minutes ago</small>
                                                </p>
                                            </div>
                                        </div>

                                        <div class="timeline-item">
                                            <i class="ti ti-rocket bg-primary-subtle text-primary timeline-icon"></i>
                                            <div class="timeline-item-info">
                                                <a href="javascript:void(0);" class="link-reset fw-semibold mb-1 d-block">Product on the Theme Market</a>
                                                <span class="mb-1">Reviewer added
                                                    <span class="fw-medium">Admin Dashboard</span>
                                                </span>
                                                <p class="mb-0 pb-3">
                                                    <small class="text-muted">30 minutes ago</small>
                                                </p>
                                            </div>
                                        </div>

                                        <div class="timeline-item">
                                            <i class="ti ti-message bg-info-subtle text-info timeline-icon"></i>
                                            <div class="timeline-item-info">
                                                <a href="javascript:void(0);" class="link-reset fw-semibold mb-1 d-block">Robert Delaney</a>
                                                <span class="mb-1">Send you message
                                                    <span class="fw-medium">"Are you there?"</span>
                                                </span>
                                                <p class="mb-0 pb-3">
                                                    <small class="text-muted">2 hours ago</small>
                                                </p>
                                            </div>
                                        </div>

                                        <div class="timeline-item">
                                            <i class="ti ti-photo bg-primary-subtle text-primary timeline-icon"></i>
                                            <div class="timeline-item-info">
                                                <a href="javascript:void(0);" class="link-reset fw-semibold mb-1 d-block">Audrey Tobey</a>
                                                <span class="mb-1">Uploaded a photo
                                                    <span class="fw-medium">"Error.jpg"</span>
                                                </span>
                                                <p class="mb-0 pb-3">
                                                    <small class="text-muted">14 hours ago</small>
                                                </p>
                                            </div>
                                        </div>

                                        <div class="timeline-item">
                                            <i class="ti ti-basket bg-info-subtle text-info timeline-icon"></i>
                                            <div class="timeline-item-info">
                                                <a href="javascript:void(0);" class="link-reset fw-semibold mb-1 d-block">You sold an item</a>
                                                <span class="mb-1">Paul Burgess just purchased “My - Admin Dashboard”!</span>
                                                <p class="mb-0 pb-3">
                                                    <small class="text-muted">16 hours ago</small>
                                                </p>
                                            </div>
                                        </div>

                                        <div class="timeline-item">
                                            <i class="ti ti-rocket bg-primary-subtle text-primary timeline-icon"></i>
                                            <div class="timeline-item-info">
                                                <a href="javascript:void(0);" class="link-reset fw-semibold mb-1 d-block">Product on the Bootstrap Market</a>
                                                <span class="mb-1">Reviewer added
                                                    <span class="fw-medium">Admin Dashboard</span>
                                                </span>
                                                <p class="mb-0 pb-3">
                                                    <small class="text-muted">22 hours ago</small>
                                                </p>
                                            </div>
                                        </div>

                                        <div class="timeline-item">
                                            <i class="ti ti-message bg-info-subtle text-info timeline-icon"></i>
                                            <div class="timeline-item-info">
                                                <a href="javascript:void(0);" class="link-reset fw-semibold mb-1 d-block">Robert Delaney</a>
                                                <span class="mb-1">Send you message
                                                    <span class="fw-medium">"Are you there?"</span>
                                                </span>
                                                <p class="mb-0 pb-2">
                                                    <small class="text-muted">2 days ago</small>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end timeline -->
                                </div> <!-- end slimscroll -->
                            </div>

                            <div class="card-body">
                                <div class="card mb-0 bg-warning bg-opacity-25">
                                    <div class="card-body" style="background-image: url(assets/images/png/arrows.svg); background-size: contain; background-repeat: no-repeat; background-position: right bottom;">
                                        <h1><i class="ti ti-receipt-tax text-warning"></i></h1>
                                        <h4 class="text-warning">Estimated tax for this year</h4>
                                        <p class="text-warning text-opacity-75">We kindly encourage you to review your recent transactions</p>
                                        <a href="#!" class="btn btn-sm rounded-pill btn-info">Activate Now</a>
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->
                            </div>
                        </div> <!-- end card-->
                    </div> <!-- end col-->
                </div> <!-- end row-->

            </div> <!-- container -->

            <!-- Footer Start -->
            <footer class="footer">
                <div class="page-container">
                    <div class="row">
                        <div class="col-md-6 text-center text-md-start">
                            <script>document.write(new Date().getFullYear())</script> © Boron - By <span class="fw-bold text-decoration-underline text-uppercase text-reset fs-12">Coderthemes</span>
                        </div>
                        <div class="col-md-6">
                            <div class="text-md-end footer-links d-none d-md-block">
                                <a href="javascript: void(0);">About</a>
                                <a href="javascript: void(0);">Support</a>
                                <a href="javascript: void(0);">Contact Us</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="theme-settings-offcanvas">
        <div class="d-flex align-items-center gap-2 px-3 py-3 offcanvas-header border-bottom border-dashed">
            <h5 class="flex-grow-1 mb-0">Theme Settings</h5>

            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div class="offcanvas-body p-0 h-100" data-simplebar>
            <div class="p-3 border-bottom border-dashed">
                <h5 class="mb-3 fs-16 fw-bold">Color Scheme</h5>

                <div class="row">
                    <div class="col-4">
                        <div class="form-check card-radio">
                            <input class="form-check-input" type="radio" name="data-bs-theme" id="layout-color-light" value="light">
                            <label class="form-check-label p-3 w-100 d-flex justify-content-center align-items-center" for="layout-color-light">
                                <iconify-icon icon="solar:sun-bold-duotone" class="fs-32 text-muted"></iconify-icon>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Light</h5>
                    </div>

                    <div class="col-4">
                        <div class="form-check card-radio">
                            <input class="form-check-input" type="radio" name="data-bs-theme" id="layout-color-dark" value="dark">
                            <label class="form-check-label p-3 w-100 d-flex justify-content-center align-items-center" for="layout-color-dark">
                                <iconify-icon icon="solar:cloud-sun-2-bold-duotone" class="fs-32 text-muted"></iconify-icon>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Dark</h5>
                    </div>
                </div>
            </div>

            <div class="p-3 border-bottom border-dashed">
                <h5 class="mb-3 fs-16 fw-bold">Topbar Color</h5>

                <div class="row">
                    <div class="col-3">
                        <div class="form-check card-radio">
                            <input class="form-check-input" type="radio" name="data-topbar-color" id="topbar-color-light" value="light">
                            <label class="form-check-label p-0 avatar-lg w-100 bg-light" for="topbar-color-light">
                                <span class="d-flex align-items-center justify-content-center h-100">
                                    <span class="p-2 d-inline-flex shadow rounded-circle bg-white"></span>
                                </span>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Light</h5>
                    </div>

                    <div class="col-3">
                        <div class="form-check card-radio">
                            <input class="form-check-input" type="radio" name="data-topbar-color" id="topbar-color-dark" value="dark">
                            <label class="form-check-label p-0 avatar-lg w-100 bg-light" for="topbar-color-dark">
                                <span class="d-flex align-items-center justify-content-center h-100">
                                    <span class="p-2 d-inline-flex shadow rounded-circle bg-dark"></span>
                                </span>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Dark</h5>
                    </div>
                </div>
            </div>

            <div class="p-3 border-bottom border-dashed">
                <h5 class="mb-3 fs-16 fw-bold">Menu Color</h5>

                <div class="row">
                    <div class="col-3">
                        <div class="form-check sidebar-setting card-radio">
                            <input class="form-check-input" type="radio" name="data-menu-color" id="sidenav-color-light" value="light">
                            <label class="form-check-label p-0 avatar-lg w-100 bg-light" for="sidenav-color-light">
                                <span class="d-flex align-items-center justify-content-center h-100">
                                    <span class="p-2 d-inline-flex shadow rounded-circle bg-white"></span>
                                </span>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Light</h5>
                    </div>

                    <div class="col-3" style="--ct-dark-rgb: 64,73,84;">
                        <div class="form-check sidebar-setting card-radio">
                            <input class="form-check-input" type="radio" name="data-menu-color" id="sidenav-color-dark" value="dark">
                            <label class="form-check-label p-0 avatar-lg w-100 bg-light" for="sidenav-color-dark">
                                <span class="d-flex align-items-center justify-content-center h-100">
                                    <span class="p-2 d-inline-flex shadow rounded-circle bg-dark"></span>
                                </span>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Dark</h5>
                    </div>
                </div>
            </div>

            <div class="p-3 .border-bottom .border-dashed">
                <h5 class="mb-3 fs-16 fw-bold">Sidebar Size</h5>

                <div class="row">
                    <div class="col-4">
                        <div class="form-check sidebar-setting card-radio">
                            <input class="form-check-input" type="radio" name="data-sidenav-size" id="sidenav-size-default" value="default">
                            <label class="form-check-label p-0 avatar-xl w-100" for="sidenav-size-default">
                                <span class="d-flex h-100">
                                    <span class="flex-shrink-0">
                                        <span class="bg-light d-flex h-100 border-end  flex-column p-1 px-2">
                                            <span class="d-block p-1 bg-dark-subtle rounded mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                        </span>
                                    </span>
                                    <span class="flex-grow-1">
                                        <span class="d-flex h-100 flex-column">
                                            <span class="bg-light d-block p-1"></span>
                                        </span>
                                    </span>
                                </span>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Default</h5>
                    </div>

                    <div class="col-4">
                        <div class="form-check sidebar-setting card-radio">
                            <input class="form-check-input" type="radio" name="data-sidenav-size" id="sidenav-size-compact" value="compact">
                            <label class="form-check-label p-0 avatar-xl w-100" for="sidenav-size-compact">
                                <span class="d-flex h-100">
                                    <span class="flex-shrink-0">
                                        <span class="bg-light d-flex h-100 border-end  flex-column p-1">
                                            <span class="d-block p-1 bg-dark-subtle rounded mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                        </span>
                                    </span>
                                    <span class="flex-grow-1">
                                        <span class="d-flex h-100 flex-column">
                                            <span class="bg-light d-block p-1"></span>
                                        </span>
                                    </span>
                                </span>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Compact</h5>
                    </div>

                    <div class="col-4">
                        <div class="form-check sidebar-setting card-radio">
                            <input class="form-check-input" type="radio" name="data-sidenav-size" id="sidenav-size-small" value="condensed">
                            <label class="form-check-label p-0 avatar-xl w-100" for="sidenav-size-small">
                                <span class="d-flex h-100">
                                    <span class="flex-shrink-0">
                                        <span class="bg-light d-flex h-100 border-end flex-column" style="padding: 2px;">
                                            <span class="d-block p-1 bg-dark-subtle rounded mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                        </span>
                                    </span>
                                    <span class="flex-grow-1">
                                        <span class="d-flex h-100 flex-column">
                                            <span class="bg-light d-block p-1"></span>
                                        </span>
                                    </span>
                                </span>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Condensed</h5>
                    </div>

                    <div class="col-4">
                        <div class="form-check sidebar-setting card-radio">
                            <input class="form-check-input" type="radio" name="data-sidenav-size" id="sidenav-size-small-hover" value="sm-hover">
                            <label class="form-check-label p-0 avatar-xl w-100" for="sidenav-size-small-hover">
                                <span class="d-flex h-100">
                                    <span class="flex-shrink-0">
                                        <span class="bg-light d-flex h-100 border-end flex-column" style="padding: 2px;">
                                            <span class="d-block p-1 bg-dark-subtle rounded mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                            <span class="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1"></span>
                                        </span>
                                    </span>
                                    <span class="flex-grow-1">
                                        <span class="d-flex h-100 flex-column">
                                            <span class="bg-light d-block p-1"></span>
                                        </span>
                                    </span>
                                </span>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Hover View</h5>
                    </div>

                    <div class="col-4">
                        <div class="form-check sidebar-setting card-radio">
                            <input class="form-check-input" type="radio" name="data-sidenav-size" id="sidenav-size-full" value="full">
                            <label class="form-check-label p-0 avatar-xl w-100" for="sidenav-size-full">
                                <span class="d-flex h-100">
                                    <span class="flex-shrink-0">
                                        <span class="d-flex h-100 flex-column">
                                            <span class="d-block p-1 bg-dark-subtle mb-1"></span>
                                        </span>
                                    </span>
                                    <span class="flex-grow-1">
                                        <span class="d-flex h-100 flex-column">
                                            <span class="bg-light d-block p-1"></span>
                                        </span>
                                    </span>
                                </span>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Full Layout</h5>
                    </div>

                    <div class="col-4">
                        <div class="form-check sidebar-setting card-radio">
                            <input class="form-check-input" type="radio" name="data-sidenav-size" id="sidenav-size-fullscreen" value="fullscreen">
                            <label class="form-check-label p-0 avatar-xl w-100" for="sidenav-size-fullscreen">
                                <span class="d-flex h-100">
                                    <span class="flex-grow-1">
                                        <span class="d-flex h-100 flex-column">
                                            <span class="bg-light d-block p-1"></span>
                                        </span>
                                    </span>
                                </span>
                            </label>
                        </div>
                        <h5 class="fs-14 text-center text-muted mt-2">Hidden</h5>
                    </div>
                </div>
            </div>

            <div class="p-3 border-bottom border-dashed d-none">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="fs-16 fw-bold mb-0">Container Width</h5>

                    <div class="btn-group radio" role="group">
                        <input type="radio" class="btn-check" name="data-container-position" id="container-width-fixed" value="fixed">
                        <label class="btn btn-sm btn-soft-primary w-sm" for="container-width-fixed">Full</label>

                        <input type="radio" class="btn-check" name="data-container-position" id="container-width-scrollable" value="scrollable">
                        <label class="btn btn-sm btn-soft-primary w-sm ms-0" for="container-width-scrollable">Boxed</label>
                    </div>
                </div>
            </div>

            <div class="p-3 border-bottom border-dashed d-none">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="fs-16 fw-bold mb-0">Layout Position</h5>

                    <div class="btn-group radio" role="group">
                        <input type="radio" class="btn-check" name="data-layout-position" id="layout-position-fixed" value="fixed">
                        <label class="btn btn-sm btn-soft-primary w-sm" for="layout-position-fixed">Fixed</label>

                        <input type="radio" class="btn-check" name="data-layout-position" id="layout-position-scrollable" value="scrollable">
                        <label class="btn btn-sm btn-soft-primary w-sm ms-0" for="layout-position-scrollable">Scrollable</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex align-items-center gap-2 px-3 py-2 offcanvas-header border-top border-dashed">
            <button type="button" class="btn w-50 btn-soft-danger" id="reset-layout">Reset</button>
            <button type="button" class="btn w-50 btn-soft-info">Buy Now</button>
        </div>

    </div>

    <script src="./assets/js/vendor.min.js"></script>
    <script src="./assets/js/app.js"></script>
    <script src="./assets/js/apexcharts.min.js"></script>
    <script src="./assets/js/dashboard-sales.js"></script>
</body>
</html>