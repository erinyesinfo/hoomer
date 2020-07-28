import React, { Component } from 'react';
import sanitizeHTML from "sanitize-html";
import { Link } from 'react-router-dom';
import './index.css';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = { search: '' };
    };
    componentDidMount() {
        if (this.props.location.pathname === "/search" && this.props.location.search.substring(3) !== this.state.search) {
            this.setState({ search: this.props.location.search.substring(3) });
        }
    }
    componentDidUpdate() {
        if (this.props.location.pathname === "/search" && this.props.location.search.substring(3) !== this.state.search) {
            this.setState({ search: this.props.location.search.substring(3) });
        }
    }
    handleCompareQuery = query => {
        const queryLength = this.props.location.search.substring(3).length;
        if (query.substring(0, queryLength).toLowerCase() === this.props.location.search.substring(3).toLowerCase()) return query;
        return null
    };
    handleSearch = e => {
        const value = e.target.value.replace("\n", "");
        const sanitizeValue = sanitizeHTML(value.trim(), {allowedTags: [], allowedAttributes: {}});
        this.setState({ search: sanitizeValue.replace("/", "") }, () => this.props.history.push(`/search?q=${this.state.search}`));
    };
    hnadleClearSearch = () => this.setState({ search: '' });
    render() {
        const storage = (((JSON.parse(window.localStorage.getItem("settings") || "null")) !== null) ? (
            JSON.parse(window.localStorage.getItem("settings") || "").username
        ):"");
        const hoomerStorage = ((JSON.parse(localStorage.getItem("hoomer-stories") || "null") !== null) ? (
            JSON.parse(localStorage.getItem("hoomer-stories"))
        ):[]); 
        return (
            <div className="page-search">
                <input type="text" placeholder="Search Hoomer" autoFocus
                    onChange={this.handleSearch} value={this.state.search}
                />
                {this.props.location.search.substring(3).length !== 0 ? hoomerStorage.map(storie => {
                    if (storie.title && storie.public === true) {
                        return (
                            <Link key={storie.id} to={`/@${storage}/${storie.id}`}
                                onClick={this.hnadleClearSearch}>
                                {this.handleCompareQuery(storie.title)}
                            </Link>
                        );
                    } return null;
                }):null}
            </div>
        );
    };
};

export default Search;
