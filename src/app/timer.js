export default class Timer {
  constructor(duration) {
    this.timer = duration * 60;
    this.minutes = `0${duration}`;
    this.seconds = '00';
  }

  start() {
    var _this = this;

    var interval = setInterval(function () {
      _this.minutes = parseInt(_this.timer / 60, 10)
      _this.seconds = parseInt(_this.timer % 60, 10);

      _this.minutes = _this.minutes < 10 ? '0' + _this.minutes : _this.minutes;
      _this.seconds = _this.seconds < 10 ? '0' + _this.seconds : _this.seconds;

      if (--_this.timer < 0) {
        _this.timer = 0;
        clearInterval(interval);
      }
    }, 1000);
  }
}
