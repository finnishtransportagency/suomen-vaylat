import React, {useContext} from "react";
import Alert from 'react-bootstrap/Alert';
import styled from "styled-components";
import {Button} from 'react-bootstrap';
import {ReactReduxContext} from "react-redux";
import {useAppSelector} from "../../state/hooks";
import {setSearchError} from "../../state/slices/searchSlice";

const StyledAlert = styled.div`
    z-index: 2;
    // position: fixed;
    width: 100%;
    max-width: 250px;
    // height: 100vh;
    // padding: 50px;
    margin-top: 15px;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    border-radius: 15px;
    // align-items: center;
    // flex-direction: column;
    // pointer-events: none;
`;

export const Notification = ({title, message, errors}) => {
    const { store } = useContext(ReactReduxContext);
    const searchError = useAppSelector((state) => state.search.searchError);
    const searchErrorType = useAppSelector((state) => state.search.searchErrorType);
    console.log("Notification errors ", errors)

    const closeAlert = () => {
        console.log("close alert")
        store.dispatch(setSearchError({errorState: false, data: ['']}))
    }

    return (
        <>
            <StyledAlert>
                <Alert show={searchError} variant={searchErrorType} onClose={closeAlert}>
                    <Alert.Heading>{title}</Alert.Heading>
                    <p>{message}</p>
                    <p>{errors}</p>
                    <hr></hr>
                    <Button align={'right'} onClick={closeAlert}>Sulje</Button>
                </Alert>
            </StyledAlert>
        </>
    );
}
export default Notification;