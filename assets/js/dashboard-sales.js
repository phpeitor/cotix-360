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
				const wrapper = chartHost ? chartHost.closest(".col-xxl-6") : null;

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

		const renderOverviewChart = (selector, lineData) => {
			const chartHost = document.querySelector(selector);
			const wrapper = chartHost ? chartHost.closest('.dashboard-chart-card') : null;

			if (!chartHost || !Array.isArray(lineData) || lineData.length === 0) {
				if (wrapper) wrapper.style.display = 'none';
				return;
			}

			const months = [...new Set(lineData.map(i => i.periodo))].sort();
			const monthLabels = months.map(periodo => {
				const [year, month] = periodo.split("-");
				return `${MONTHS_ES[month]}-${year}`;
			});

			const states = [...new Set(lineData.map(i => i.estado))];
			const series = states.map(state => ({
				name: state,
				type: "bar",
				data: months.map(month => {
					const found = lineData.find(
						i => i.estado === state && i.periodo === month
					);
					return found ? Number(found.ctd) : 0;
				})
			}));

			const colors = states.map(s => STATUS_COLORS[s] || "#999999");

			const chart = new ApexCharts(chartHost, {
				chart: {
					height: 300,
					type: "line",
					toolbar: { show: false },
					zoom: { enabled: false }
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
				colors,
				series,
				legend: {
					show: true,
					position: "top"
				},
				tooltip: {
					y: {
						formatter: val => val
					}
				}
			});

			const fullSeries = series.map(item => ({ ...item, data: [...item.data] }));
			let visibleStart = 0;
			let visibleEnd = monthLabels.length - 1;
			const card = chartHost.closest(".dashboard-chart-card");
			const controls = card?.querySelector(".dashboard-chart-controls");
			const applyVisibleRange = () => {
				const categories = monthLabels.slice(visibleStart, visibleEnd + 1);
				const visibleSeries = fullSeries.map(item => ({
					...item,
					data: item.data.slice(visibleStart, visibleEnd + 1)
				}));
				chart.updateOptions({ xaxis: { categories }, series: visibleSeries }, false, true);
				if (controls) {
					const count = visibleEnd - visibleStart + 1;
					controls.querySelector('[data-dashboard-chart-action="zoom-in"]').disabled = count <= 1;
					controls.querySelector('[data-dashboard-chart-action="zoom-out"]').disabled = count >= monthLabels.length;
					controls.querySelector('[data-dashboard-chart-action="reset"]').disabled = count >= monthLabels.length;
				}
			};

			controls?.addEventListener("click", event => {
				const button = event.target.closest("[data-dashboard-chart-action]");
				if (!button || button.disabled) return;
				const action = button.dataset.dashboardChartAction;
				const count = visibleEnd - visibleStart + 1;
				if (action === "zoom-in") {
					const nextCount = Math.max(1, Math.floor(count / 1.5));
					const center = (visibleStart + visibleEnd) / 2;
					visibleStart = Math.max(0, Math.min(monthLabels.length - nextCount, Math.round(center - (nextCount - 1) / 2)));
					visibleEnd = visibleStart + nextCount - 1;
					applyVisibleRange();
				} else if (action === "zoom-out") {
					const nextCount = Math.min(monthLabels.length, Math.ceil(count * 1.5));
					const center = (visibleStart + visibleEnd) / 2;
					visibleStart = Math.max(0, Math.min(monthLabels.length - nextCount, Math.round(center - (nextCount - 1) / 2)));
					visibleEnd = visibleStart + nextCount - 1;
					applyVisibleRange();
				} else if (action === "reset") {
					visibleStart = 0;
					visibleEnd = monthLabels.length - 1;
					applyVisibleRange();
				} else if (action === "fullscreen" && card) {
					const expanded = card.classList.toggle("dashboard-chart-fullscreen");
					document.body.classList.toggle("dashboard-chart-open", expanded);
					button.title = expanded ? "Reducir" : "Ampliar";
					button.setAttribute("aria-label", button.title);
					button.innerHTML = `<i class="ti ${expanded ? "ti-minimize" : "ti-maximize"}"></i>`;
					chart.updateOptions({ chart: { height: expanded ? Math.max(420, window.innerHeight - 150) : 300 } });
					window.dispatchEvent(new Event("resize"));
				}
			});

			chart.render().then(() => {
				if (controls) {
					controls.querySelector('[data-dashboard-chart-action="zoom-in"]').disabled = monthLabels.length <= 1;
					controls.querySelector('[data-dashboard-chart-action="zoom-out"]').disabled = true;
					controls.querySelector('[data-dashboard-chart-action="reset"]').disabled = true;
				}
			});
		};

		document.addEventListener("keydown", event => {
			if (event.key !== "Escape") return;
			const openCard = document.querySelector(".dashboard-chart-fullscreen");
			if (!openCard) return;
			openCard.querySelector('[data-dashboard-chart-action="fullscreen"]')?.click();
		});

		renderOverviewChart("#revenue-chart", resp.data.line);
		renderOverviewChart("#receta-chart", resp.data.line_receta);
	});
});
