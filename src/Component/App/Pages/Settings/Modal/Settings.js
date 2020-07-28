import React from "react";
import ReactDOM from 'react-dom';
import "./Settings.css";

class Settings extends React.Component {
  node = React.createRef();
  UNSAFE_componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  };
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  };
  handleRef = node => this.node = node;
  handleClick = e => {
    const { editPhoto, showMuted, showBlockedUsers, showDeleteAccount } = this.props;
    if (this.node.contains(e.target) && (editPhoto || showMuted || showBlockedUsers || showDeleteAccount)) {
      return null;
    } return this.props.handleCloseSettingsModal();
  };
  renderDeleteModal = () => {
    const { editPhoto, showMuted, showBlockedUsers, showDeleteAccount, renderModalSettingsContent } = this.props;
    return (
      <React.Fragment>
        <div className={(editPhoto || showMuted || showBlockedUsers || showDeleteAccount) ? 'modal-showSettings-active' : ''} >
          <div id="modal-container-showSettings" className={(editPhoto || showMuted || showBlockedUsers || showDeleteAccount) ? 'showSettings' : 'out'} >
            <div className="modal-background-showSettings">
              <div className="modal-showSettings" ref={this.handleRef} onClick={this.handleClick}>
                {renderModalSettingsContent()}
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

export default Settings;