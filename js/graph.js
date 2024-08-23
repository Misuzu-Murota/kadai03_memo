// URLパラメータから日付、気温、気分データを取得
const urlParams = new URLSearchParams(window.location.search);
const dates = urlParams.get('dates').split(',');
const temperatures = urlParams.get('temperatures').split(',').map(Number);
const moods = urlParams.get('moods').split(',').map(Number);

// 気温グラフの作成
var ctxTemp = document.getElementById('temperatureChart').getContext('2d');
var temperatureChart = new Chart(ctxTemp, {
    type: 'line',
    data: {
        labels: dates, // X軸に日付を表示
        datasets: [{
            label: '気温 (℃)',
            data: temperatures,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1, // 滑らかな線
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                min: 20,
                max: 40,
                title: {
                    display: true,

                    text: '気温 (℃)'
                }
            }
    }
}
});

// 気分グラフの作成
var ctxMood = document.getElementById('moodChart').getContext('2d');
var moodChart = new Chart(ctxMood, {
    type: 'line',
    data: {
        labels: dates, // X軸に日付を表示
        datasets: [{
            label: '気分',
            data: moods,
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0, // 直線に設定
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                min: -1,
                max: 3,
                title: {
                    display: true,
                    text: '気分'
                },
                ticks: {
                    stepSize: 1,
                    callback: function(value) {
                        const moodLabels = ['悪い', '普通', '良い'];
                        return moodLabels[value];
                    }
                }
            }
        }
    }
});