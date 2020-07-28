import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import wordCount from 'html-word-count';
import ProfilePhoto from '../ProfilePhoto';// profile picture
import { Twitter, In, Fb, SaveWhite, SaveBlack  } from './Icons';
import './index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      subtitle: "",
      content: "",
      tags: "",
      created: "",
      licensing: "standard",
      saved: false,
      storyPropties: false
    };
  };
  node = React.createRef();
  handleRef = node => this.node = node;
  componentDidMount() {
    const hoomerStories = ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
      JSON.parse(localStorage.getItem("hoomer-stories"))
    ):[]);
    if (hoomerStories.find(st => st.id === this.props.match.params.postID)) {
      hoomerStories.map(storie => {
        if (storie.id === this.props.match.params.postID) {
          return this.setState({
            id: storie.id,
            title: storie.title,
            subtitle: storie.subtitle,
            content: storie.content,
            tags: storie.tags,
            created: storie.created,
            licensing: storie.licensing,
            public: storie.public,
          });
        } return storie;
      });
    } else if (this.props.location.pathname !== "/new-story" && hoomerStories.find(st => st.id !== this.props.match.params.postID)) {
      this.props.history.push("/");
    }
  };
  UNSAFE_componentWillMount() {
    document.addEventListener('mousedown', this.handleCloseProperties, false);
  };
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleCloseProperties, false);
  };
  handleDateCreated = date => {
    const month = parseInt(date.substring(0, 2));
    const day = parseInt(date.substring(3, 5));    
    if (month === 1) return "January " + day;
    if (month === 2) return "February " + day;
    if (month === 3) return "March " + day;
    if (month === 4) return "April " + day;
    if (month === 5) return "May " + day;
    if (month === 6) return "June " + day;
    if (month === 7) return "July " + day;
    if (month === 8) return "August " + day;
    if (month === 9) return "September " + day;
    if (month === 10) return "October " + day;
    if (month === 11) return "November " + day;
    if (month === 12) return "December " + day;
    return null;
  };
  handleCalculateWordsPerMinutes = words => {
    const decimal = words / 200;
    const position = decimal.toString().indexOf(".");
    const leftNum = decimal.toString().substr(0, position);
    const rightNum = decimal.toString().substr(position + 1, decimal.toString().length);
    const calcSecond = (parseInt(rightNum) * 0.60).toString().substring(2, 4);
    let wordsPerMinutes;
    if (parseInt(calcSecond) > 30) {
      wordsPerMinutes = parseInt(leftNum) + 1;
    } else {
      wordsPerMinutes = parseInt(leftNum);
    }
    if (wordsPerMinutes === 0) {
      wordsPerMinutes = 1;
    } return wordsPerMinutes;
  };
  handleChangeColor = () => this.setState(st => ({ saved: !st.saved }) );
  handleShowProperties = () => this.setState({ storyPropties: true });
  handleCloseProperties = e => {
    if (this.node === null) return null;
    if (this.node.contains(e.target) === false) {
      return this.setState({ storyPropties: false });
    } return null;
  };
  handleProfileRoute = () => this.props.history.push("/me/profile");
  render() {
    const storage = (((JSON.parse(window.localStorage.getItem("settings") || "null")) !== null) ? (
      JSON.parse(window.localStorage.getItem("settings") || "")
    ):"");
    if (this.state.public === false) return (
      <div className="page-404">
        <h1>404 Page Not Found!</h1>
      </div>
    );
    return (
      <div className="page-story">
        {/* Story title */}
        <h2 className="">{this.state.title}</h2>
        {/* User */}
        <div className="user-info">
          {/* img */}
          <div className="user-info-container">
            <Link className="ProfilePhoto-link" to="/me/profile">
              <ProfilePhoto />
            </Link>
            <div className="profile-outils">
              <div className="profile-name" onClick={this.handleProfileRoute}>
                <Link to="/me/profile">{storage.name}</Link>
              </div>
              <div className="profile-date">
                <span>{this.handleDateCreated(this.state.created)}</span>
                <span className="circle"></span>
                <span>{this.handleCalculateWordsPerMinutes(wordCount(this.state.content))} min read</span>
              </div>
            </div>
          </div>
          <div className="profile-social">
            <div className="twitter"><Twitter /></div>
            <div className="in"><In /></div>
            <div className="fb"><Fb /></div>
            <div className="save" onClick={this.handleChangeColor}>
              {this.state.saved ? <SaveBlack />: <SaveWhite />}
            </div>
            <div className="story-points" onClick={this.handleShowProperties} ref={this.handleRef}>
              <span className="point"></span>
              <span className="point"></span>
              <span className="point"></span>
              {this.state.storyPropties ? (
                <div className="story-properties">
                  <Link to={`/p/${this.props.match.params.postID}/edit`}>Edit story</Link>
                  <Link to={`/p/${this.props.match.params.postID}/settings`}>Story settings</Link>
                </div>
              ):null}
            </div>
          </div>
        </div>
        {/* Story content */}
        <div className="">{ReactHtmlParser(this.state.content)}</div>
        {/* Story tags */}
        {this.state.tags instanceof Array ? (
          this.state.tags.map(tag => <span key={tag} className="page-story-tag">{tag}</span>)
        ):<div className="">{this.state.tags}</div>}
      </div>
    );
  };
};

export default App;
