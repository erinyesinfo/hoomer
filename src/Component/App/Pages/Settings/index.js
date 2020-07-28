import React, { Component } from 'react';
import sanitizeHTML from "sanitize-html";
import { Link, Element } from 'react-scroll';
import Camera from './Camera';
import "./index.css";

import standardCkeditor from './Images/Ckeditor standard.png'
import fullCkeditor from './Images/Ckeditor full.png'

import ModalSettings from './Modal/Settings';
import ModalSettingsContent from './Modal/Content';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: '',
            editPhoto: false,
            name: "Jhon Doe",
            editName: false,
            username: "JhonDoe",
            editUsername: false,
            email: "JhonDoe@gmail.com",
            editEmail: false,
            day: '',
            month: '',
            year: '',
            editBirthday: false,
            gender: "",
            editGender: false,
            ckeditor: "standard",
            defaultCkeditor: 'standard',
            editCkeditor: false,
            // element account
            on: true,
            showMuted: false,
            showBlockedUsers: false,
            showDeleteAccount: false,
        };
    };
    componentDidMount() {
        const storageData = ((JSON.parse(localStorage.getItem("settings") || "null") !== null) ? (
            JSON.parse(localStorage.getItem("settings"))
        ):"");
        if (storageData !== "") {
            this.setState({
                name: storageData.name,
                username: storageData.username,
                email: storageData.email,
                day: storageData.birthday.day,
                month: storageData.birthday.month,
                year: storageData.birthday.year,
                gender: storageData.gender,
                photo: storageData.photo,
                ckeditor: storageData.editor,
            });
        }
    };
    handleChange = e => {
        const value = e.target.value.replace("\n", "");
        const sanitizeValue = sanitizeHTML(value.trim(), {allowedTags: [], allowedAttributes: {}});        
        return this.setState({ [e.target.name]: sanitizeValue.replace("/", "") });
    };
    handleChangeBirthday = e => {
        if (e.target.name === "day") {
            let day = e.target.value.replace(/[^\d]/,'')            
            if (day.length === 1 && parseInt(day) > 3) return null;
            if (day.length === 2 && (
                (parseInt(day.substring(0, 1)) === 3 && parseInt(day.substring(1, 2)) > 1)
            || (parseInt(day.substring(0, 1)) === 0 && parseInt(day.substring(1, 2)) === 0)
            )) return null;
            return this.setState({ day });
        } else if (e.target.name === "month") {
            let month = e.target.value.replace(/[^\d]/,'')            
            if (month.length === 1 && parseInt(month) > 1) return null;
            if (month.length === 2 && (
                (parseInt(month.substring(0, 1)) === 1 && parseInt(month.substring(1, 2)) > 2)
                || (parseInt(month.substring(0, 1)) === 0 && parseInt(month.substring(1, 2)) === 0)
            )) return null;
            return this.setState({ month });
        } else if (e.target.name === "year") {
            let year = e.target.value.replace(/[^\d]/,''), d = new Date();
            let currentYear = d.getFullYear();            
            if (year.length === 1 && (parseInt(year) < 1 || parseInt(year) > 2)) return null;
            if (year.length === 2 && (
                (parseInt(year.substring(0, 1)) === 2 && parseInt(year.substring(1, 2)) > 0)
            || (parseInt(year.substring(0, 1)) === 1 && parseInt(year.substring(1, 2)) < 9)
            )) return null;
            if (year.length === 3 && parseInt(year.substring(0, 1)) === 2 && parseInt(year.substring(2, 3)) >= parseInt(currentYear.toString().substring(2, 3))) return null;
            if (parseInt(year) > currentYear) return null;
            return this.setState({ year });
        } return null
    };
    handleParseMonth = month => {
        let m = parseInt(month);
        if (m === 1) return "January";
        if (m === 2) return "February";
        if (m === 3) return "March";
        if (m === 4) return "April";
        if (m === 5) return "May";
        if (m === 6) return "June";
        if (m === 7) return "July";
        if (m === 8) return "August";
        if (m === 9) return "September";
        if (m === 10) return "October";
        if (m === 11) return "November";
        if (m === 12) return "December";
        return m;
    };
    handleShowEditName = () => this.setState({ editName: true });
    handleCloseEditName = () => this.setState({ editName: false });
    handleShowEditUsername = () => this.setState({ editUsername: true });
    handleCloseEditUsername = () => this.setState({ editUsername: false });
    handleShowEditEmail = () => this.setState({ editEmail: true });
    handleCloseEditEmail = () => this.setState({ editEmail: false });
    handleShowEditBirthday = () => this.setState({ editBirthday: true });
    handleCloseEditBirthday = () => this.setState({ editBirthday: false });
    handleShowEditGender = () => this.setState({ editGender: true });
    handleCloseEditGender = () => {
        const storageData = JSON.parse(localStorage.getItem("settings") || "null") !== null ? (
            JSON.parse(localStorage.getItem("settings"))
        ):"";
        if (storageData !== "" && storageData.gender === "") {
            return this.setState({ gender: "", editGender: false });
        } else if (storageData !== "" && storageData.gender !== this.state.gender) {
            return this.setState({ gender: storageData.gender, editGender: false });
        }
        return this.setState({ editGender: false });
    };
    handleShowCkeditor = () => this.setState({ editCkeditor: true, defaultCkeditor: this.state.ckeditor });
    handleCloseCkeditor = () => this.setState({ editCkeditor: false, ckeditor: this.state.defaultCkeditor });
    capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
    onHandleSubmit = e => { // form submit
        e.preventDefault();
        const storageData = ((JSON.parse(localStorage.getItem("settings") || "null") !== null) ? (
            JSON.parse(localStorage.getItem("settings"))
        ):"");
        let data = {
            name: this.state.name,
            username: this.state.username,
            email: this.state.email,
            birthday: {
                day: this.state.day,
                month: this.state.month,
                year: this.state.year
            },
            gender: this.state.gender,
            photo: this.state.photo,
            editor: this.state.ckeditor,
        };
        if (e.target.name === "name") {
            if (this.state.editName) {
                if (storageData !== "" && storageData.name === this.state.name) {
                    return this.setState({ editName: false });
                }
                window.localStorage.setItem("settings", JSON.stringify(data));
                return this.setState({ editName: false });
            } return null;
        } else if (e.target.name === "username") {
            if (this.state.editUsername) {
                if (storageData !== "" && storageData.username === this.state.username) {
                    return this.setState({ editUsername: false });
                }
                window.localStorage.setItem("settings", JSON.stringify(data));
                return this.setState({ editUsername: false });
            } return null;
        } else if (e.target.name === "email") {
            if (this.state.editEmail) {
                if (storageData !== "" && storageData.email === this.state.email) {
                    return this.setState({ editEmail: false });
                }
                window.localStorage.setItem("settings", JSON.stringify(data));
                return this.setState({ editEmail: false });
            } return null;
        } else if (e.target.name === "birthday") {
            if (this.state.editBirthday) {
                if (storageData !== "" && (
                    (storageData.birthday.day === this.state.day) &&
                    (storageData.birthday.month === this.state.month) &&
                    (storageData.birthday.year === this.state.year)
                )) {
                    return this.setState({ editBirthday: false });
                }
                window.localStorage.setItem("settings", JSON.stringify(data));
                return this.setState({ editBirthday: false });
            } return null;
        } else if (e.target.name === "gender") {
            if (this.state.editGender) {
                if (storageData !== "" && storageData.gender === this.state.gender) {
                    return this.setState({ editGender: false });
                }
                window.localStorage.setItem("settings", JSON.stringify(data));
                return this.setState({ editGender: false });
            } return null;
        } else if (e.target.name === "Ckeditor") {
            if (this.state.editCkeditor) {
                if (storageData !== "" && storageData.editor === this.state.ckeditor) {
                    return this.setState({ editCkeditor: false });
                }
                window.localStorage.setItem("settings", JSON.stringify(data));
                this.setState({ editCkeditor: false });
                return window.location.reload();
            } return null;
        } return null;
    };
    
    // element account
    handleToggle = e => {
        if (e.target.name === "on") {
            return this.setState({ on: true });
        } else {
            return this.setState({ on: false });
        }
    };
    handleShowEditPhoto = () => {
        let element = document.querySelector("body");
        element.style.overflow = 'hidden';
        this.setState({ editPhoto: true });
    };
    handleCloseEditPhoto = (bool) => {
        let element = document.querySelector("body");
        element.style.overflow = 'auto';
        if (typeof(bool) === "boolean" && bool === true) {
            return this.setState({ editPhoto: false }, this.props.updateHeader);
        }
        this.setState({ editPhoto: false });
    };
    handleShowMuted = () => {
        let element = document.querySelector("body");
        element.style.overflow = 'hidden';
        this.setState({ showMuted: true });
    };
    handleCloseMuted = () => {
        let element = document.querySelector("body");
        element.style.overflow = 'auto';
        this.setState({ showMuted: false });
    };
    handleShowBlockedUsers = () => {
        let element = document.querySelector("body");
        element.style.overflow = 'hidden';
        this.setState({ showBlockedUsers: true });
    };
    handleCloseBlockedUsers = () => {
        let element = document.querySelector("body");
        element.style.overflow = 'auto';
        this.setState({ showBlockedUsers: false });
    };
    handleShowDeleteAccount = () => {
        let element = document.querySelector("body");
        element.style.overflow = 'hidden';
        this.setState({ showDeleteAccount: true });
    };
    handleCloseDeleteAccount = () => {
        let element = document.querySelector("body");
        element.style.overflow = 'auto';
        this.setState({ showDeleteAccount: false });
    };
    handleDownloadInformation = e => {
        const profileData = JSON.parse(localStorage.getItem("settings") || "null") !== null ? (
            JSON.parse(localStorage.getItem("settings"))
        ):"";
        const hoomerStories = ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
            JSON.parse(localStorage.getItem("hoomer-stories"))
        ):[]);
        const draftLength = hoomerStories.filter(story => story.public === false);
        const publicLength = hoomerStories.filter(story => story.public === true);
        let data = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#000000" />
                <meta
                name="description"
                content="${profileData.name} information"
                />
                <style>
                    #user-info {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    #user-info #profilePhoto {
                        width: 120px;
                        border-radius: 50%;
                        margin-right: 50px;
                    }
                    /* Style the horizontal tab */
                    .horizontal-tab {
                        display: grid;
                        grid-template-columns: auto auto;
                        overflow: hidden;
                        border: 1px solid #ccc;
                        background-color: #f1f1f1;
                    }
                    /* Style the buttons that are used to open the username-horizontal-tab content */
                    .horizontal-tab button {
                        background-color: inherit;
                        float: left;
                        border: none;
                        outline: none;
                        cursor: pointer;
                        padding: 14px 16px;
                        transition: 0.3s;
                    }.horizontal-tab button:hover { background-color: #ddd; }
                    /* Create an active/current username-horizontal-tablink class */
                    .horizontal-tab button.active {
                        background-color: #ccc;
                    }
                    /* Style the username-horizontal-tab content */
                    .horizontal-tabcontent {
                        display: none;
                    }

                    /* Style the vertical tab */
                    * {
                        box-sizing: border-box
                    }

                    /* Style the tab */
                    .vertical-tab {
                        float: left;
                        border: 1px solid #ccc;
                        background-color: #f1f1f1;
                        width: 30%;
                        height: 100%;
                    }

                    /* Style the buttons that are used to open the tab content */
                    .vertical-tab button {
                        display: block;
                        background-color: inherit;
                        color: black;
                        padding: 22px 16px;
                        width: 100%;
                        border: none;
                        outline: none;
                        text-align: left;
                        cursor: pointer;
                        transition: 0.3s;
                    }.vertical-tab button:hover {
                        background-color: #ddd;
                    }

                    /* Create an active/current "tab button" class */
                    .vertical-tab button.active {
                        background-color: #ccc;
                    }

                    /* Style the tab content */
                    .vertical-tabcontent {
                        float: left;
                        padding: 0px 12px;
                        width: 70%;
                        height: 100%;
                    }
                </style>
                <title>Hoomer</title>
            </head>
            <body>
                <div id="root">
                    <h1>Welcom to your information ${profileData.name}</h1>
                    <div id="user-info">                    
                        <ul>
                            <li>name: ${profileData.name}</li>
                            <li>username: ${profileData.username}</li>
                            <li>email: ${profileData.email}</li>
                            ${(profileData.birthday.day !== "" && profileData.birthday.month !== "" && profileData.birthday.year !== "" ? (
                                (profileData.birthday.day !== "" && profileData.birthday.year !== "" && profileData.birthday.month === "") ? (
                                    `<li>${profileData.birthday.day}, ${profileData.birthday.year}</li>`
                                ):(profileData.birthday.month !== "" && profileData.birthday.year !== "" && profileData.birthday.day === "") ? (
                                    `<li>${profileData.birthday.month}, ${profileData.birthday.year}</li>`
                                ):`<li>${profileData.birthday.day}, ${this.handleParseMonth(profileData.birthday.month)} ${profileData.birthday.year}</li>`
                            ):"")}
                            ${profileData.gender !== "" ? `<li>gender: ${profileData.gender}</li>`:""}
                        </ul>
                        ${profileData !== "" && profileData.photo !== "" ? `<img id="profilePhoto" src="${profileData.photo} alt="Profile Photo" />`:""}
                    </div>
                    <div>
                        <h2>Stories</h2>
                        <div class="horizontal-tab">
                            <button class="horizontal-tablinks" id="defaultDraftOpen" onclick="openStory(event, 'Draft')">
                                Draft
                            </button>
                            <button class="horizontal-tablinks" onclick="openStory(event, 'Public')">
                                Public
                            </button>
                        </div>
                        
                        <div id="Draft" class="horizontal-tabcontent">
                            <div class="vertical-tab">
                                ${draftLength.map((draft, i) => {
                                    if (i === 0) {
                                        return `<button class="vertical-tablinks" id="draft-1"
                                            onclick="verticalStory(event, '${draft.id}')">
                                            ${draft.title}
                                        </button>`
                                    }
                                    return `<button class="vertical-tablinks"
                                        onclick="verticalStory(event, '${draft.id}')">
                                        ${draft.title}
                                    </button>`
                                }).join('')}
                            </div>
                            ${draftLength.map(draft =>
                                `<div id="${draft.id}" class="vertical-tabcontent">
                                    <h3>${draft.title}</h3>
                                    ${draft.content}
                                </div>`
                            ).join('')}
                        </div>
                        
                        <div id="Public" class="horizontal-tabcontent">
                            <div class="vertical-tab">
                                ${publicLength.map((pub, i) => {
                                    if (i === 0) {
                                        return `<button class="vertical-tablinks" id="public-1"
                                            onclick="verticalStory(event, '${pub.id}')">
                                            ${pub.title}
                                        </button>`
                                    } return `<button class="vertical-tablinks"
                                        onclick="verticalStory(event, '${pub.id}')">
                                        ${pub.title}
                                    </button>`
                                }).join('')}
                            </div>
                            ${publicLength.map(pub =>
                                `<div id="${pub.id}" class="vertical-tabcontent">
                                    <h3>${pub.title}</h3>
                                    ${pub.content}
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <script>
                    // horizontal tab
                    document.getElementById("defaultDraftOpen").click();
                    function openStory(evt, story) {
                        if (story === "Public") {
                            document.getElementById("public-1").click();
                        } else {
                            document.getElementById("draft-1").click();
                        }
                        // Declare all variables
                        var i, horizontalTabcontent, horizontalTablinks;
                    
                        // Get all elements with class="horizontal-tabcontent" and hide them
                        horizontalTabcontent = document.getElementsByClassName("horizontal-tabcontent");
                        for (i = 0; i < horizontalTabcontent.length; i++) {
                        horizontalTabcontent[i].style.display = "none";
                        }
                    
                        // Get all elements with class="horizontal-tablinks" and remove the class "active"
                        horizontalTablinks = document.getElementsByClassName("horizontal-tablinks");
                        for (i = 0; i < horizontalTablinks.length; i++) {
                            horizontalTablinks[i].className = horizontalTablinks[i].className.replace(" active", "");
                        }
                    
                        // Show the current horizontal tab, and add an "active" class to the button that opened the tab
                        document.getElementById(story).style.display = "block";
                        evt.currentTarget.className += " active";
                    };
                    // vertical tab
                    document.getElementById("draft-1").click();
                    function verticalStory(evt, story) {
                        console.log("verticalStory");
                        // Declare all variables
                        var i, verticalTabcontent, verticalTablinks;
                      
                        // Get all elements with class="vertical-tabcontent" and hide them
                        verticalTabcontent = document.getElementsByClassName("vertical-tabcontent");
                        for (i = 0; i < verticalTabcontent.length; i++) {
                          verticalTabcontent[i].style.display = "none";
                        }
                      
                        // Get all elements with class="vertical-tablinks" and remove the class "active"
                        verticalTablinks = document.getElementsByClassName("vertical-tablinks");
                        for (i = 0; i < verticalTablinks.length; i++) {
                          verticalTablinks[i].className = verticalTablinks[i].className.replace(" active", "");
                        }
                      
                        // Show the current tab, and add an "active" class to the link that opened the tab
                        document.getElementById(story).style.display = "block";
                        evt.currentTarget.className += " active";
                    }
                </script>
            </body>
            </html> 
        `;
        let element = e.target;
        // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(data));
        return element.setAttribute('download', "hoomer.html");
    };
    // element secrity
    handleDeleteAccount = () => {
        localStorage.clear();
        this.props.history.push("/");
    };
    handleCloseSettingsModal = () => {
        if (this.state.editPhoto) {
            return this.handleCloseEditPhoto();
        } else if (this.state.showMuted) {
            return this.handleCloseMuted();
        } else if (this.state.showBlockedUsers) {
            return this.handleCloseBlockedUsers();
        } else if (this.state.showDeleteAccount) {
            return this.handleCloseDeleteAccount();
        }
        let element = document.querySelector("body");
        element.style.overflow = 'auto';
        return this.setState({
            editPhoto: false,
            showMuted: false,
            showBlockedUsers: false,
            showDeleteAccount: false
        });
    };
    renderModalSettingsContent = () => {
        return (
            <ModalSettingsContent editPhoto={this.state.editPhoto}
                handleCloseEditPhoto={this.handleCloseEditPhoto}
                showMuted={this.state.showMuted}
                showBlockedUsers={this.state.showBlockedUsers}
                showDeleteAccount={this.state.showDeleteAccount}
                handleCloseDeleteAccount={this.handleCloseDeleteAccount}
                handleDeleteAccount={this.handleDeleteAccount}
            />
        );
    };
    renderModalSettings = () => {
        return (
            <ModalSettings renderModalSettingsContent={this.renderModalSettingsContent} // modal content
                // close modal-all
                handleCloseSettingsModal={this.handleCloseSettingsModal}
                // edit photo
                handleShowEditPhoto={this.handleShowEditPhoto}
                handleCloseEditPhoto={this.handleCloseEditPhoto}
                editPhoto={this.state.editPhoto}
                // manage muted
                handleShowMuted={this.handleShowMuted}
                handleCloseMuted={this.handleCloseMuted}
                showMuted={this.state.showMuted}
                // manage blocked users
                handleShowBlockedUsers={this.handleShowBlockedUsers}
                handleCloseBlockedUsers={this.handleCloseBlockedUsers}
                showBlockedUsers={this.state.showBlockedUsers}
                // delete account
                handleShowDeleteAccount={this.handleShowDeleteAccount}
                handleCloseDeleteAccount={this.handleCloseDeleteAccount}
                showDeleteAccount={this.state.showDeleteAccount}
            />
        );
    };
    render() {
        return (
            <React.Fragment>
                <div className="settings">
                    <div className="navs">
                        <Link activeClass="active" className="settings-scroll"
                            to="settings" spy={true} smooth={true}
                            duration={500}
                        >
                            Settings
                        </Link>
                        <Link activeClass="active" className="account-scroll"
                            to="account" spy={true} smooth={true}
                            duration={500}
                        >
                            Account
                        </Link>
                        <Link activeClass="active" className="security-scroll"
                            to="security" spy={true} smooth={true}
                            duration={500}
                        >
                            Security
                        </Link>
                    </div>
                    <div className="settings-content">
                        <Element name="settings" className="element">
                            <h1 className="h1-settings">Settings</h1>
                            <div className="element-settings">
                                <form onSubmit={this.onHandleSubmit} name="photo">
                                    <div className="edit-info">
                                        <div className="info-container">
                                            <strong>Photo</strong>
                                            <span>A photo helps personalize your account</span>
                                        </div>
                                        <div className="edit-photo" onClick={this.handleShowEditPhoto}>
                                            <Camera />
                                        </div>
                                    </div>
                                </form>
                                <form onSubmit={this.onHandleSubmit} name="name">
                                    <div className="edit-info">
                                        <div className="info-container">
                                            <strong>Name</strong>
                                            {this.state.editName ? (
                                                <input type="text" name="name" value={this.state.name} onChange={this.handleChange}
                                                    placeholder="Enter Your name" autoFocus
                                                />
                                            ):<span>{this.state.name}</span>}
                                        </div>
                                        {this.state.editName ? (
                                            <div className="edit-info-btns">
                                                <button type="submit" className="btn-save">
                                                    Save
                                                </button>
                                                <button type='button' className="btn-edit" onClick={this.handleCloseEditName}>
                                                    Cancel
                                                </button>
                                            </div>
                                        ):(
                                            <button type='button' className="btn-edit" onClick={this.handleShowEditName}>
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                                <form onSubmit={this.onHandleSubmit} name="username">
                                    <div className="edit-info">
                                        <div className="info-container">
                                            <strong>Username</strong>
                                            {this.state.editUsername ? (
                                                <input type="text" name="username" value={this.state.username}
                                                    onChange={this.handleChange} placeholder="Enter your username"
                                                    autoFocus
                                                />
                                            ):<span>{this.state.username}</span>}
                                        </div>
                                        {this.state.editUsername ? (
                                            <div className="edit-info-btns">
                                                <button type="submit" className="btn-save">
                                                    Save
                                                </button>
                                                <button type='button' className="btn-edit" onClick={this.handleCloseEditUsername}>
                                                    Cancel
                                                </button>
                                            </div>
                                        ):(
                                            <button type='button' className="btn-edit" onClick={this.handleShowEditUsername}>
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                                <form onSubmit={this.onHandleSubmit} name="email">
                                    <div className="edit-info">
                                        <div className="info-container">
                                            <strong>Email</strong>
                                            {this.state.editEmail ? (
                                                <input type="email" name="email" value={this.state.email}
                                                    onChange={this.handleChange} placeholder="Enter your email"
                                                    autoFocus
                                                />
                                            ):<span>{this.state.email}</span>}
                                        </div>
                                        {this.state.editEmail ? (
                                            <div className="edit-info-btns">
                                                <button type="submit" className="btn-save">
                                                    Save
                                                </button>
                                                <button type='button' className="btn-edit" onClick={this.handleCloseEditEmail}>
                                                    Cancel
                                                </button>
                                            </div>
                                        ):(
                                            <button type='button' className="btn-edit" onClick={this.handleShowEditEmail}>
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                                <form onSubmit={this.onHandleSubmit} name="birthday">
                                    <div className="edit-info">
                                        <div className="info-container">
                                            <strong>Birthday</strong>
                                            {this.state.editBirthday ? (
                                                <div className="birthday-edit">
                                                    <input type="text" name="day" className="birthday-day"
                                                        value={this.state.day}
                                                        onChange={this.handleChangeBirthday} autoFocus maxLength={2}
                                                        placeholder="day"
                                                    />
                                                    <input type="text" name="month" className="birthday-month"
                                                        value={this.state.month}
                                                        onChange={this.handleChangeBirthday} maxLength={2}
                                                        placeholder="month"
                                                    />
                                                    <input type="text" name="year" className="birthday-year"
                                                        value={this.state.year}
                                                        onChange={this.handleChangeBirthday} maxLength={4}
                                                        placeholder="year"
                                                    />
                                                </div>
                                            ):(this.state.day !== "" && this.state.month !== "" && this.state.year !== "" ? (
                                                (this.state.day !== "" && this.state.year !== "" && this.state.month === "") ? (
                                                    <span>{this.state.day + ", " + this.state.year}</span>
                                                ):(this.state.month !== "" && this.state.year !== "" && this.state.day === "") ? (
                                                    <span>{this.state.month + ", " + this.state.year}</span>
                                                ):
                                                <span>{this.state.day + ", " + this.handleParseMonth(this.state.month) + " " + this.state.year}</span>
                                            ):<span>Share your birthday</span>)}
                                        </div>
                                        {this.state.editBirthday ? (
                                            <div className="edit-info-btns">
                                                <button type="submit" className="btn-save">
                                                    Save
                                                </button>
                                                <button type='button' className="btn-edit" onClick={this.handleCloseEditBirthday}>
                                                    Cancel
                                                </button>
                                            </div>
                                        ):(
                                            <button type='button' className="btn-edit" onClick={this.handleShowEditBirthday}>
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                                <form onSubmit={this.onHandleSubmit} name="gender">
                                    <div className="edit-info">
                                        <div className="info-container">
                                            <strong>Gender</strong>
                                            {this.state.editGender ? (
                                                <div className="gender-edit">
                                                    <div>
                                                        <input type="radio" id="male" name="gender"
                                                            value={this.state.gender === "male" ? this.state.gender:"male"}
                                                            checked={this.state.gender === "male" ? true:false}
                                                            onChange={this.handleChange} />
                                                        <label htmlFor="male"
                                                            className={this.state.gender === "male" ? "active":""}>
                                                            Male
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <input type="radio" id="female" name="gender"
                                                            value={this.state.gender === "female" ? this.state.gender:"female"}
                                                            checked={this.state.gender === "female" ? true:false}
                                                            onChange={this.handleChange} />
                                                        <label htmlFor="female"
                                                            className={this.state.gender === "female" ? "active":""}>
                                                            Female
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <input type="radio" id="other" name="gender"
                                                            value={this.state.gender === "other" ? this.state.gender:"other"}
                                                            checked={this.state.gender === "other" ? true:false}
                                                            onChange={this.handleChange} />
                                                        <label htmlFor="other"
                                                            className={this.state.gender === "other" ? "active":""}>
                                                                Rather not say
                                                        </label>
                                                    </div>
                                                </div>
                                            ):this.state.gender !== "" ? (
                                                <span>{this.capitalizeFirstLetter(this.state.gender)}</span>
                                            ):<span>Indicating your gender lets Hoomer know how to refer to you.</span>}
                                        </div>
                                        {this.state.editGender ? (
                                            <div className="edit-info-btns">
                                                <button type="submit" className="btn-save">
                                                    Save
                                                </button>
                                                <button type='button' className="btn-edit" onClick={this.handleCloseEditGender}>
                                                    Cancel
                                                </button>
                                            </div>
                                        ):(
                                            <button type='button' className="btn-edit" onClick={this.handleShowEditGender}>
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                                <form onSubmit={this.onHandleSubmit} name="Ckeditor">
                                    <div className={this.state.editCkeditor ? "edit-info ckeditor":"edit-info"}>
                                        <div className="info-container">
                                            <strong>Your Editor</strong>
                                            {this.state.editCkeditor ? (
                                                <div className="ckeditor-edit">
                                                    <div>
                                                        <input type="radio" id="standard" name="ckeditor"
                                                            value={this.state.ckeditor === "standard" ? this.state.ckeditor:"standard"}
                                                            checked={this.state.ckeditor === "standard" ? true:false}
                                                            onChange={this.handleChange} />
                                                        <label htmlFor="standard"
                                                            className={this.state.ckeditor === "standard" ? "active":""}>
                                                            <img src={standardCkeditor} alt="standard Ckeditor" />
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <input type="radio" id="full" name="ckeditor"
                                                            value={this.state.ckeditor === "full" ? this.state.ckeditor:"full"}
                                                            checked={this.state.ckeditor === "full" ? true:false}
                                                            onChange={this.handleChange} />
                                                        <label htmlFor="full"
                                                            className={this.state.ckeditor === "full" ? "active":""}>
                                                            <img src={fullCkeditor} alt="full Ckeditor" />
                                                        </label>
                                                    </div>
                                                </div>
                                            ):<span>{this.state.ckeditor}</span>}
                                        </div>
                                        {this.state.editCkeditor ? (
                                            <div className="edit-info-btns">
                                                <button type="submit" className="btn-save">
                                                    Save
                                                </button>
                                                <button type='button' className="btn-edit" onClick={this.handleCloseCkeditor}>
                                                    Cancel
                                                </button>
                                            </div>
                                        ):(
                                            <button type='button' className="btn-edit" onClick={this.handleShowCkeditor}>
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </Element>
                        <Element name="account" className="element">
                            <h1 className="h1-account">Account</h1>
                            <div className="element-account">
                                <div>
                                    <strong>Allow private notes</strong>
                                    <span>Readers can leave private notes on your stories.</span>
                                </div>
                                <div className="private-notes">
                                    <button type="button" className={this.state.on ? "btn-active":""} name="on"
                                        onClick={this.handleToggle} disabled={this.state.on ? true:false}
                                    >
                                        On
                                    </button>
                                    <button type="button" className={this.state.on ? "":"btn-active"} name="off"
                                        onClick={this.handleToggle} disabled={this.state.on ? false:true}
                                    >
                                        Off
                                    </button>
                                </div>
                            </div>
                            <div className="element-account">
                                <div>
                                    <strong>Manage muted publications and authors</strong>
                                    <span>See a list of all the publications and authors you’ve muted.</span>
                                </div>
                                <button type="button" onClick={this.handleShowMuted}>
                                    Manage muted
                                </button>
                            </div>
                            <div className="element-account">
                                <div>
                                    <strong>Manage blocked users</strong>
                                    <span>See a list of all the users you’ve blocked.</span>
                                </div>
                                <button type="button" onClick={this.handleShowBlockedUsers}>
                                    Manage blocked users
                                </button>
                            </div>
                            <div className="element-account">
                                <div>
                                    <strong>Download your information</strong>
                                    <span>Download a copy of the information you’ve shared on Hoomer to a .zip file.</span>
                                </div>
                                <a onClick={this.handleDownloadInformation} href="#.html">
                                    Download .html
                                </a>
                            </div>
                        </Element>
                        <Element name="security" className="element">
                            <h1 className="h1-security">Security</h1>
                            <div className="element-security">
                                <div>
                                    <strong>Delete account</strong>
                                    <span>Permanently delete your account and all of your content.</span>
                                </div>
                                <button type="button" onClick={this.handleShowDeleteAccount}>
                                    Delete account
                                </button>
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

export default Settings;
