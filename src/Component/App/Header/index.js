import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BlackTextLogo, WhiteTextLogo } from "../Logo";
import ProfilePhoto from "../Pages/ProfilePhoto";// profile picture
import { Loope } from "../Pages/Icons";
import './index.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matches576: window.matchMedia("(max-width: 576px)").matches,
            clickMatches576: false,
            isSearch: false,
            search: '',
            isDropDown: false,
            photo: (((JSON.parse(window.localStorage.getItem("settings") || "null")) !== null) ? (
                JSON.parse(window.localStorage.getItem("settings") || "").photo
            ):"")
        };
    };
    node = React.createRef();
    node2 = React.createRef();
    componentDidMount() {
        const storageData = ((JSON.parse(localStorage.getItem("settings") || "null") !== null) ? (
            JSON.parse(localStorage.getItem("settings"))
        ):"");
        if (storageData === "") {
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
                photo: "",
                editor: "standard",
            };
            window.localStorage.setItem("settings", JSON.stringify(data));
        }
    };
    componentDidUpdate() {
        if (this.props.location.pathname === "/search" && this.props.location.search.substring(3) !== this.state.search) {
            this.setState({ search: this.props.location.search.substring(3) });
        }
    };
    UNSAFE_componentWillMount() {
        document.addEventListener('mousedown', this.onHideSearch, false);
        document.addEventListener('mousedown', this.handleCloseDropDown, false);
        window.addEventListener('mousedown', this.handleClearSearch);
        // less or equal 576px
        window.addEventListener('resize', this.handler576);
        window.addEventListener('load', this.handler576);
        window.addEventListener('scroll', this.handler576);
    };
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onHideSearch, false);
        document.removeEventListener('mousedown', this.handleCloseDropDown, false);
        window.removeEventListener('mousedown', this.handleClearSearch);
        // less or equal 576px
        window.removeEventListener('resize', this.handler576);
        window.removeEventListener('load', this.handler576);
        window.removeEventListener('scroll', this.handler576);
    };
    handler576 = () => this.setState({ matches576: window.innerWidth <= 576 });
    handleSearchRef = node => this.node = node;
    handleDropRef = node2 => this.node2 = node2;
    onShowSearch = () => this.setState({ isSearch: true });
    onHideSearch = e => {
        if (this.state.matches576) return null;
        const path = this.props.location.pathname;
        const hideHeader = (
            (path.substring(0, 2) === "/p" && path.substring(path.length - 5) === "/edit") || (path === "/new-story")
        );
        if (hideHeader) return null;
        if (this.node === null) return null;
        if (this.node.contains(e.target) === false && this.state.isSearch) {
            const elm = document.getElementById("search");
            if (elm) {
                elm.classList.add("search-perfect");
            }            
            const timeOut = setTimeout(() => {
                if (this.state.isSearch === false) {
                    return clearTimeout(timeOut);
                }
                this.setState({ isSearch: false });
                if (elm) { elm.classList.remove("search-perfect"); }
            }, 300);
            return null;
        } return null;
    };
    handleSearch = e => {
        this.setState({ search: e.target.value });
        this.props.history.push(`/search?q=${e.target.value}`)
    };
    handleClearSearch = () => {
        let path = this.props.location.pathname;
        if (path !== "/search") {
            return this.setState({ search: '' });
        } return null;
    };
    handleShowDropDown = e => {
        if (this.state.matches576) return null;
        const storagePhoto = document.getElementById("storage-upload-photo");
        if (e.target === storagePhoto && this.state.isDropDown === false) {
            return this.setState({ isDropDown: true });
        }
        const man = document.getElementById("man-svg");
        const man_Path = document.getElementById("man-path");
        if ((e.target === man_Path || e.target === man) && this.state.isDropDown === false) {
            return this.setState({ isDropDown: true });
        } return null;
    };
    handleCloseDropDown = e => {
        if (this.state.matches576) return null;
        const path = this.props.location.pathname;
        const hideHeader = (
            (path.substring(0, 2) === "/p" && path.substring(path.length - 5) === "/edit") || (path === "/new-story")
        );
        if (hideHeader) return null;
        if (this.node2 === null) return null;
        if (this.node2.contains(e.target) === false) {
            if (document.getElementById('dropdown')) {
                document.getElementById('dropdown').classList.add('user-dropdown-close');
            }
            const timeOut = setTimeout(() => {
                this.setState({ isDropDown: false });
                return clearTimeout(timeOut);
            }, 500);
            return null;
        } return null;
    };
    handleCloseRouteDropDown = () => {
        if (this.state.isDropDown) {
            if (document.getElementById('dropdown')) {
                document.getElementById('dropdown').classList.add('user-dropdown-close');
            }
            const timeOut = setTimeout(() => {
                this.setState({ isDropDown: false });
                return clearTimeout(timeOut);
            }, 500);
            return null;
        }
        if (this.state.clickMatches576) return this.setState({ clickMatches576: false });
    };
    handleMatchClick = () => {
        if (this.state.matches576 && !this.state.clickMatches576) {
            return this.setState({ clickMatches576: true });
        } else if (this.state.matches576 && this.state.clickMatches576) {
            return this.setState({ clickMatches576: false });
        } return null;
    };
    render() {
        const hoomerStorage = ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
            JSON.parse(localStorage.getItem("hoomer-stories"))
        ):[]);       
        const storage = (((JSON.parse(window.localStorage.getItem("settings") || "null")) !== null) ? (
            JSON.parse(window.localStorage.getItem("settings") || "")
        ):"");
        const storagePhoto = (storage !== "" && storage.photo !== "");
        const storageUsername = (storage !== "" && storage.username !== "") ? storage.username:"JhonDoe";
        const path = this.props.location.pathname;
        // hide header
        if ((hoomerStorage.find(st => st.id === path.substring(3, path.length - 5))
        && (path.substring(0, 2) === "/p" && path.substring(path.length - 5) === "/edit")) || (path === "/new-story")
        ) return null;
        const storySettings = (
            (path.substring(0, 2) === "/p" && path.substring(path.length - 9) === "/settings") || (path === "/new-story")
        );
        return (
            <div className="header">
                <div className="header-container">
                    <div className="left" draggable='false'>
                        <Link className="logo" to='/'>
                            {this.state.matches576 ? <WhiteTextLogo />:<BlackTextLogo />}
                        </Link>
                    </div>
                    <div className="right">
                        {this.state.matches576 ? (
                            <div className="right-576" onClick={this.handleMatchClick}>
                                <span className="line"></span>
                                <span className="line"></span>
                                <span className="line"></span>
                            </div>
                        ):(
                            <React.Fragment>
                                {storySettings ? (
                                    <Link className="back-to-story"
                                        to={`/@${storageUsername}/${path.substring(3, path.length - 9)}`}>
                                        Back to story
                                    </Link>
                                ):null}
                                <div ref={this.handleSearchRef} className="search">
                                    <Loope isSearch={this.state.isSearch} onShowSearch={this.onShowSearch} />
                                    {this.state.isSearch ? (
                                        <input type="text" name="search" id="search" placeholder="Search Hoomer"
                                            onChange={this.handleSearch} value={this.state.search}
                                            autoFocus />
                                    ):null}
                                </div>
                                <div className={storagePhoto !== "" ? "profile-storage-info":"profile-info"}
                                ref={this.handleDropRef} onClick={this.handleShowDropDown}>
                                    <ProfilePhoto />
                                    {this.state.isDropDown ? (
                                        <div id="dropdown" className="user-dropdown">
                                            <Link onClick={this.handleCloseRouteDropDown} className="nav-new-story" to="/new-story">
                                                New story
                                            </Link>
                                            <Link onClick={this.handleCloseRouteDropDown} className="nav-stories" to="/">
                                                Stories
                                            </Link>
                                            <Link onClick={this.handleCloseRouteDropDown} className="nav-profile" to="/me/profile">
                                                Profile
                                            </Link>
                                            <Link onClick={this.handleCloseRouteDropDown} className="nav-settings" to="/me/settings">
                                                Settings
                                            </Link>
                                        </div>
                                    ):null}
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
                {this.state.matches576 && this.state.clickMatches576 ? (
                        <div className="right-576-container">
                            {storySettings ? (
                                <Link className="back-to-story" onClick={this.handleCloseRouteDropDown}
                                    to={`/@${storageUsername}/${path.substring(3, path.length - 9)}`}>
                                    Back to story
                                </Link>
                            ):null}
                            <Link onClick={this.handleCloseRouteDropDown} className="nav-new-story" to="/new-story">
                                New story
                            </Link>
                            <Link onClick={this.handleCloseRouteDropDown} className="nav-stories" to="/">
                                Stories
                            </Link>
                            <Link onClick={this.handleCloseRouteDropDown} className="nav-profile" to="/me/profile">
                                Profile
                            </Link>
                            <Link onClick={this.handleCloseRouteDropDown} className="nav-settings" to="/me/settings">
                                Settings
                            </Link>
                            <input type="text" name="search" id="search" placeholder="Search Hoomer"
                                onChange={this.handleSearch} value={this.state.search}
                                autoFocus
                            />
                        </div>
                ):null}
            </div>
        );
    };
};

export default Header;
