import React, { Component } from 'react';
import Photo from './Photo/Photo';

class ModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            photo: ''
        };
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
    };
};

export default ModalContent;
