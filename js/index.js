'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// REACT JS SCORE BOARD APP

// declare variables to be used in httprequest and react code
var myRecentJson;
var myAllTimeJson;
var myData;

var usernameArray, allTimeUserNameArray;
var recentScore, allTimeScore;
var userImg, allTimeUserImg;

//get json for scoreboard
var httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = getScores;

httpRequest.open('GET', 'https://fcctop100.herokuapp.com/api/fccusers/top/recent', true);
httpRequest.send(null);

function getScores(data) {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    myData = data.currentTarget.response;
    myRecentJson = JSON.parse(myData);

    // arrays organized by recent score
    usernameArray = myRecentJson.map(function (x) {
      return x.username;
    });
    recentScore = myRecentJson.map(function (x) {
      return x.recent;
    });
    userImg = myRecentJson.map(function (x) {
      return x.img;
    });

    // JSON object organized by highest all time score
    myAllTimeJson = myRecentJson.sort(function (a, b) {
      return b.alltime - a.alltime;
    });

    // arrays organized by all time score
    allTimeUserNameArray = myAllTimeJson.map(function (x) {
      return x.username;
    });
    allTimeScore = myAllTimeJson.map(function (x) {
      return x.alltime;
    });
    allTimeUserImg = myAllTimeJson.map(function (x) {
      return x.img;
    });

    // call react code to render and display arrays
    reactJScode();
  } else {
    reactJScode(); // call react code to display 'loading'
  }
}

function reactJScode() {
  var ScoreBoard = function (_React$Component) {
    _inherits(ScoreBoard, _React$Component);

    function ScoreBoard(props) {
      _classCallCheck(this, ScoreBoard);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

      _this.state = { sortByAllTime: false };
      _this.toggleList = _this.toggleList.bind(_this);
      return _this;
    }

    // create JSX elements from recent arrays to be rendered

    ScoreBoard.prototype.createRecentList = function createRecentList() {
      var listArr = [];
      for (var i = 0; i < 100; i++) {

        listArr.push(React.createElement(
          'div',
          { 'class': 'container' },
          React.createElement(
            'li',
            { key: usernameArray[i], className: 'user-list' },
            React.createElement('img', { src: userImg[i], className: 'user-img' }),
            React.createElement(
              'h3',
              { className: 'user-name' },
              usernameArray[i]
            ),
            React.createElement(
              'p',
              { className: 'user-score' },
              React.createElement(
                'a',
                { href: 'https://www.freecodecamp.com/' + usernameArray[i], target: '_blank' },
                recentScore[i]
              )
            )
          )
        ));
      }

      return listArr;
    };

    // create JSX elements from all time arrays to be rendered

    ScoreBoard.prototype.createAllTimeList = function createAllTimeList() {
      var listArr = [];
      for (var i = 0; i < 100; i++) {
        listArr.push(React.createElement(
          'li',
          { key: allTimeUserNameArray[i], className: 'user-list' },
          React.createElement('img', { src: allTimeUserImg[i], className: 'user-img' }),
          React.createElement(
            'h3',
            { className: 'user-name' },
            allTimeUserNameArray[i]
          ),
          React.createElement(
            'p',
            { className: 'user-score' },
            React.createElement(
              'a',
              { href: 'https://www.freecodecamp.com/' + allTimeUserNameArray[i], target: '_blank' },
              allTimeScore[i]
            )
          )
        ));
      }

      return listArr;
    };

    // change state to display list of all time vs recent scores

    ScoreBoard.prototype.toggleList = function toggleList() {
      this.setState(function (prevState) {
        return {
          sortByAllTime: !prevState.sortByAllTime
        };
      });
    };

    //based on conditions, render appropriate elements

    ScoreBoard.prototype.render = function render() {
      if (myData == '') {
        //error in connection

        return React.createElement(
          'div',
          null,
          React.createElement(
            'p',
            null,
            'Something went wrong, please check your connection!'
          )
        );
      } else if (myData == undefined) {
        // waiting on http request update
        return React.createElement(
          'div',
          { className: 'center' },
          React.createElement(
            'h4',
            null,
            'Leaderboard loading'
          )
        );
      } else if (this.state.sortByAllTime === false) {
        // display recent scores based on state
        return React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            { onClick: this.toggleList },
            'Recent Score'
          ),
          React.createElement(
            'ol',
            null,
            this.createRecentList()
          )
        );
      } else if (this.state.sortByAllTime === true) {
        // display all time scores based on state
        return React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            { onClick: this.toggleList },
            'All Time'
          ),
          React.createElement(
            'ol',
            null,
            this.createAllTimeList()
          )
        );
      }
    };

    return ScoreBoard;
  }(React.Component);

  ReactDOM.render(React.createElement(ScoreBoard, null), document.getElementById('root'));
}