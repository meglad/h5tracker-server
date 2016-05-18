var $chart = document.querySelector('.chart');
var myChart = echarts.init($chart);

var records = {}; // key : []
var timer;
var vm = new Vue({
  ready: function() {
    var _this = this;
    _this.http(true);
    refresh();
    // 自动刷新页面
    function refresh() {
      if (timer) {
        return;
      }
      timer = setTimeout(function() {
        timer = null;
        _this.http();
        refresh();
      }, _this.refreshTime * 1000);
    }
  },
  el: '#app',
  data: {
    refreshTime: 5, //页面自动刷新时间 单位s
    isPop: true, //是否显示弹层
    // timeBtns: [],
    // typeBtns: [
    //   { title: '浏览量(PV)', value: 'pv' },
    //   { title: '访客数(UV)', value: 'uv' }
    // ],
    // timeBtnsIndex: 0,
    // typeBtnsIndex: 0
  },
  methods: {
    http: function(isOne) {
      if (isOne) {
        myChart.showLoading();
      }
      // 请求数据
      var getUrl = [
        '/api',
        'pv-uv', // 查询类型
        '1', // 查询天数
        '600' // 间隔时间
      ].join('/');
      var self = this;
      this.$http(getUrl).then(function(response) {
        var reply = response.data;
        // 时间戳转日期
        reply.xData.forEach(function(item, index) {
          var date = new Date(item);
          reply.xData[index] = (date.getMonth() + 1) + '月' + date.getDate() + '日';
          reply.xData[index] += [
            String(100 + date.getHours()).slice(1),
            String(100 + date.getMinutes()).slice(1)
          ].join(':');
        });
        // 更新显示
        if (isOne) {
          var options = _getOpts(reply.xData, null, {
            uv: reply.uv,
            pv: reply.pv
          });
        } else {
          var options = {
            xAxis: {
              data: reply.xData
            },
            series: [{ data: reply.uv }, { data: reply.pv }]
          };
        }
        myChart.setOption(options);
        myChart.hideLoading();
      }, function(response) {
        self.isPop = true;
        myChart.hideLoading();
      });
    }
  }
});

// vm.$watch('timeBtnsIndex', function(newVal, oldVal) {
//   this.http();
// });

// vm.$watch('typeBtnsIndex', function(newVal, oldVal) {
//   this.http();
// });

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
