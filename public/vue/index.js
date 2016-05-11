var base = +new Date(1968, 9, 3);
var oneDay = 24 * 3600 * 1000;
var date = [];

var data = [Math.random() * 300];

for (var i = 1; i < 20000; i++) {
    var now = new Date(base += oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-'));
    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
}


// 基于准备好的dom，初始化echarts实例
var $chart = document.querySelector('.chart');
var myChart = echarts.init($chart);
myChart.showLoading();

var url = 'http://192.168.100.41:3000/';

var vm = new Vue({
  ready: function() {
    var resource = this.$resource(url + 'api/list/');

    resource.get({}).then(function(response) {
      this.$set('list', response.data.list);
      this.$set('count', response.data.count);
      showChart();
    });
  },
  el: '#app',
  data: {
    btns: {
      timeBtn: {
        active: 0,
        title: ['今天', '昨天', '近一周', '近一个月']
      },
      typeBtn: {
        active: 0,
        title: ['浏览量(PV)', '访客数(UV)']
      }
    }
  },
  methods: {
    toString: function(data) {
      return JSON.stringify(data);
    }
  }
});

vm.$watch('btns.timeBtn.active', function (newVal, oldVal) {
  myChart.setOption({
    xAxis: {
      data: date
    },
    yAxis: {},
    series: [{
      name: '统计',
      type: 'line',
      data: [5, 20, 36, 10, 10, 20, 36, 10, 10]
    }]
  });
});
vm.$watch('btns.typeBtn.active', function (newVal, oldVal) {
  myChart.setOption({
    xAxis: {
      data: date
    },
    yAxis: {},
    series: [{
      name: '统计',
      type: 'line',
      data: [5, 20, 36, 10, 10, 20, 20, 36]
    }]
  });
});

function showChart() {
  var option = {
    title: {
      left: 'center',
      text: '统计数据'
    },
    legend: {
      top: 'bottom',
      data: ['统计']
    },
    toolbox: {
      show: true,
      feature: {
        magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: {
      data: date
    },
    yAxis: {},
    series: [{
      name: '统计',
      type: 'line',
      data: [5, 20, 36, 10, 10, 20]
    }]
  };
  myChart.setOption(option);
  myChart.hideLoading();
}


