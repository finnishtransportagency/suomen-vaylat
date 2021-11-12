import React, {useContext} from "react";
import Alert from 'react-bootstrap/Alert';
import styled from "styled-components";
import {Button} from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import {ReactReduxContext} from "react-redux";
import {useAppSelector} from "../../state/hooks";
import {setSearchError} from "../../state/slices/searchSlice";

const StyledAlert = styled.div`
    z-index: 2;
    width: 100%;
    max-width: 250px;
    margin-top: 15px;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    border-radius: 25px;
`;

export const Notification = ({title, message, errors}) => {
    const { store } = useContext(ReactReduxContext);
    const searchError = useAppSelector((state) => state.search.searchError);
    const searchErrorType = useAppSelector((state) => state.search.searchErrorType);

    const closeAlert = () => {
        store.dispatch(setSearchError({errorState: false, data: ['']}))
    }

    return (
        <>
            <CSSTransition
                in={searchError}
                timeout={300}
                classNames="alert"
                unmountOnExit
            >
                <StyledAlert>
                    <Alert bsPrefix={searchErrorType === 'error' ? 'alert-style' : ''} show={searchError} variant={searchErrorType} onClose={closeAlert}>
                        <Alert.Heading>{title}</Alert.Heading>
                        <p>{message}</p>
                        <p>{errors}</p>
                        <hr></hr>
                        <Button align={'right'} onClick={closeAlert}>Sulje</Button>
                    </Alert>
                </StyledAlert>
            </CSSTransition>
        </>
    );
}
export default Notification;