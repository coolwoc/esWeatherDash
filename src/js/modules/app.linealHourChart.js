import * as ELEMENTS from './app.elements';
import { Helpers } from './app.helpers';

export class linealHourChart {
    constructor (hours, dataHourly) {
        this.hours = hours;
        this.dataHourly = dataHourly;
    }
    renderChart(hrs, dataHourly) {
        // init variables with data
        let data = dataHourly;
        let datasetData = [];
        datasetData['Data'] = [];
        let xLabels = []; // xAxis labels

        // we filter array of data default 48 hours
        for (let i in data) {
            datasetData.Data.push({x: data[i].dt, y:data[i].temp}); // push data to dataset
            xLabels.push(Helpers.unixToDateTime(data[i].dt)); // push and format array for labels xAxis
        }

        const DATA = datasetData.Data; // dataset data

        // maping data accotding with the hrs
        let size = hrs; // max of data per/hrs 48 entries
        let items = DATA.slice(0, size).map(i => i); // dataset
        let itemLabels = xLabels.slice(0, size).map(i => i);

        let config = {
            type: 'line',
            data: {
                labels: itemLabels,
                datasets: [
                    {
                        label: '24hr Temperature Celsius',
                        data: items,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    }
                ]
            },
            options: {
                layout: {
                    padding: {
                      left: 0,
                      right: 0,
                      top: 80,
                      bottom: 0
                    }
                },
                events: [], // disables hover states
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                    labels: {
                        fontColor: '#fff'
                    }
                },
                scales: {
                    yAxes: [{
                        stacked: true,
                        display: false
                    }]
                },
                showAllTooltips: false,
                animation: { // add yValue on tooltip position
                    duration: 1,
                    onComplete: function(animation) {
                        let ctx = this.chart.ctx;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillStyle = '#ddd';
                        let chart = this; // window chart object
                        let dataSet = this.config.data.datasets; // catch values
                        dataSet.forEach(function(datasets, i) { 
                            chart.getDatasetMeta(i).data.forEach(function (p, j) {
                                ctx.fillText(datasets.data[j].y, p._model.x, p._model.y - 10);
                            });
                        })
                    }
                }
            }
        };

        // init element and create chart objct in DOM
        let ctx = ELEMENTS.ELEMENT_CHART_LINE;
        let lineChart = new Chart(ctx, config);
    }
}