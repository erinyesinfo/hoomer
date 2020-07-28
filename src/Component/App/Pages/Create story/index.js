import React, { Component } from 'react';
import uuid from 'uuid/dist/v4';
import { Link } from 'react-router-dom';
import CKEditor from "react-ckeditor-component";
import sanitizeHTML from "sanitize-html";
import htmlToText from "html-to-text";
import Tag from './Tag';
import { Hoomer } from "../../Logo"; // logo
import ProfilePhoto from '../ProfilePhoto';// profile picture
import "./index.css";

// Public Modal
import PublicModal from './Modal';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // stories
      hoomerStories: ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
        JSON.parse(localStorage.getItem("hoomer-stories"))
      ):[]),
      id: '',
      content: "",
      editor: ((JSON.parse(localStorage.getItem("settings") || "null") !== null) ? (
        JSON.parse(localStorage.getItem("settings")).editor
      ):""),
      saved: false,
      stop: 0,
      isChangeTitle: false,
      isChangeTags: false,
      preview: false,
      titleIsFocus: false,
      subtitleIsFocus: false,
      // inputs title value
      title: "",
      subtitle: '',
      // textarea tag value
      tag: '',
      tags: [],
      created: "",
      licensing: "",
      public: false,
      isUserDropDown: false,
      isEditDropDown: false,
      // modal
      showPublicModal: false,
      showPreviewModal: false,
    };
  };
  node = React.createRef();
  mode = React.createRef();
  componentDidMount() {
    const storageData = ((JSON.parse(localStorage.getItem("settings") || "null") !== null) ? (
      JSON.parse(localStorage.getItem("settings"))
    ):"");
    if (storageData === "" && storageData.editor === "") { this.setState({ editor: "standard" }); }

    const hoomerStories = ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
      JSON.parse(localStorage.getItem("hoomer-stories"))
    ):"");
    if (hoomerStories !== "" && hoomerStories.find(st => st.id === this.props.match.params.title)) {
      hoomerStories.map(storie => {
        if (storie.id === this.props.match.params.title) {
          return this.setState({
            id: storie.id,
            title: storie.title,
            subtitle: storie.subtitle,
            content: storie.content,
            tags: storie.tags,
            created: storie.created,
            licensing: storie.licensing,
            public: storie.public,
            saved: true,
          });
        } return storie;
      });
    } else if (this.props.location.pathname !== "/new-story" && hoomerStories.find(st => st.id !== this.props.match.params.title)) {
      this.props.history.push("/");
    }
    const timeout = setTimeout(() => {
      const element = document.getElementById("cke_45"); // standard ckedit
      const advanceElement = document.getElementById("cke_88"); // advance ckeditor
      if (element) {
        element.style.display = "none";
      }
      if (advanceElement) {
        advanceElement.style.display = "none";
      }
      this.totalPageHeight();
      clearTimeout(timeout);
    }, 800);
  };
  UNSAFE_componentWillMount() {
    document.addEventListener('mousedown', this.handleCloseUserDropDown, false);
    document.addEventListener('mousedown', this.handleCloseEditDropDown, false);
    window.addEventListener('resize', this.totalPageHeight);
  };
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleCloseUserDropDown, false);
    document.removeEventListener('mousedown', this.handleCloseEditDropDown, false);
    window.removeEventListener('resize', this.totalPageHeight);
  };
  totalPageHeight = () => {
    var bodyChildren = (document.getElementsByTagName('body')[0]).children;
    var totalHeight = 0;
    
    // Loop through the selected elements
    for (var i = 0; i < bodyChildren.length; i++) {
      // Add the height of this element
      totalHeight = totalHeight + bodyChildren[i].offsetHeight;
    }
    const editor = document.getElementById("cke_1_contents");
    if (editor) {
      editor.style.height = ((window.innerHeight - totalHeight) + editor.offsetHeight - 20) + "px";
    }    
    return totalHeight;
  };
  handleEditRef = node => this.node = node;
  handleUserRef = mode => this.mode = mode;
  handleShowUserDropDown = e => {
    const storagePhoto = document.getElementById("storage-upload-photo");
    if (e.target.id !== "") {
      const target = document.getElementById(e.target.id);
      if (target === storagePhoto && this.state.isUserDropDown === false) {
        return this.setState({ isUserDropDown: true });
      }
    }
    const man = document.getElementById("man-svg");
    const man_Path = document.getElementById("man-path");
    if ((e.target === man_Path || e.target === man) && this.state.isUserDropDown === false) {
      return this.setState({ isUserDropDown: true });
    } return null;
  };
  handleCloseUserDropDown = e => {
    if (this.mode === null) return null;
    if (this.mode.contains(e.target) === false) {
      if (document.getElementById('dropdown')) {
        document.getElementById('dropdown').classList.add('user-dropdown-close');
      }
      const timeOut = setTimeout(() => {
          this.setState({ isUserDropDown: false });
          return clearTimeout(timeOut);
      }, 500);
      return null;
    } return null;
  };
  handleShowEditDropDown = e => {
    const threedots = document.getElementById("threedots");
    if (e.target === threedots && this.state.isEditDropDown === false) {            
      return this.setState({ isEditDropDown: true });
    } else if (e.target === threedots && this.state.isEditDropDown) {
      return this.setState({ isEditDropDown: false });
    } return null;
  };
  handleCloseEditDropDown = e => {
    if (this.node === null) return null;
    if (this.node.contains(e.target) === false) {      
      if (this.state.isChangeTitle) {
        return this.setState({ isEditDropDown: false }, this.handleCloseTitle);
      } else if (this.state.isChangeTags) {
        return this.setState({ isEditDropDown: false }, this.handleCloseTags);
      } return this.setState({ isEditDropDown: false });
    } return null;
  };
  // title
  handleChangeTitle = () => this.setState({ isChangeTitle: true });
  handleCloseTitle = () => {
    const hoomerStorage = ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
      JSON.parse(localStorage.getItem("hoomer-stories"))
    ):"");
    if (hoomerStorage !== "" && hoomerStorage.find(st => st.id === this.props.match.params.title && st.title !== this.state.title)) {
      if (hoomerStorage !== "" && hoomerStorage.find(st => st.id === this.props.match.params.title && st.subtitle !== this.state.subtitle)) {
        this.setState({ subtitle: hoomerStorage.find(st => st.id === this.props.match.params.title).subtitle });
      } return this.setState({
        title: hoomerStorage.find(st => st.id === this.props.match.params.title).title,
        isChangeTitle: false,
        subtitleIsFocus: false
      });
    } else if (hoomerStorage !== "" && hoomerStorage.find(st => st.id === this.props.match.params.title && st.subtitle !== this.state.subtitle)) {
      return this.setState({
        subtitle: hoomerStorage.find(st => st.id === this.props.match.params.title).subtitle,
        isChangeTitle: false,
        subtitleIsFocus: false
      });
    } return this.setState({ isChangeTitle: false, subtitleIsFocus: false });
  };
  // tags
  handleChangeTags = () => this.setState({ isChangeTags: true });
  handleCloseTags = () => {
    const hoomerStorage = ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
      JSON.parse(localStorage.getItem("hoomer-stories"))
    ):"");
    if (hoomerStorage !== ""
    && hoomerStorage.find(st => st.id === this.props.match.params.title && st.tags !== this.state.tags)
    ) {
      return this.setState({
        tags: hoomerStorage.find(st => st.id === this.props.match.params.title).tags,
        tag: '',
        isChangeTags: false
      });
    } return this.setState({ isChangeTags: false, tag: '' });
  };

  handleTitleFocus = () => this.setState({ titleIsFocus: true });
  handleTitleBlur = () => this.setState({ titleIsFocus: false });
  handleSubtitleFocus = () => this.setState({ subtitleIsFocus: true });
  handleSubtitleBlur = () => this.setState({ subtitleIsFocus: false });
  handleChange = e => {
    const value = e.target.value.replace(/(\r\n|\n|\r)/gm, "");
    const sanitizeValue = sanitizeHTML(value.replace(/ +/g, ' '), {allowedTags: [], allowedAttributes: {}});
    if (sanitizeValue.substring(0, 1) === " ") {// first character is whitespace
      const removeSpaceAtBeginning = sanitizeValue.charAt(0).replace(" ", "") + sanitizeValue.slice(1);
      return this.setState({
        [e.target.name]: removeSpaceAtBeginning.replace(/\/|\\/g, "")
      });
    }
    return this.setState({ [e.target.name]: sanitizeValue.replace(/\/|\\/g, "") });
  };
  handleEscape = e => (e.keyCode === 27 || e.which === 27) ? this.handleCloseTitle():null;
  handleSubmit = e => {// change title or subtitle form
    e.preventDefault();
    let d = new Date(), hours = d.getHours(), minutes = d.getMinutes();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 1!
    var yyyy = today.getFullYear();

    if (dd<10) dd = '0'+dd
    if (mm<10) mm = '0'+mm

    if (hours < 10) { hours = '0' + hours}
    if (minutes < 10) { minutes = '0' + minutes}

    const day = mm + '-' + dd + '-' + yyyy;
    const time = `${hours}:${minutes} H/MN`;
    // title is not "/new-story"
    if (this.state.title.length > 0) {
      const hoomerStorage = ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
        JSON.parse(localStorage.getItem("hoomer-stories"))
      ):"");
      if (hoomerStorage !== "" && hoomerStorage.find(st => st.id === this.props.match.params.title)
      && hoomerStorage.find(st => st.title === this.state.title)
      && hoomerStorage.find(st => st.subtitle === this.state.subtitle)) {
        return this.handleCloseTitle();
      }
      const { params } = this.props.match;
      const storyId = params.title.substring(params.title.length - 12, params.title.length); // old storynumber
      return this.setState({
        id: `${this.state.title}-${storyId}`, // if old title is not the same
        title: this.state.title,
        subtitle: this.state.subtitle,
        hoomerStories: this.state.hoomerStories.map(storie => {
          if (storie.id === this.props.match.params.title) {
            return { ...storie, id: `${this.state.title}-${storyId}`, title: this.state.title, subtitle: this.state.subtitle, day, time };
          } return storie;
        })
      }, () => {
        // save to localstorage
        localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories));
        this.props.history.push(`/p/${this.state.title}-${storyId}/edit`);
        return this.handleCloseTitle();
      });
    } return null; // A story can’t be saved without a title.
  };
  handleEnterTags = e => {
    if (e.keyCode === 13 || e.which === 13) {
      const value = e.target.value;
      const duplicate = this.state.tags.find(tag => tag === value);
      if (this.state.tags.length > 4 || duplicate) return null;
      this.setState(st => ({ tag: '', tags: [ ...st.tags, value ] }) );
    } else if (e.keyCode === 27 || e.which === 27) {
      return this.handleCloseTags();
    } return null;
  };
  handleRemoveTag = Tag => this.setState({ tags: this.state.tags.filter(tag => tag !== Tag) });
  handleSubmitTags = e => {
    e.preventDefault();
    let d = new Date(), hours = d.getHours(), minutes = d.getMinutes();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd<10) dd = '0'+dd
    if (mm<10) mm = '0'+mm

    if (hours < 10) { hours = '0' + hours}
    if (minutes < 10) { minutes = '0' + minutes}

    const day = mm + '-' + dd + '-' + yyyy;
    const time = `${hours}:${minutes} H/MN`;
    const hoomerStorage = ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
      JSON.parse(localStorage.getItem("hoomer-stories"))
    ):"");
    if (hoomerStorage !== "" && hoomerStorage.find(st => st.id === this.props.match.params.title && st.tags === this.state.tags)) return null;
    return this.setState({
      hoomerStories: this.state.hoomerStories.map(storie => {
        if (storie.id === this.props.match.params.title) {
          return { ...storie, tags: this.state.tags, day, time };
        } return storie;
      })
    }, () => {
      window.localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories));
      // save to localstorage
      return this.handleCloseTags();
    });
  };
  onChange = (evt) => {
    let d = new Date(), hours = d.getHours(), minutes = d.getMinutes();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd<10) dd = '0'+dd
    if (mm<10) mm = '0'+mm

    if (hours < 10) { hours = '0' + hours}
    if (minutes < 10) { minutes = '0' + minutes}

    const day = mm + '-' + dd + '-' + yyyy;
    const time = `${hours}:${minutes} H/MN`;
    if (this.props.location.pathname === "/new-story") {
      const timeout = setTimeout(() => {// wait 2 second and save to new story page
        const storyId = uuid().substring(uuid().length - 12, uuid().length);
        // conver from html to string and replace any new line
        const titleValue = htmlToText.fromString(evt.editor.getData()).replace(/(\r\n|\n|\r)/gm, "")       
        const sanitizeTitleValue = sanitizeHTML(titleValue.replace(/ +/g, ' '), {allowedTags: [], allowedAttributes: {}});
        // remove all slashes(/) and backslashes(\)
        const sanitizeTitleValuePath = sanitizeTitleValue.replace(/\/|\\/g, "").substring(0, 64);
        if (this.state.id !== '') { // trick to make this run one time
          return this.setState(st => ({
            content: evt.editor.getData(),
            title: sanitizeTitleValuePath,
            saved: true, stop: st.stop + 1,
            hoomerStories: this.state.hoomerStories.map(storie => {
              if (storie.id === this.props.match.params.title) {
                return { ...storie, content: evt.editor.getData(), day, time };
              } return storie;
            })
          }), () => {
            return localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories));
          });
        }
        this.setState(st => ({
          id: `${sanitizeTitleValuePath}-${storyId}`,
          content: evt.editor.getData(),
          title: sanitizeTitleValuePath,
          saved: true, stop: st.stop + 1,
          hoomerStories: [ ...this.state.hoomerStories, {
            id: `${sanitizeTitleValuePath}-${storyId}`,
            title: sanitizeTitleValuePath,
            subtitle: '',
            content: evt.editor.getData(),
            tags: [],
            created: day,
            licensing: "all-rights-reserved",
            day, time,
            public: false
          }]
        }), () => {
          localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories));
          return this.props.history.push(`/p/${this.state.id}/edit`);
        });
        return clearTimeout(timeout);
      }, 2000);
      return null;
    };
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent,
      saved: true,
      hoomerStories: this.state.hoomerStories.map(storie => {
        if (storie.id === this.props.match.params.title) {
          return { ...storie, content: newContent, day, time };
        } return storie;
      })
    }, () => {
      return localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories));
    });
  };
  onFocus = () => {
    if (this.state.isUserDropDown) {
      return this.setState({ isUserDropDown: false });
    } else if (this.state.isEditDropDown) {
      if (this.state.isChangeTitle) {
        return this.setState({ isEditDropDown: false }, this.handleCloseTitle);
      } else if (this.state.isChangeTags) {
        return this.setState({ isEditDropDown: false }, this.handleCloseTags);
      } return this.setState({ isEditDropDown: false });
    } return null;
  };
  handleNewStoryRoute = () => {    
    const { pathname } = this.props.location;
    if (pathname === "/new-story") return window.location.reload();
    return window.location.href = "/new-story";
  };
  // publish story - form
  handleSubmitStory = () => {
    if (this.state.showPublicModal) {
      let d = new Date(), hours = d.getHours(), minutes = d.getMinutes();
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
  
      if (dd<10) dd = '0'+dd
      if (mm<10) mm = '0'+mm
  
      if (hours < 10) { hours = '0' + hours}
      if (minutes < 10) { minutes = '0' + minutes}
  
      const day = mm + '-' + dd + '-' + yyyy;
      const time = `${hours}:${minutes} H/MN`;
      return this.setState({
        hoomerStories: this.state.hoomerStories.map(storie => {
          if (storie.id === this.props.match.params.title) {
            return {
              ...storie,
              title: this.state.title,
              subtitle: this.state.subtitle,
              tags: this.state.tags,
              day, time,
              public: true
            };
          } return storie;
        })
      }, () => {
        // save to localstorage
        window.localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories));
        this.props.history.push("/public");
        return this.handleClosePublicStory();
      });
    } return null;
  };
  // public modal
  handleShowPublicStory = () => {
    let element = document.querySelector('body');
    element.style.overflow = 'hidden';
    this.setState({ showPublicModal: true });
  };
  handleClosePublicStory = () => {
    let element = document.querySelector('body');
    element.style.overflow = 'auto';
    return this.setState({ showPublicModal: false });
  };
  renderPublicModalContent = () => {
    if (this.state.showPublicModal) {
      return <form onSubmit={this.handleSubmitStory} className="story-public">
        <div className="story-public-close" onClick={this.handleClosePublicStory}>x</div>
        <div className="story-public-left">
          <div className="story-public-preview">Story Preview</div>
          <div className="story-public-image">Include a high-quality image in your story to make it more inviting to readers.</div>
          <div className="story-public-inputs">
            <input type="text" name="title" placeholder="Add a custom title..."
              value={this.state.title} onChange={this.handleChange}
            />
            <input type="text" name="subtitle" placeholder="Add a custom subtitle..."
              value={this.state.subtitle} onChange={this.handleChange}
            />
          </div>
          <div className="note">
            <strong>Note</strong>: Changes here will affect how your story appears in public places like Hoomer’s homepage — not the story itself.
          </div>
        </div>
        <div className="story-public-right">
          <div className="story-public-tags">
            <label className="tag" htmlFor="story-tag">
              Add or change tags (up to 5) so readers know what your story is about:
            </label>
            <textarea type="text" name="tag" id="story-tag" autoFocus onChange={this.handleChange}
              onKeyUp={this.handleEnterTags} placeholder="Add a tag..." value={this.state.tag}
            ></textarea>
            <div className="tags">
              {this.state.tags.map(tag => <Tag key={tag} tag={tag} handleRemoveTag={this.handleRemoveTag} />)}
            </div>
          </div>
          <div className="story-public-default">
            <input type="checkbox" id="story-checkbox" />
            <label htmlFor="story-checkbox">
              Make my story eligible to earn money and allow curators to recommend my story to interested readers. <strong>Recommended stories are part of Hoomer’s metered paywall.</strong>
            </label>
          </div>
          <button type="submit" className="publish-now">Publish now</button>
        </div>
      </form>
    }
  };
  renderPublicModal = () => {
    return (
      <PublicModal handleClosePublicStory={this.handleClosePublicStory} 
        showPublicModal={this.state.showPublicModal}
        renderPublicModalContent={this.renderPublicModalContent}
      />
    );
  };
  handleCloseRouteDropDown = () => {
    if (document.getElementById('dropdown')) {
      document.getElementById('dropdown').classList.add('user-dropdown-close');
    }
    const timeOut = setTimeout(() => {
      this.setState({ isUserDropDown: false });
      return clearTimeout(timeOut);
    }, 500);
  };
  render() {
    const element = document.getElementById("cke_45"); // standard ckedit
    const advanceElement = document.getElementById("cke_88"); // advance ckeditor
    if (element && element.style.display !== "none") { element.style.display = "none"; }
    if (advanceElement && advanceElement.style.display !== "none") { advanceElement.style.display = "none"; }
    const storage = (((JSON.parse(window.localStorage.getItem("settings") || "null")) !== null) ? (
      JSON.parse(window.localStorage.getItem("settings") || "")
    ):"");
    const storagePhoto = (storage !== "" && storage.photo !== "");
    const storageUsername = (storage !== "" && storage.username !== "") ? storage.username:"JhonDoe";
    return (
      <React.Fragment>
        <div className="edit-header">
          <div className="left">
            <Link className="logo" to='/'>
              <Hoomer />
            </Link>
            {this.state.saved ? (
              <div className="saved">Saved</div>
            ):null}
          </div>
          <div className="right">
              {this.state.public ? (
                <Link className="back-to-story" to={`/@${storageUsername}/${this.props.match.params.title}`}>Back to story</Link>
              ):(
                <button className={this.state.content.length === 0 ? "publish empty":"publish"}
                  disabled={this.state.content.length === 0 ? true:false}
                  onClick={this.handleShowPublicStory}>
                  Publish
                </button>
              )}
              <div className="outils" ref={this.handleEditRef}>
                <span id="threedots" className="threedots" onClick={this.handleShowEditDropDown}>...</span>
                {this.state.content.length === 0 && this.state.title.length === 0 && this.state.isEditDropDown ? (
                  <div className='settings-empty'>Settings will become available after you start writing.</div>
                ):this.state.isEditDropDown ? (
                  this.state.isChangeTitle ? (
                    <div className="properties-inputs">
                      <form onSubmit={this.handleSubmit} name="title">
                        <div className="title-input">
                          <label className={this.state.titleIsFocus ? "title isFocus":"title"}>
                              Title&nbsp;&nbsp;&nbsp;&nbsp;
                          </label>
                          <input type="text" name="title" autoFocus onChange={this.handleChange}
                            onFocus={this.handleTitleFocus} onBlur={this.handleTitleBlur} onKeyUp={this.handleEscape}
                            placeholder="Add a custom title..." value={this.state.title}
                          />
                        </div>
                        <div className="subtitle-input">
                          <label className={this.state.subtitleIsFocus ? "subtitle isFocus":"subtitle"}>
                              Subtitle
                          </label>
                          <input type="text" name="subtitle" onChange={this.handleChange}
                            onFocus={this.handleSubtitleFocus} onBlur={this.handleSubtitleBlur} onKeyUp={this.handleEscape}
                            placeholder="Add a custom subtitle..." value={this.state.subtitle}
                          />
                        </div>
                        <span className="note">
                          The title and subtitle are used on your publication homepage, in previews of your story on Medium, and on social media.
                        </span>
                        <button type="submit" className="done">
                          Done
                        </button>
                      </form>
                    </div>
                  ):this.state.isChangeTags ? (
                    <div className="properties-input">
                      <form onSubmit={this.handleSubmitTags} name="tags">
                        <div className="tag-input">
                          <label className="tag">
                            Add or change tags (up to 5) so readers know what your story is about:
                          </label>
                          <textarea type="text" name="tag" autoFocus onChange={this.handleChange}
                            onKeyUp={this.handleEnterTags} placeholder="Add a tag..." value={this.state.tag}
                          ></textarea>
                        </div>
                        <div className="tags">
                          {this.state.tags.map(tag => <Tag key={tag} tag={tag} handleRemoveTag={this.handleRemoveTag} />)}
                        </div>
                        <button type="submit" className="done">Save</button>
                        <button type="button" className="cancel"
                          onClick={this.handleCloseTags}>Cancel</button>
                      </form>
                    </div>
                  ):(
                    <div className="properties">
                      <div className="title" onClick={this.handleChangeTitle}>Change display title</div>
                      {this.state.public ? (
                        <Link to={`/p/${this.props.match.params.title}/settings`}>Story settings</Link>
                      ):null}
                      <div className="tags" onClick={this.handleChangeTags}>Change tags</div>
                    </div>
                  )
                ):null}
              </div>
              <div id="storage-upload-photo-warapper"
                className={storagePhoto ? "profile-storage-info":"profile-info"}
                ref={this.handleUserRef} onClick={this.handleShowUserDropDown}>
                <ProfilePhoto />
                {this.state.isUserDropDown ? (
                    <div id="dropdown" className="user-dropdown">
                      <Link className="nav-new-story" to="/new-story" onClick={this.handleNewStoryRoute}>New story</Link>
                      <Link className="nav-stories" to="/" onClick={this.handleCloseRouteDropDown}>Stories</Link>
                      <Link className="nav-profile" to="/me/profile" onClick={this.handleCloseRouteDropDown}>Profile</Link>
                      <Link className="nav-settings" to="/me/settings" onClick={this.handleCloseRouteDropDown}>Settings</Link>
                    </div>
                ):null}
              </div>
          </div>
        </div>
        <CKEditor 
          activeClass="p10"
          content={this.state.content}
          scriptUrl={this.state.editor === "full" ? (
            "https://cdn.ckeditor.com/4.6.2/full/ckeditor.js"
          ):"https://cdn.ckeditor.com/4.6.2/standard/ckeditor.js"}
          events={{
            "focus": this.onFocus,
            "change": this.onChange
          }}
        />
        {this.state.showPublicModal ? this.renderPublicModal():null}
      </React.Fragment>
    );
  };
};

export default App;
