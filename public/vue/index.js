// 基于准备好的dom，初始化echarts实例
var $chart = document.querySelector('.chart');
var myChart = echarts.init($chart);

var vm = new Vue({
  ready: function() {
    this.http();
  },
  el: '#app',
  data: {
    // timeBtns: [],
    // typeBtns: [
    //   { title: '浏览量(PV)', value: 'pv' },
    //   { title: '访客数(UV)', value: 'uv' }
    // ],
    // timeBtnsIndex: 0,
    // typeBtnsIndex: 0
  },
  methods: {
    toString: function(data) {
      return JSON.stringify(data);
    },
    http: function() {
      myChart.showLoading();
      // 请求数据
      var getUrl = [
        '/api',
        'pv-uv', // 查询类型
        '1', // 查询天数
        '600' // 间隔时间
      ].join('/');
      this.$http(getUrl).then(function(response) {
        var reply = response.data;
        // 时间戳转日期
        reply.xData.map(function(item, index) {
          var date = new Date(item);
          reply.xData[index] = date.getMonth() + 1 + '月' + date.getDate() + '日' + [date.getHours(), date.getMinutes()].join(':');
        });
        // 更新显示
        var options = _getOpts(reply.xData, null, {
          uv: reply.uv,
          pv: reply.pv
        });
        myChart.setOption(options);
        myChart.hideLoading();
      }, function(response) {
        alert('数据获取失败');
        myChart.hideLoading();
      });
    }
  }
});

vm.$watch('timeBtnsIndex', function(newVal, oldVal) {
  this.http();
});

vm.$watch('typeBtnsIndex', function(newVal, oldVal) {
  this.http();
});

function _getOpts(x, y, data) {
  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['uv统计', 'pv统计']
    },
    dataZoom: [{
      show: true,
      y: '92%',
      start: 94,
      end: 100
    }],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: x || []
    },
    yAxis: {},
    series: [{
      name: 'uv统计',
      type: 'line',
      itemStyle: {
        normal: {
          color: 'rgb(150, 200, 180)'
        }
      },
      areaStyle: { normal: {} },
      data: data.uv
    }, {
      name: 'pv统计',
      type: 'line',
      sampling: 'average',
      itemStyle: {
        normal: {
          color: 'rgb(210, 100, 130)'
        }
      },
      data: data.pv
    }]
  };
}
