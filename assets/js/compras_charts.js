document.addEventListener("DOMContentLoaded", () => {
    const hash = new URLSearchParams(window.location.search).get("id") || "";
    const section = document.getElementById("charts-section");
    const wrap = document.getElementById("charts-wrap");
    const btn = document.getElementById("btnToggleCharts");
    const modalEl = document.getElementById("charts-modal");

    if (!section || !wrap || !btn || !modalEl || !hash) return;

    let cargado = false;
    const chartInstances = [];
    const modal = new bootstrap.Modal(modalEl);

    btn.addEventListener("click", () => {
        btn.classList.add("active");
        const tip = typeof bootstrap !== "undefined" ? bootstrap.Tooltip?.getInstance(btn) : null;
        if (tip) tip.hide();
        modal.show();
    });

    modalEl.addEventListener("shown.bs.modal", async () => {
        if (!cargado) {
            cargado = true;
            await cargarCharts();
        }
        chartInstances.forEach(chart => {
            if (typeof chart.resize === "function") chart.resize();
        });
        window.dispatchEvent(new Event("resize"));
        window.setTimeout(() => initRadarTooltip(), 80);
    });

    modalEl.addEventListener("hidden.bs.modal", () => {
        btn.classList.remove("active");
    });

    async function cargarCharts() {
        try {
            const res = await fetch(`controller/compras/charts_compra.php?id=${encodeURIComponent(hash)}`);
            const data = await res.json();
            if (!res.ok || data.success === false) {
                throw new Error(data.message || "No se pudieron cargar los gráficos");
            }
            await renderRadar(data.radar || {});
            renderRadialbar(data.radialbar || {});
            renderScatter(data.scatter || {});
            renderTreemap(data.treemap || {});
        } catch (error) {
            if (typeof alertify !== "undefined") {
                alertify.error(error.message || "Error al cargar gráficos");
            }
            mostrarVacio(wrap);
        }
    }

    function dataColors(id, fallback) {
        const el = document.getElementById(id);
        const data = el ? el.dataset.colors : "";
        return data ? data.split(",") : fallback;
    }

    function mostrarVacio(container) {
        if (!container) return;
        container.querySelectorAll(".apex-charts").forEach(el => {
            el.innerHTML = '<div class="text-center text-muted py-5 fs-14">Sin datos</div>';
        });
    }

    function renderChart(el, options, afterRender) {
        const chart = new ApexCharts(el, options);
        chartInstances.push(chart);
        return chart.render().then(() => {
            if (typeof afterRender === "function") afterRender(chart);
        });
    }

    let radarLabels = [];
    let radarSeries = [];

    async function renderRadar(radar) {
        const el = document.getElementById("chart-radar-subcat");
        if (!el) return;
        const labels = radar.labels || [];
        const series = radar.series || [];
        if (!labels.length || !series.length) {
            el.innerHTML = '<div class="text-center text-muted py-5 fs-14">Sin datos por sub categoría</div>';
            return;
        }
        const colors = dataColors("chart-radar-subcat", ["#39afd1"]);
        radarLabels = labels;
        radarSeries = series;

        await renderChart(el, {
            chart: { height: 390, type: "radar", toolbar: { show: false } },
            series: [{ name: "Monto ($)", data: series }],
            colors: colors,
            labels: labels,
            stroke: { width: 2 },
            fill: { opacity: 0.4 },
            markers: { size: 5, hover: { size: 8 }, colors: ["#fff"], strokeColor: colors, strokeWidth: 2 },
            tooltip: {
                enabled: true,
                shared: false,
                intersect: false,
                followCursor: true,
                custom: ({ dataPointIndex }) => {
                    const label = labels[dataPointIndex] || "Categoría";
                    const value = series[dataPointIndex] || 0;
                    return `
                        <div style="padding:8px 12px;line-height:1.45;max-width:260px;">
                            <div style="font-weight:700;font-size:12px;white-space:normal;">${escapeHtml(label)}</div>
                            <div style="font-size:11px;opacity:.85;">Monto: $ ${formatNumber(value)}</div>
                        </div>`;
                }
            },
            yaxis: { tickAmount: 5 }
        });
    }

    function initRadarTooltip() {
        const wrapEl = document.querySelector(".radar-chart-wrap");
        const layer = document.getElementById("radar-hover-layer");
        const tooltip = document.getElementById("radar-custom-tooltip");
        if (!wrapEl || !layer || !tooltip || !radarLabels.length) return;

        layer.onmousemove = event => {
            const box = wrapEl.getBoundingClientRect();
            const x = event.clientX - box.left;
            const y = event.clientY - box.top;
            const cx = box.width / 2;
            const cy = box.height / 2;
            const distance = Math.hypot(x - cx, y - cy);
            const maxDistance = Math.min(box.width, box.height) * 0.48;

            if (distance > maxDistance) {
                tooltip.classList.remove("show");
                return;
            }

            const angle = Math.atan2(y - cy, x - cx);
            const normalized = (angle + (Math.PI / 2) + (Math.PI * 2)) % (Math.PI * 2);
            const index = Math.round(normalized / ((Math.PI * 2) / radarLabels.length)) % radarLabels.length;
            showRadarTooltip(event, tooltip, radarLabels[index], radarSeries[index]);
        };
        layer.onmouseleave = () => tooltip.classList.remove("show");
    }

    function showRadarTooltip(event, tooltip, label, value) {
        tooltip.innerHTML = `
            <div class="fw-bold mb-1">${escapeHtml(label)}</div>
            <div>Monto: $ ${formatNumber(value)}</div>`;
        tooltip.classList.add("show");
        moveRadarTooltip(event, tooltip);
    }

    function moveRadarTooltip(event, tooltip) {
        const container = tooltip.parentElement.getBoundingClientRect();
        const x = event.clientX - container.left + 14;
        const y = event.clientY - container.top + 14;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    function renderRadialbar(rb) {
        const el = document.getElementById("chart-radialbar-comparativo");
        if (!el) return;
        const ing = Number(rb.ingenieria || 0);
        const compra = Number(rb.compra || 0);
        const max = Math.max(ing, compra, 1);
        const raw = [ing, compra];
        const series = [Math.round((ing / max) * 100), Math.round((compra / max) * 100)];

        if (raw[0] <= 0 && raw[1] <= 0) {
            el.innerHTML = '<div class="text-center text-muted py-5 fs-14">Sin montos para comparar</div>';
            return;
        }

        renderChart(el, {
            chart: { height: 390, type: "radialBar", toolbar: { show: false } },
            plotOptions: {
                radialBar: {
                    offsetY: -10,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: { margin: 5, size: "30%", background: "transparent" },
                    track: { background: "rgba(170,184,197, 0.2)" },
                    dataLabels: { name: { show: false }, value: { show: false } }
                }
            },
            series: series,
            colors: dataColors("chart-radialbar-comparativo", ["#6ac75a", "#39afd1"]),
            labels: ["Ingeniería", "Compras"],
            legend: {
                show: true,
                floating: true,
                fontSize: "14px",
                position: "left",
                offsetX: 10,
                offsetY: 10,
                labels: { useSeriesColors: true },
                markers: { size: 0 },
                formatter: (name, opts) => name + ":  $" + formatNumber(raw[opts.seriesIndex]),
                itemMargin: { horizontal: 1 }
            },
            stroke: { lineCap: "round" }
        });
    }

    function renderScatter(scatter) {
        const el = document.getElementById("chart-scatter-items");
        if (!el) return;
        const series = scatter.series || [];
        if (!series.length) {
            el.innerHTML = '<div class="text-center text-muted py-5 fs-14">Sin items para graficar</div>';
            return;
        }
        const prices = series.flatMap(group => (group.data || []).map(point => Number(point.x || 0))).filter(price => Number.isFinite(price));
        const quantities = series.flatMap(group => (group.data || []).map(point => Number(point.y || 0))).filter(qty => Number.isFinite(qty));
        const priceAxis = [...new Set(prices.map(price => Number(price.toFixed(2))))].sort((a, b) => a - b);
        const priceIndex = new Map(priceAxis.map((price, index) => [price.toFixed(2), index + 1]));
        const normalizedSeries = series.map(group => ({
            ...group,
            data: (group.data || []).map(point => {
                const price = Number(point.x || 0);
                const axisPrice = Number(price.toFixed(2));
                return {
                    ...point,
                    price: price,
                    x: priceIndex.get(axisPrice.toFixed(2)) || 1
                };
            })
        }));
        const width = Math.max(1180, Math.min(2600, priceAxis.length * 56));
        const yMax = Math.max(10, Math.ceil((Math.max(...quantities, 1) * 1.15) / 10) * 10);
        el.style.minWidth = `${width}px`;

        renderChart(el, {
            chart: { height: 440, type: "scatter", zoom: { enabled: false }, toolbar: { show: false } },
            series: normalizedSeries,
            colors: dataColors("chart-scatter-items", ["#39afd1", "#ce7e7e", "#ffbc00", "#6ac75a"]),
            xaxis: {
                type: "category",
                categories: priceAxis.map(price => Math.round(price).toString()),
                tickAmount: 8,
                title: { text: "Precio unitario (USD)" },
                labels: { rotate: 0, hideOverlappingLabels: true, trim: true }
            },
            yaxis: { min: 0, max: yMax, title: { text: "Cantidad" } },
            grid: { borderColor: "#f1f3fa", padding: { top: 28, bottom: 5 } },
            legend: { offsetY: 7, position: "top", horizontalAlign: "left" },
            tooltip: {
                custom: ({ seriesIndex, dataPointIndex, w }) => {
                    const point = (w.config.series[seriesIndex]?.data || [])[dataPointIndex] || {};
                    const nombre = point.name || "Item";
                    return `
                        <div style="padding:8px 12px;line-height:1.45;">
                            <div style="font-weight:600;font-size:12px;">${escapeHtml(nombre)}</div>
                            <div style="font-size:11px;opacity:.85;">Precio: $ ${formatNumber(point.price)}</div>
                            <div style="font-size:11px;opacity:.85;">Cantidad: ${formatNumber(point.y)}</div>
                        </div>`;
                }
            }
        });
    }

    function renderTreemap(treemap) {
        const el = document.getElementById("chart-treemap-items");
        if (!el) return;
        let data = Array.isArray(treemap.data) ? treemap.data.slice() : [];
        if (!data.length) {
            el.innerHTML = '<div class="text-center text-muted py-5 fs-14">Sin items para graficar</div>';
            return;
        }
        data.sort((a, b) => Number(b.y || 0) - Number(a.y || 0));
        if (data.length > 16) {
            const top = data.slice(0, 15);
            const resto = data.slice(15).reduce((sum, d) => sum + Number(d.y || 0), 0);
            top.push({ x: "Otros", y: resto });
            data = top;
        }
        renderChart(el, {
            series: [{ data: data }],
            legend: { show: false },
            chart: { height: 440, type: "treemap", toolbar: { show: false } },
            colors: dataColors("chart-treemap-items", ["#ce7e7e", "#6ac75a", "#fa5c7c", "#6c757d", "#39afd1", "#ffc35a"]),
            plotOptions: { treemap: { distributed: true, enableShades: true } },
            dataLabels: {
                enabled: true,
                style: { fontSize: "12px", fontWeight: 700 },
                formatter: (text, opts) => [truncateLabel(text, 34), "$" + formatNumber(opts.value)]
            },
            tooltip: { y: { formatter: val => "$ " + formatNumber(val) } }
        });
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString("es-PE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function truncateLabel(value, maxLength) {
        const text = String(value || "");
        return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text;
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
});
