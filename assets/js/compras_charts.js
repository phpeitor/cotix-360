document.addEventListener("DOMContentLoaded", () => {
    const hash = new URLSearchParams(window.location.search).get("id") || "";
    const section = document.getElementById("charts-section");
    const wrap = document.getElementById("charts-wrap");
    const btn = document.getElementById("btnToggleCharts");

    if (!section || !wrap || !btn || !hash) return;

    let cargado = false;

    btn.addEventListener("click", async () => {
        wrap.classList.toggle("d-none");
        const oculto = wrap.classList.contains("d-none");
        btn.classList.toggle("active", !oculto);
        btn.innerHTML = oculto
            ? '<i class="ti ti-chart-arcs me-1"></i>Ver gráficos'
            : '<i class="ti ti-chart-arcs me-1"></i>Ocultar gráficos';
        if (!cargado && !oculto) {
            cargado = true;
            await cargarCharts();
        }
    });

    async function cargarCharts() {
        try {
            const res = await fetch(`controller/compras/charts_compra.php?id=${encodeURIComponent(hash)}`);
            const data = await res.json();
            if (!res.ok || data.success === false) {
                throw new Error(data.message || "No se pudieron cargar los gráficos");
            }
            renderRadar(data.radar || {});
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

    function renderRadar(radar) {
        const el = document.getElementById("chart-radar-subcat");
        if (!el) return;
        const labels = radar.labels || [];
        const series = radar.series || [];
        if (!labels.length || !series.length) {
            el.innerHTML = '<div class="text-center text-muted py-5 fs-14">Sin datos por sub categoría</div>';
            return;
        }
        const colors = dataColors("chart-radar-subcat", ["#39afd1"]);
        new ApexCharts(el, {
            chart: { height: 350, type: "radar" },
            series: [{ name: "Monto ($)", data: series }],
            colors: colors,
            labels: labels,
            stroke: { width: 2 },
            fill: { opacity: 0.4 },
            markers: { size: 4, colors: ["#fff"], strokeColor: colors, strokeWidth: 2 },
            tooltip: { y: { formatter: val => "$ " + formatNumber(val) } },
            yaxis: { tickAmount: 5 }
        }).render();
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

        new ApexCharts(el, {
            chart: { height: 340, type: "radialBar" },
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
        }).render();
    }

    function renderScatter(scatter) {
        const el = document.getElementById("chart-scatter-items");
        if (!el) return;
        const series = scatter.series || [];
        if (!series.length) {
            el.innerHTML = '<div class="text-center text-muted py-5 fs-14">Sin items para graficar</div>';
            return;
        }
        new ApexCharts(el, {
            chart: { height: 350, type: "scatter", zoom: { enabled: false } },
            series: series,
            colors: dataColors("chart-scatter-items", ["#39afd1", "#ce7e7e", "#ffbc00", "#6ac75a"]),
            xaxis: { title: { text: "Precio unitario (USD)" } },
            yaxis: { title: { text: "Cantidad" } },
            grid: { borderColor: "#f1f3fa", padding: { bottom: 5 } },
            legend: { offsetY: 7 },
            tooltip: { x: { formatter: val => "$ " + formatNumber(val) } }
        }).render();
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
        new ApexCharts(el, {
            series: [{ data: data }],
            legend: { show: false },
            chart: { height: 350, type: "treemap" },
            colors: dataColors("chart-treemap-items", ["#ce7e7e", "#6ac75a", "#fa5c7c", "#6c757d", "#39afd1", "#ffc35a"]),
            plotOptions: { treemap: { distributed: true, enableShades: true } },
            dataLabels: {
                enabled: true,
                formatter: (text, opts) => [text, "$" + formatNumber(opts.value)]
            },
            tooltip: { y: { formatter: val => "$ " + formatNumber(val) } }
        }).render();
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString("es-PE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
});
