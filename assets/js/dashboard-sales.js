document.addEventListener("DOMContentLoaded", function () {
  fetch("controller/dashboard_graf.php")
    .then(res => res.json())
    .then(resp => {
		if (resp.error) return;

		const STATUS_COLORS = {
			Enviada:  "#6C757D",
			Aprobada: "#53cd48ff",
			Anulada:  "#ce7e7e"
		};

		const renderRadialChart = (selector, legendSelector, donutData) => {
				const chartHost = document.querySelector(selector);
				const legend = document.querySelector(legendSelector);
				const wrapper = chartHost ? chartHost.closest(".col-xxl-4") : null;

				if (!chartHost || !legend || !Array.isArray(donutData) || donutData.length === 0) {
					if (wrapper) {
						wrapper.style.display = "none";
					}
					return;
				}

				const total = donutData.reduce((sum, i) => sum + Number(i.ctd), 0);
				const series = donutData.map(i =>
					total > 0 ? Math.round((Number(i.ctd) / total) * 100) : 0
					);
				const labels = donutData.map(i => i.estado);
				const chartColors = donutData.map(i => STATUS_COLORS[i.estado] || "#999999");

				const chart = new ApexCharts(chartHost, {
					chart: { height: 330, type: "radialBar" },
					plotOptions: {
						radialBar: {
				track: { margin: "17%" },
				hollow: { size: "1%" },
				dataLabels: {
					name: { show: true },
					value: {
						show: true,
						formatter: val => `${val}%`
					}
				}
			  }
					},
					stroke: { lineCap: "round" },
					colors: chartColors,
					series,
					labels
				});

				chart.render();

				legend.innerHTML = "";

				donutData.forEach(item => {
					const color = STATUS_COLORS[item.estado] || "#999";

					legend.innerHTML += `
						<div class="d-flex justify-content-between align-items-center p-1">
							<div>
								<i class="ti ti-circle-filled fs-12 align-middle me-1" style="color:${color}"></i>
								<span class="align-middle fw-semibold">${item.estado}</span>
							</div>
							<span class="fw-semibold text-muted float-end">${item.ctd}</span>
						</div>
					`;
				});
			};

			renderRadialChart("#multiple-radialbar", "#donut-legend", resp.data.donut);
			renderRadialChart("#multiple-radialbar-receta", "#donut-legend-receta", resp.data.donut_receta);

		/* ======================
		REVENUE CHART (LINE / BAR)
		====================== */

		const lineData = resp.data.line;
		const months = [...new Set(lineData.map(i => i.periodo))]
		.sort();

		const MONTHS_ES = {
			"01": "Ene",
			"02": "Feb",
			"03": "Mar",
			"04": "Abr",
			"05": "May",
			"06": "Jun",
			"07": "Jul",
			"08": "Ago",
			"09": "Sep",
			"10": "Oct",
			"11": "Nov",
			"12": "Dic"
		};

		const monthLabels = months.map(periodo => {
			const [year, month] = periodo.split("-");
			return `${MONTHS_ES[month]}-${year}`;
		});

		const states = [...new Set(lineData.map(i => i.estado))];
		const revenueSeries = states.map(state => ({
			name: state,
			type: "bar",
			data: months.map(month => {
				const found = lineData.find(
				i => i.estado === state && i.periodo === month
				);
				return found ? Number(found.ctd) : 0;
			})
		}));

		const revenueColors = states.map(
			s => STATUS_COLORS[s] || "#999999"
		);

		const revenueChart = new ApexCharts(
		document.querySelector("#revenue-chart"),
			{
				chart: {
					height: 300,
					type: "line",
					toolbar: { show: false }
				},
				stroke: {
					curve: "smooth",
					width: 2
				},
				plotOptions: {
					bar: {
						columnWidth: "50%",
						borderRadius: 4
					}
				},
				dataLabels: {
					enabled: false
				},
				xaxis: {
					categories: monthLabels,
					axisTicks: { show: false },
					axisBorder: { show: false }
				},
				yaxis: {
					min: 0,
					forceNiceScale: true
				},
					colors: revenueColors,
					series: revenueSeries,
					legend: {
					show: true,
					position: "top"
				},
				tooltip: {
					y: {
						formatter: val => val
					}
				}
			}
		);
		revenueChart.render();
	});
});