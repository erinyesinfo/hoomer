import React from "react";
import ReactDOM from 'react-dom';
import "./Delete.css";

class Delete extends React.Component {
  node = React.createRef();
  UNSAFE_componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  };
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  };
  handleRef = node => this.node = node;
  handleClick = e => {
    const { showDeleteModal } = this.props;
    if ( (!this.node.contains(e.target) && !showDeleteModal)
    || (this.node.contains(e.target) && showDeleteModal)
    ) {
      return null;
    } return this.props.handleCloseDeleteModal();
  };
  renderDeleteModal = () => {
    const { showDeleteModal, renderDeleteModalContent } = this.props;
    return (
      <div className={showDeleteModal ? 'modal-showDelete-active' : ''} >
        <div id="modal-container-showDelete" className={showDeleteModal ? 'showDelete' : 'out'} >
          <div className="modal-background-showDelete">
            <div className="modal-showDelete" ref={this.handleRef} onClick={this.handleClick}>
              {renderDeleteModalContent()}
            </div>
          </div>
        </div>
      </div>
    );
  };
  render() {
    return ReactDOM.createPortal(
      this.renderDeleteModal(),
      document.querySelector('#modal')
    );
  };
};

export default Delete;