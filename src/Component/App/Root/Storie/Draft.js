import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import wordCount from 'html-word-count';
import { ArrowDown } from "../../Pages/Icons";

import DeleteModal from './Modal/Delete';

class Draft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hoomerStories: ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
                JSON.parse(localStorage.getItem("hoomer-stories"))
            ):[]),
            dropDown: false,
            showDeleteModal: false,
        };
    };
    node = React.createRef();
    UNSAFE_componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    };
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    };
    handleRef = node => this.node = node;
    handleShowDropDown = () => {
        if (this.state.dropDown === false) {
            return this.setState({ dropDown: true });
        } return null;
    };
    handleClick = e => {
        if (this.node === null) return null;
        if (this.node.contains(e.target) === false && this.state.dropDown === true) {
          return this.setState({ dropDown: false });
        } return null;
    };
    handleDelete = () => {
        return this.setState({
            hoomerStories: this.state.hoomerStories.filter(story => story.id !== this.props.id)
        }, () => {
            window.localStorage.setItem("hoomer-stories", JSON.stringify(this.state.hoomerStories))            
            return window.location.href = "/";//window.reload
        });
    };
    handleShowDeleteModal = () => {
        var element = document.querySelector("body");
        element.style.overflow = 'hidden';
        this.setState({ showDeleteModal: true });
    };
    handleCloseDeleteModal = () => {
        var element = document.querySelector("body");
        element.style.overflow = 'auto';
        return this.setState({ showDeleteModal: false });
    };
    renderDeleteModalContent = () => {
        return <div className="modal-delete-content">
            <h1>Delete</h1>
            <p className="note">Deleted stories are gone forever. Are you sure?</p>
            <div className="btns">
                <button className="delete" onClick={this.handleDelete}>Delete</button>
                <button className="cancel" onClick={this.handleCloseDeleteModal}>Cancel</button>
            </div>
        </div>
    };
    renderDeleteModal = () => {
        return (
          <DeleteModal handleShowDeleteModal={this.handleShowDeleteModal} 
            handleCloseDeleteModal={this.handleCloseDeleteModal} 
            showDeleteModal={this.state.showDeleteModal}
            renderDeleteModalContent={this.renderDeleteModalContent} />
        );
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
        }
        return wordsPerMinutes;
    };
    render() {
        const { id, story } = this.props;
        let d = new Date(), hours = d.getHours(), minutes = d.getMinutes();
        var dd = d.getDate();
        var mm = d.getMonth()+1; //January is 0!
        var yyyy = d.getFullYear();

        if (dd<10) dd = '0'+dd
        if (mm<10) mm = '0'+mm

        if (hours < 10) { hours = '0' + hours}
        if (minutes < 10) { minutes = '0' + minutes}
        return (
            <React.Fragment>
                <div key={id}>
                    <h2 className="title">
                        <Link to={`/p/${id}/edit`}>{story.title}</Link>
                    </h2>
                    {story.subtitle.length !== 0 ? (
                        <div className="subtitle">
                            <Link to={`/p/${id}/edit`}>{story.subtitle}</Link>
                        </div>
                    ):null}
                    <div className={story.subtitle.length === 0 ? "time-read fixSpace":"time-read"}>
                        <div className="last-edited">Last edited {
                            story.day.substring(story.day.length - 4, story.day.length) === yyyy.toString() ? (
                                story.day.substring(0, 2) === mm.toString() ? (
                                    story.day.substring(3, 5) === dd.toString() ? (
                                        story.time.substring(0, 2) === hours.toString() ? (
                                            story.time.substring(3, 5) === minutes.toString() ? (
                                                "Just now"
                                            ):(// minutes is not the same
                                            typeof(story.time.substring(3, 5)) === "string" ? (
                                                ((typeof(minutes) === "string" ? (
                                                    parseInt(minutes)
                                                ):minutes) - parseInt(story.time.substring(3, 5)))
                                            ):(typeof(minutes) === "string" ? (
                                                parseInt(minutes)
                                            ):minutes) - story.time.substring(3, 5))
                                            // check if it is a minute or minutes
                                            + ((typeof(story.time.substring(3, 5)) === "string" ? (
                                                ((typeof(minutes) === "string" ? (
                                                    parseInt(minutes)
                                                ):minutes) - parseInt(story.time.substring(3, 5)))
                                            ):(typeof(minutes) === "string" ? (
                                                parseInt(minutes)
                                            ):minutes) - story.time.substring(3, 5)) === 1 ? " minute ago ":" minutes ago ")
                                        ):(// hours is not the same
                                        typeof(story.time.substring(0, 2)) === "string" ? (
                                            ((typeof(hours) === "string" ? (
                                                parseInt(hours)
                                            ):hours) - parseInt(story.time.substring(0, 2)))
                                        ):(typeof(hours) === "string" ? (
                                            parseInt(hours)
                                        ):hours) - story.time.substring(0, 2))
                                        // check if it is a hour or hours
                                        + ((typeof(story.time.substring(0, 2)) === "string" ? (
                                            ((typeof(hours) === "string" ? (
                                                parseInt(hours)
                                            ):hours) - parseInt(story.time.substring(0, 2)))
                                        ):(typeof(hours) === "string" ? (
                                            parseInt(hours)
                                        ):hours) - story.time.substring(0, 2)) === 1 ? " hour ago ":" hours ago ")
                                    ):(// day is not the same
                                    typeof(story.day.substring(3, 5)) === "string" ? (
                                        ((typeof(dd) === "string" ? (
                                            parseInt(dd)
                                        ):dd) - parseInt(story.day.substring(3, 5)))
                                    ):(typeof(dd) === "string" ? (
                                        parseInt(dd)
                                    ):dd) - story.day.substring(3, 5))
                                    // check if it is a day or days
                                    + ((typeof(story.day.substring(3, 5)) === "string" ? (
                                        ((typeof(dd) === "string" ? (
                                            parseInt(dd)
                                        ):dd) - parseInt(story.day.substring(3, 5)))
                                    ):(typeof(dd) === "string" ? (
                                        parseInt(dd)
                                    ):dd) - story.day.substring(3, 5)) === 1 ? " day ago ":" days ago ")
                                ):(// month is not the same
                                typeof(story.day.substring(0, 2)) === "string" ? (
                                    ((typeof(mm) === "string" ? (
                                        parseInt(mm)
                                    ):mm) - parseInt(story.day.substring(0, 2)))
                                ):(typeof(mm) === "string" ? (
                                    parseInt(mm)
                                ):mm) - story.day.substring(0, 2))
                                // check if it is a month or months
                                + ((typeof(story.day.substring(0, 2)) === "string" ? (
                                    ((typeof(mm) === "string" ? (
                                        parseInt(mm)
                                    ):mm) - parseInt(story.day.substring(0, 2)))
                                ):(typeof(mm) === "string" ? (
                                    parseInt(mm)
                                ):mm) - story.day.substring(0, 2)) === 1 ? " month ago ":" months ago ")
                            ):(// year is not the same
                            typeof(story.day.substring(story.day.length - 4, story.day.length)) === "string" ? (
                                ((typeof(yyyy) === "string" ? (
                                    parseInt(yyyy)
                                ):yyyy) - parseInt(story.day.substring(story.day.length - 4, story.day.length)))
                            ):(typeof(yyyy) === "string" ? (
                                parseInt(yyyy)
                            ):yyyy) - story.day.substring(story.day.length - 4, story.day.length)) + " years ago "
                            // check if it is a year or years
                            + ((typeof(story.day.substring(story.day.length - 4, story.day.length)) === "string" ? (
                                ((typeof(yyyy) === "string" ? (
                                    parseInt(yyyy)
                                ):yyyy) - parseInt(story.day.substring(story.day.length - 4, story.day.length)))
                            ):(typeof(yyyy) === "string" ? (
                                parseInt(yyyy)
                            ):yyyy) - story.day.substring(story.day.length - 4, story.day.length)) === 1 ? " year ago ":" years ago ")
                        } <span>.</span> {this.handleCalculateWordsPerMinutes(wordCount(story.content))} min read ({wordCount(story.content)} {wordCount(story.content) === 1 ? "word":"words"}) so far
                        </div>
                        <div className="arrow-down" ref={this.handleRef} onClick={this.handleShowDropDown}>
                            <ArrowDown />
                            {this.state.dropDown ? (
                                <div className="drop-down">
                                    <div className="edit" onClick={this.editDraft}>
                                        <Link to={`/p/${id}/edit`}>Edit draft</Link>
                                    </div>
                                    <div className="delete" onClick={this.handleShowDeleteModal}>Delete draft</div>
                                </div>
                            ):null}
                        </div>
                    </div>
                    <hr className="stories-hr" />
                </div>
                {this.state.showDeleteModal ? this.renderDeleteModal():null}
            </React.Fragment>
        );
    };
};

export default Draft;
