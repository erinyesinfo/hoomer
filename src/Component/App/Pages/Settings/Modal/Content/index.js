import React, { Component } from 'react';
import Photo from './Photo/Photo';
import './index.css';

class ModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            photo: ''
        };
    };
    handleChange = e => this.setState({ [e.target.name]: e.target.value });
    handleDeleteAccount = e => {
        e.preventDefault();
        const profileData = JSON.parse(localStorage.getItem("settings") || "null") !== null ? (
            JSON.parse(localStorage.getItem("settings"))
        ):"";
        if (profileData !== "" && this.state.username !== profileData.username) return null;
        return this.props.handleDeleteAccount();
    };
    handleUploadPhoto = image => {
        if (image.length !== 0) {
            return this.setState({ photo: image[0].dataURL });
        } return 0;
    };
    handleSubmitPhoto = () => {
        if (this.state.photo !== '') {
            const storageData = JSON.parse(localStorage.getItem("settings") || "null") !== null ? (
                JSON.parse(localStorage.getItem("settings"))
            ):"";
            if (storageData !== "" && (storageData.name !== '' && storageData.username !== '' && storageData.email !== '')) {
                let data = {
                    name: storageData.name,
                    username: storageData.username,
                    email: storageData.email,
                    birthday: {
                        day: storageData.birthday.day,
                        month: storageData.birthday.month,
                        year: storageData.birthday.year
                    },
                    gender: storageData.gender,
                    photo: this.state.photo,
                };
                window.localStorage.setItem("settings", JSON.stringify(data));
                return this.props.handleCloseEditPhoto(true);
            } else {
                let data = {
                    name: "Jhon Doe",
                    username: "JhonDoe",
                    email: "JhonDoe@gmail.com",
                    birthday: {
                        day: '',
                        month: '',
                        year: ''
                    },
                    gender: '',
                    photo: this.state.photo,
                };
                window.localStorage.setItem("settings", JSON.stringify(data));
                return this.props.handleCloseEditPhoto(true);
            }
        } return null;
    };
    render() {      
        const { editPhoto, showMuted, showBlockedUsers, showDeleteAccount } = this.props;
        const profileData = JSON.parse(localStorage.getItem("settings") || "null") !== null ? (
            JSON.parse(localStorage.getItem("settings"))
        ):"";
        if (editPhoto) {
            return (
                <div className="edit-photo-modal">
                    <h3 className="preventcopy">Select profile photo</h3>
                    <h4 className="preventcopy">Upload photos</h4>
                    <hr />
                    <Photo handleUploadPhoto={this.handleUploadPhoto} data="true" />
                    <div className="btns-photo">
                        <div>
                            <button type="button" disabled={this.state.photo !== '' ? false:true}
                                className={this.state.photo !== '' ? 'profile-photo set-profile-photo':'profile-photo'}
                                onClick={this.handleSubmitPhoto}>
                                Set as profile photo
                            </button>
                            <button type="button" onClick={this.props.handleCloseEditPhoto}>
                                Cancel
                            </button>
                        </div>
                        <div className="preventcopy photo-note">
                            Your profile photo is visible to everyone, across Hoomer products. 
                        </div>
                    </div>
                </div>
            );
        } else if (showMuted) {
            return <p className="muted-authors">You are not muting any publications.</p>;
        } else if (showBlockedUsers) {
            return <p className="blocking-users">You are not blocking any users.</p>;
        } else if (showDeleteAccount) {
            return (
                <div className="delete-account">
                    <h2>Confirm account deletion</h2>
                    <p>We’re sorry to see you go. Once your account is deleted, all of your content will be permanently gone, including your profile, stories, publications, notes, and responses.</p>
                    <p>To confirm deletion, type your username ({profileData !== "" ? profileData.username:''}) below:</p>
                    <form onSubmit={this.handleDeleteAccount}>
                        <input type="text" name="username" placeholder="Confirm your usrname"
                            onChange={this.handleChange} value={this.state.username} autoFocus
                        />
                        <div>
                            <button type="submit">Yes</button>
                            <button type="button" onClick={this.props.handleCloseDeleteAccount}>No</button>
                        </div>
                    </form>
                </div>
            );
        } return null;
    };
};

export default ModalContent;
