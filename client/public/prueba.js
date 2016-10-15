// Flot Pie Chart
$(function () {
    const data = [{
        label: 'Series 0',
        data: 1,
    }, {
        label: 'Series 1',
        data: 3,
    }, {
        label: 'Series 2',
        data: 9,
    }, {
        label: 'Series 3',
        data: 20,
    }, {
        label: 'Series 4',
        data: 30,
    },
  ];

    const plotObj = $.plot($('#flot-pie-chart'), data, {
        series: {
            pie: {
                show: true,
            },
        },
        grid: {
            hoverable: true,
        },
        tooltip: true,
        tooltipOpts: {
            content: '%p.0%, %s', // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0,
            },
            defaultTheme: false,
        },
    });
});
