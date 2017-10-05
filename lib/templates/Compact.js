'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Default2 = require('./Default');

var _Default3 = _interopRequireDefault(_Default2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Simple, slimline template based on https://github.com/rackt/react-router/blob/master/CHANGES.md

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var Compact = (function (_Default) {
  _inherits(Compact, _Default);

  function Compact() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, Compact);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Compact)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.mergesTitle = null, _this.fixesTitle = null, _this.commitsTitle = null, _this.minimumChangeCount = 3, _this.listSpacing = '\n', _this.renderReleaseHeading = function (release, previousRelease) {
      var title = _this.renderReleaseTitle(release, previousRelease);
      var date = release.tag ? '\n> ' + _this.formatDate(release.date) : '';
      return '#### ' + title + date + '\n';
    }, _this.formatDate = function (string) {
      var date = new Date(string);
      var day = date.getDate();
      var month = months[date.getMonth()];
      var year = date.getFullYear();
      return day + ' ' + month + ' ' + year;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return Compact;
})(_Default3.default);

exports.default = Compact;