import React from "react";
import ReactDOM from 'react-dom';
import "./index.css";

class Public extends React.Component {
  node = React.createRef();
  UNSAFE_componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  };
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  };
  handleRef = node => this.node = node;
  handleClick = e => {
    const { showPublicModal } = this.props;
    if (this.node.contains(e.target) && showPublicModal) {
      return null;
    } return this.props.handleClosePublicStory();
  };
  renderPublicModal = () => {
    const { showPublicModal, renderPublicModalContent } = this.props;
    return (
      <div className={showPublicModal ? 'modal-showPublic-active' : ''} >
        <div id="modal-container-showPublic" className={showPublicModal ? 'showPublic' : 'out'} >
          <div className="modal-background-showPublic">
            <div className="modal-showPublic" ref={this.handleRef} onClick={this.handleClick}>
              {renderPublicModalContent()}
            </div>
          </div>
        </div>
      </div>
    );
  };
  render() {
    return ReactDOM.createPortal(
      this.renderPublicModal(),
      document.querySelector('#modal')
    );
  };
};

export default Public;