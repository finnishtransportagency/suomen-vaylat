import styled from "styled-components";
import { motion } from "framer-motion";

const StyledLoaderContainer = styled.div`
    z-index: 999;
    height: 100%;
    max-width: 200px;
    max-height: 200px;
  svg {
    width: 100%;
    height: 100%;
    fill: none;
    //stroke: white;
    //stroke-width: 0.1;
  }
`;

const pathVariants = {
  hidden: {
    opacity: 0,
    fill: "#0064af00",
    //pathLength: 0
  },
  visible: {
    opacity: [0, 1, 0],
    fill: ["#0064af00", "#0064af", "#0064af00"],
    //pathLength: [0, 1, 0],
    transition: {
      duration: 3,
      delay: 0,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

const pathVariants2 = {
  hidden: {
    opacity: 0,
    fill: "#0064af00",
    //pathLength: 0
  },
  visible: {
    opacity: [0, 1, 0],
    fill: ["#0064af00", "#0064af", "#0064af00"],
    //pathLength: [0, 1, 0],
    transition: {
      duration: 3,
      delay: 0.3,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

const pathVariants3 = {
  hidden: {
    opacity: 0,
    fill: "#0064af00",
    //pathLength: 0
  },
  visible: {
    opacity: [0, 1, 0],
    fill: ["#0064af00", "#0064af", "#0064af00"],
    //pathLength: [0, 1, 0],
    transition: {
      duration: 3,
      delay: 0.6,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

const SvLoader = () => {
  return (
    <StyledLoaderContainer>

        <svg
          className="svlogo-svg"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 99.213 99.213"
        >
          <g>
            <g>
              <motion.path
                d="M21.927,26.794h12.279c0.878,0,1.121,0.3,1.335,0.802c0.118,0.277,7.39,17.668,7.39,17.668
                    l-17.694-10.51L21.927,26.794z"
                variants={pathVariants}
                initial="visible"
                animate={"visible"}
              />
            </g>
            <g>
              <motion.polygon
                points="25.633,35.691 43.298,46.146 45.817,52.224 35.181,58.55"
                variants={pathVariants2}
                initial="hidden"
                animate={"visible"}
              />
            </g>
            <g>
              <motion.polygon
                points="35.434,59.07 46.066,52.763 47.678,56.658 41.231,73.042"
                variants={pathVariants3}
                initial="hidden"
                animate={"visible"}
              />
            </g>
            <g>
              <motion.path
                d="M78.619,26.794H66.34c-0.878,0-1.121,0.3-1.335,0.802c-0.118,0.277-7.39,17.668-7.39,17.668
                    l17.694-10.51L78.619,26.794z"
                variants={pathVariants}
                initial="hidden"
                animate={"visible"}
              />
            </g>
            <g>
              <motion.polygon
                points="74.913,35.691 57.248,46.146 54.729,52.224 65.365,58.55"
                variants={pathVariants2}
                initial="hidden"
                animate={"visible"}
              />
            </g>
            <g>
              <motion.polygon
                points="65.112,59.07 54.48,52.763 52.868,56.658 59.315,73.042"
                variants={pathVariants3}
                initial="hidden"
                animate={"visible"}
              />
            </g>
          </g>
        </svg>
    </StyledLoaderContainer>
  );
};

export default SvLoader;
