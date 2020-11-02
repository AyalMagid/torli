import React from 'react';
import { connect } from 'react-redux';
import { updateIsModalOpen } from '../../actions/modalAction.js';
import StoreService from '../../services/StoreService';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function _Modal(props) {

    const handleClose = () => {
        props.updateIsModalOpen(false)
        StoreService.initApp()
    };

    return (
        <div>
            <Dialog
                open={props.isModalOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                {props.modalTitle && <DialogTitle id="alert-dialog-slide-title">{props.modalTitle}</DialogTitle>}
                <DialogContent>
                    {props.modalContent && <DialogContentText id="alert-dialog-slide-description">
                        {props.modalContent}
                    </DialogContentText>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        ביטול
              </Button>
                    <Button onClick={handleClose} color="primary">
                        אישור
             </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}



function mapStateProps(state) {
    return {
        isModalOpen: state.ModalReducer.isModalOpen
    }
}

const mapDispatchToProps = {
    updateIsModalOpen
}

export const Modal = connect(mapStateProps, mapDispatchToProps)(_Modal)
