import React from "react";
import ReactDOM from 'react-dom';
import "./Profile.css";

class Profile extends React.Component {
  node = React.createRef();
  UNSAFE_componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  };
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  };
  handleRef = node => this.node = node;
  handleClick = e => {
    const { editPhoto } = this.props;
    if (this.node.contains(e.target) && editPhoto) {
      return null;
    } return this.props.handleCloseEditPhoto();
  };
  renderDeleteModal = () => {
    const { editPhoto, renderModalProfileContent } = this.props;
    return (
      <React.Fragment>
        <div className={editPhoto ? 'modal-showProfile-active' : ''} >
          <div id="modal-container-showProfile" className={editPhoto ? 'showProfile' : 'out'} >
            <div className="modal-background-showProfile">
              <div className="modal-showProfile" ref={this.handleRef} onClick={this.handleClick}>
                {renderModalProfileContent()}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };
  render() {
    return ReactDOM.createPortal(
      this.renderDeleteModal(),
      document.querySelector('#modal')
    );
  };
};

export default Profile;