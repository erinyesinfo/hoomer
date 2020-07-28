import React, { Component } from 'react';

class Images extends Component {
    constructor(props) {
        super(props);
        this.state = { mouseIn: false };
    };
    handleMouseEnter = () => this.setState({ mouseIn: true });
    handleMouseLeave = () => this.setState({ mouseIn: false });
    render() {
        const { image } = this.props;
        return (
            <div onClick={image.onRemove}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            className={this.state.mouseIn ?
                'upload-container bg-img-removeImage':'upload-container'}
            >
                <img src={image.dataURL} alt='upload-img' />
                {this.state.mouseIn ?
                    <span>Remove</span>
                :null}
            </div>
        );
    };
};

export default Images;
