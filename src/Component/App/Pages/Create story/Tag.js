import React, { Component } from 'react';
import { Trash } from "../Icons";

class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mouseIn: false,
        };
    };
    handleRemoveTag = () => this.props.handleRemoveTag(this.props.tag);
    handleMouseEnter = () => this.setState({ mouseIn: true });
    handleMouseLeave = () => this.setState({ mouseIn: false });
    render() {
        const { tag } = this.props;
        return (
            <span className={this.state.mouseIn ? "story-tag tag-hover":"story-tag"}
                key={tag} name={tag}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                {tag}
                {this.state.mouseIn ? <div className="tag-x" onClick={this.handleRemoveTag}><Trash /></div>:null}
            </span>
        );
    };
};

export default Tag;
