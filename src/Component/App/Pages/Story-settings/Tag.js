import React, { Component } from 'react';

class Tag extends Component {
    handleRemoveTag = () => this.props.handleRemoveTag(this.props.tag);
    render() {
        const { tag } = this.props;
        return (
            <span className="story-tag" key={tag} name={tag}>
                {tag} <span className="remove" onClick={this.handleRemoveTag}>x</span>
            </span>
        );
    };
}

export default Tag;
