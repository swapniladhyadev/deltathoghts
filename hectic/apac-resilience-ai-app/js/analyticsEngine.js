/**
 * Analytics Engine & Chart Visualizer (Chart.js)
 * APAC-Resilience AI Platform - Bay of Bengal
 */

window.AnalyticsEngine = (function() {
  'use strict';

  let surgeChart = null;
  let exposureChart = null;

  function initCharts() {
    initSurgeHydrodynamicChart();
    initExposureCategoryChart();
  }

  function initSurgeHydrodynamicChart() {
    const canvas = document.getElementById('surgeHydrochart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (surgeChart) surgeChart.destroy();

    surgeChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['T-72h', 'T-60h', 'T-48h', 'T-36h', 'T-24h', 'T-12h', 'Landfall (T-0)', 'T+12h'],
        datasets: [
          {
            label: 'Surge Height (m)',
            data: [0.8, 1.2, 1.9, 2.6, 3.4, 3.9, 4.2, 2.1],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            fill: true,
            tension: 0.4,
            yAxisID: 'ySurge'
          },
          {
            label: 'Wind Speed (km/h)',
            data: [95, 115, 140, 160, 175, 188, 195, 85],
            borderColor: '#f43f5e',
            borderDash: [4, 4],
            fill: false,
            tension: 0.3,
            yAxisID: 'yWind'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8' }
          },
          ySurge: {
            type: 'linear',
            position: 'left',
            title: { display: true, text: 'Surge (m)', color: '#06b6d4' },
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#06b6d4' }
          },
          yWind: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: 'Wind (km/h)', color: '#f43f5e' },
            grid: { drawOnChartArea: false },
            ticks: { color: '#f43f5e' }
          }
        }
      }
    });
  }

  function initExposureCategoryChart() {
    const canvas = document.getElementById('exposureChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (exposureChart) exposureChart.destroy();

    exposureChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Agricultural Paddy', 'Aquaculture & Salt Pans', 'Coastal Households', 'Embankments & Dykes', 'Public Infrastructure'],
        datasets: [{
          data: [42, 23, 18, 11, 6],
          backgroundColor: [
            '#10b981',
            '#06b6d4',
            '#f59e0b',
            '#f43f5e',
            '#8b5cf6'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
          }
        }
      }
    });
  }

  function updateChartsWithSimulation(surgeM, windKmh) {
    if (surgeChart) {
      const surgeData = [
        0.5,
        Math.max(0.7, surgeM * 0.3),
        Math.max(1.1, surgeM * 0.5),
        Math.max(1.8, surgeM * 0.7),
        Math.max(2.4, surgeM * 0.85),
        Math.max(3.0, surgeM * 0.95),
        surgeM,
        Math.max(0.8, surgeM * 0.4)
      ];
      surgeChart.data.datasets[0].data = surgeData;
      surgeChart.update();
    }
  }

  return {
    initCharts: initCharts,
    updateChartsWithSimulation: updateChartsWithSimulation
  };
})();
