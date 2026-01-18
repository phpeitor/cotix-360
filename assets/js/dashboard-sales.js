document.addEventListener("DOMContentLoaded", function () {
  fetch("controller/dashboard_graf.php")
    .then(res => res.json())
    .then(resp => {
      if (resp.error) return;

      const donut = resp.data.donut;
	  const STATUS_COLORS = {
		Enviada:  "#6C757D",
		Aprobada: "#53cd48ff",
		Anulada:  "#ce7e7e"
	  };

	  const total = donut.reduce((sum, i) => sum + Number(i.ctd), 0);
	  const series = donut.map(i =>
		total > 0 ? Math.round((i.ctd / total) * 100) : 0
		);

	  const labels = donut.map(i => i.estado);

      const chartColors = donut.map(i =>
		STATUS_COLORS[i.estado] || "#999999"
		);

      const chart = new ApexCharts(
        document.querySelector("#multiple-radialbar"),
        {
          chart: { height: 330, type: "radialBar" },
          plotOptions: {
           radialBar: {
				track: { margin: "17%" },
				hollow: { size: "1%" },
				dataLabels: {
				name: {
					show: true
				},
				value: {
					show: true,
					formatter: val => `${val}%`
				}
				}
			}
          },
          stroke: { lineCap: "round" },
          colors: chartColors,
          series: series,
          labels: labels
        }
      );

      chart.render();

      /* ======================
         LEGEND / LISTADO
      ====================== */

      const legend = document.getElementById("donut-legend");
      legend.innerHTML = "";

      donut.forEach((item, index) => {
        const color = STATUS_COLORS[item.estado] || "#999";

        legend.innerHTML += `
          <div class="d-flex justify-content-between align-items-center p-1">
            <div>
              <i class="ti ti-circle-filled fs-12 align-middle me-1"
           		style="color:${color}"></i>
              <span class="align-middle fw-semibold">${item.estado}</span>
            </div>
            <span class="fw-semibold text-muted float-end">
              ${item.ctd}
            </span>
          </div>
        `;
      });

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
