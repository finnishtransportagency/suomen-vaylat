import styled from 'styled-components';
import { useAppSelector } from '../../state/hooks';
import { motion } from "framer-motion";

import DialogHeader from './DialogHeader';

const variants = {
    open: {
        pointerEvents: "auto",
        y: 0,
        opacity: 1,
    },
    closed: {
        pointerEvents: "none",
        y: "100%",
        opacity: 0,

    },
};

const StyledWarningDialog = styled(motion.div)`
    position: absolute;
    left: 50%;
    top: 50%;
    max-width: 300px;
    max-height: 500px;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 4px;
    overflow: hidden;
    overflow-y: auto;
    user-select: none;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
        &::-webkit-scrollbar {
        display: none;
    };
    p {
        padding: 20px;
    }
`;

const WarningDialog = () => {

    const {
        isSideMenuOpen,
    } =  useAppSelector((state) => state.ui);

    return (
            <StyledWarningDialog
                    initial="closed"
                    animate={isSideMenuOpen ? "open" : "closed"}
                    variants={variants}
            >
                <DialogHeader
                    type={"warning"}
                    title={"Varoitus"}
                />
                <p>Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit. Sed augue orci, lacinia eu tincidunt et eleifend nec lacus. Donec ultricies nisl ut felis, suspendisse potenti. Lorem ipsum ligula ut hendrerit mollis, ipsum erat vehicula risus, eu suscipit sem libero nec erat. Aliquam erat volutpat. Sed congue augue vitae neque. Nulla consectetuer porttitor pede. Fusce purus morbi tortor magna condimentum vel, placerat id blandit sit amet tortor.</p>
            </StyledWarningDialog>
    );
 }

 export default WarningDialog;
