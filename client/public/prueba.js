// Flot Pie Chart
$(function () {
    const data = [
        [1444878000000, '1'],
        [1475031600000, '43'],
        [1475895600000, '61'],
        [1476414000000, '23'],
        [1476500400000, '200'],
    ];
    const startDay = data[0][0];
    const newData = [data[0]];

    for (let i = 1; i < data.length; i++) {
        const d1 = data[i - 1][0];
        const d2 = data[i][0];
        const diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
        const startDate = new Date(data[i - 1][0]);
        if (diff > 1) {
            for (j = 0; j < diff - 1; j++) {
                const fillDate = new Date(startDate).setDate(startDate.getDate() + (j + 1));
                newData.push([fillDate, 0]);
            }
        }
        newData.push(data[i]);
    }

    const d = newData;
    const options = {
        xaxis: {
            mode: 'time',
            minTickSize: [0, 'day'],
        },
        series: {
            lines: {
                show: true,
            },
            points: {
                show: true,
            },
        },
        grid: {
            hoverable: true, // IMPORTANT! this is needed for tooltip to work
        },
        tooltip: true,
        tooltipOpts: {
            content: ' %x hubieron %y respuestas',
            shifts: {
                x: -60,
                y: 25,
            },
        },
    };

    $.plot('#flot-line-chart', [d], options);
});
