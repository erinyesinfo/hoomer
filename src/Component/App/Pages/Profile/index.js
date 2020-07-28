import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ProfilePhoto from '../ProfilePhoto';// profile picture
import Camera from './Camera';// icon
import "./index.css";

import ModalProfile from './Modal/Profile';
import ModalProfileContent from './Modal/Content';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editPhoto: false
        };
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
    renderModalProfileContent = () => {
        return (
            <ModalProfileContent editPhoto={this.state.editPhoto}
                handleCloseEditPhoto={this.handleCloseEditPhoto}
            />
        );
    };
    renderModalProfile = () => {
        return (
            <ModalProfile renderModalProfileContent={this.renderModalProfileContent} // modal content
                // edit photo
                handleCloseEditPhoto={this.handleCloseEditPhoto}
                editPhoto={this.state.editPhoto}
            />
        );
    };
    render() {
        const storageData = ((JSON.parse(localStorage.getItem("settings") || "null") !== null) ? (
            JSON.parse(localStorage.getItem("settings"))
        ):"");
        return (
            <React.Fragment>
                <div className="profile-user">
                    <div className="info">
                        <div className="user">
                            <div className="outil">
                                <div className="name">{storageData !== "" ? storageData.name:'Jhon Doe'}</div>
                                <Link to="/me/settings">Edit profile</Link>
                            </div>
                            <div className="following">1 Following</div>
                        </div>
                        <div className={storageData !== "" && storageData.photo !== "" ? "profile-upload-photo" :"profile-image"}
                            onClick={this.handleShowEditPhoto}>
                            <ProfilePhoto />
                            <div className="profile-camera-upload">
                                <Camera />
                            </div>
                        </div>
                    </div>
                    <div className="user-description">
                        {storageData !== "" ? storageData.name:'Jhon Doe'} hasn’t been active on Hoomer yet. Check back later to see their stories, claps, and highlights.
                    </div>
                </div>
                {this.state.editPhoto ? 
                    this.renderModalProfile()
                :null}
            </React.Fragment>
        );
    };
};

export default Profile;
