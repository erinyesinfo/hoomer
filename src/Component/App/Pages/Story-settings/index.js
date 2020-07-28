import React, { Component } from 'react';
import sanitizeHTML from "sanitize-html";
import { Link as LinkDom } from 'react-router-dom';
import { Link, Element } from 'react-scroll';
import Tag from './Tag';
import ProfilePhoto from '../ProfilePhoto';// profile picture
import "./index.css";

class StorySettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hoomerStories: ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
                JSON.parse(localStorage.getItem("hoomer-stories"))
            ):[]),
            id: '',
            title: '',
            subtitle: '',
            content: '',
            tag: '',
            tags: [],
            created: '',
            public: false,
            contentLicensing: false,
            licensing: '',
            defaultLicensing: '',
            delete: false,
        };
    };
    componentDidMount() {
        const hoomerStories = ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
            JSON.parse(localStorage.getItem("hoomer-stories"))
        ):[]);
        if (hoomerStories.find(story => story.id === this.props.match.params.postID &&
            (story.public === true) )
        ) {
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
        } else if (this.props.location.pathname !== "/new-story" &&
            (hoomerStories.find(story => story.id !== this.props.match.params.postID && story.public === true))
        ) {
            this.props.history.push("/");
        }
    };
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
    handleEnterTags = e => {
        if (e.keyCode === 13 || e.which === 13) {
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
            const value = e.target.value;
            const duplicate = this.state.tags.find(tag => tag === value);            
            if (this.state.tags.length > 4 || duplicate) return null;
            if (value.length === 0) return null;
            return this.setState(st => ({
                tag: '',
                tags: [ ...st.tags, value ],
                hoomerStories: this.state.hoomerStories.map(storie => {
                    if (storie.id === this.props.match.params.postID) {
                      return { ...storie, tags: [ ...st.tags, value ], day, time };
                    } return storie;
                })
            }), () => {
                // save to localstorage
                return window.localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories));
            });
        } return null;
    };
    handleRemoveTag = Tag => {
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
        return this.setState({
            tags: this.state.tags.filter(tag => tag !== Tag),
            hoomerStories: this.state.hoomerStories.map(storie => {
                if (storie.id === this.props.match.params.postID) {
                  return { ...storie, tags: this.state.tags.filter(tag => tag !== Tag), day, time };
                } return storie;
            })
        }, () => {
            // save to localstorage
            return window.localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories));
        });
    };
    handleSubmitTags = e => {
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
        const value = this.state.tag;
        const duplicate = this.state.tags.find(tag => tag === value);
        if (this.state.tags.length > 4 || duplicate) return null;
        if (value.length === 0) return null;
        return this.setState(st => ({
            tag: '',
            tags: [ ...st.tags, value ],
            hoomerStories: this.state.hoomerStories.map(storie => {
                if (storie.id === this.props.match.params.postID) {
                  return { ...storie, tags: [ ...st.tags, value ], day, time };
                } return storie;
            })
        }), () => {
            // save to localstorage
            return window.localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories));
        });
    };
    handleShowLicensing = () => this.setState({ contentLicensing: true, defaultLicensing: this.state.licensing });
    handleCloseLicensing = () => this.setState({ contentLicensing: false, licensing: this.state.defaultLicensing });
    handleSaveLicensing = () => {
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
            contentLicensing: false,
            hoomerStories: this.state.hoomerStories.map(storie => {
                if (storie.id === this.props.match.params.postID) {
                  return { ...storie, licensing: this.state.licensing, day, time };
                } return storie;
            })
        }, () => {
            // save to localstorage
            return localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories));
        });
    };
    handleShowDeleteStory = () => this.setState({ delete: true });
    handleCloseDeleteStory = () => this.setState({ delete: false });
    handleDeleteStory = () => {
        return this.setState({
            hoomerStories: this.state.hoomerStories.filter(story => story.id !== this.props.match.params.postID)
        }, () => {
            window.localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories))
            return window.location.href = "/";//window.reload
        });
    };
    render() {
        const storage = (((JSON.parse(window.localStorage.getItem("settings") || "null")) !== null) ? (
            JSON.parse(window.localStorage.getItem("settings") || "")
        ):"");
        return (
            <React.Fragment>
                <div className="page-story-settings">
                    <div className="navs">
                        <Link activeClass="active" className="author-scroll"
                            to="author" spy={true} smooth={true}
                            duration={500}
                        >
                            Author
                        </Link>
                        <Link activeClass="active" className="readerInterests-scroll"
                            to="readerInterests" spy={true} smooth={true}
                            duration={500}
                        >
                            Reader Interests
                        </Link>
                        <Link activeClass="active" className="contentLicensing-scroll"
                            to="contentLicensing" spy={true} smooth={true}
                            duration={500}
                        >
                            Content Licensing
                        </Link>
                        <Link activeClass="active" className="delete-scroll"
                            to="delete" spy={true} smooth={true}
                            duration={500}
                        >
                            Delete story
                        </Link>
                    </div>
                    <div className="settings-content">
                        <h1 className="h1-story-settings">
                            <span>{this.state.title}</span> Settings
                        </h1>
                        <Element name="author" className="element">
                            <h2 className="h2-author">Author</h2>
                            <span className="author-overview">Overview</span>
                            <div className="element-author">
                                <ProfilePhoto />
                                <div className="author-info">
                                    <div className="author-name">
                                        {storage !== "" ? storage.name:"Jhon Doe"}
                                    </div>
                                    <LinkDom to='/me/profile' className="author-username">
                                        {storage !== "" ? "@"+storage.username:"@JhonDoe"}
                                    </LinkDom>
                                </div>
                            </div>
                        </Element>
                        <Element name="readerInterests" className="element">
                            <h2 className="h2-readerInterests">Reader Interests</h2>
                            <form onSubmit={this.handleSubmitTags}>
                                <div className="element-readerInterests">
                                    <label className="tag">
                                        Add tags (up to 5) so readers know what your story is about:
                                    </label>
                                    <div className="tags">
                                        {this.state.tags.map(
                                            tag => <Tag key={tag} tag={tag} handleRemoveTag={this.handleRemoveTag} />
                                        )}
                                    </div>
                                    <input type="text" name="tag" autoFocus
                                        onChange={this.handleChange} value={this.state.tag}
                                        onKeyUp={this.handleEnterTags} placeholder="Add a tag..."
                                    />
                                    {/* </input> */}
                                    <button type="submit" className={this.state.tag ? "done tags-btn":"done"}>
                                        Save
                                    </button>
                                </div>
                            </form>
                        </Element>
                        <Element name="contentLicensing" className="element">
                            <h2 className="h2-contentLicensing">Content Licensing</h2>
                            <div className="element-contentLicensing">
                                <div className="content-licensing">
                                    {this.state.contentLicensing ? (
                                        <div className="copyright">
                                            <div className="copyright-inputs">
                                                <input type="radio" id="all-rights-reserved" name="licensing"
                                                    onChange={this.handleChange} value="all-rights-reserved"
                                                    checked={(this.state.licensing === "all-rights-reserved" ||
                                                        this.state.licensing === "") ? true:false}
                                                />
                                                <label htmlFor="all-rights-reserved">
                                                    All rights reserved
                                                </label>
                                            </div>
                                            <div className="copyright-inputs">
                                                <input type="radio" id="some-rights-reserved" name="licensing"
                                                    onChange={this.handleChange} value="some-rights-reserved"
                                                    checked={this.state.licensing === "some-rights-reserved" ? true:false}
                                                />
                                                <label htmlFor="some-rights-reserved">
                                                    Some rights reserved
                                                </label>
                                            </div>
                                            <div className="copyright-inputs">
                                                <input type="radio" id="no-rights-reserved" name="licensing"
                                                    onChange={this.handleChange} value="no-rights-reserved"
                                                    checked={this.state.licensing === "no-rights-reserved" ? true:false}
                                                />
                                                <label htmlFor="no-rights-reserved">
                                                    No rights reserved
                                                </label>
                                            </div>
                                        </div>
                                    ):(this.state.licensing === "all-rights-reserved" || this.state.licensing === "") ? (
                                        <div className="copyright">All rights reserved</div>
                                    ):this.state.licensing === "some-rights-reserved" ? (
                                        <div className="copyright">Some rights reserved</div>
                                    ):this.state.licensing === "no-rights-reserved" ? (
                                        <div className="copyright">No rights reserved</div>
                                    ):null}
                                    {(this.state.licensing === "all-rights-reserved" || this.state.licensing === "") ? (
                                        <span>
                                            Others cannot copy, distribute, or perform your work without your permission (or as permitted by fair use).
                                        </span>
                                    ):this.state.licensing === "some-rights-reserved" ? (
                                        <span>
                                            Others can distribute, remix, and build upon your work as long as they credit you.
                                        </span>
                                    ):this.state.licensing === "no-rights-reserved" ? (
                                        <span>
                                            You waive all your copyright and related rights in this work, worldwide.
                                        </span>
                                    ):null}
                                    
                                </div>
                                {this.state.contentLicensing ? (
                                    <div className="">
                                        <button type="button" onClick={this.handleSaveLicensing}
                                            className={this.state.licensing !== "" ?
                                                "save-edit-licensing licensing-active": "save-edit-licensing"}>
                                            Save
                                        </button><button type="button" className="cancel-edit-licensing"
                                            onClick={this.handleCloseLicensing}>
                                            Cancel
                                        </button>
                                    </div>
                                ):(
                                    <button type="button" className="edit-licensing"
                                        onClick={this.handleShowLicensing}>
                                        Edit licensing
                                    </button>
                                )}
                                
                            </div>
                        </Element>
                        <Element name="delete" className="element">
                            <h2 className="h2-delete">Delete story</h2>
                            <div className="delete-story">
                                <button className={this.state.delete ? "delete-story-btn delete-active":"delete-story-btn"}
                                    onClick={this.handleShowDeleteStory}
                                    disabled={this.state.delete ? true:false}>
                                    Delete story
                                </button>
                                {this.state.delete ? (
                                    <div>
                                        <button className="yes-btn" onClick={this.handleDeleteStory}>Yes</button>
                                        <button className="no-btn" onClick={this.handleCloseDeleteStory}>Cancel</button>
                                    </div>
                                ):null}
                            </div>
                        </Element>
                    </div>
                </div>
                {(this.state.editPhoto || this.state.showMuted || this.state.showBlockedUsers || this.state.showDeleteAccount) ? 
                    this.renderModalSettings()
                :null}
            </React.Fragment>
        );
    };
};

export default StorySettings;
