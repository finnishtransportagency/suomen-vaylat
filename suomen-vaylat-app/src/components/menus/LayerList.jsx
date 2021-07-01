
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import LayerGroup from './LayerGroup';

export const LayerList = ({ groups, layers, recurse = false}) => {

    return (
        <>
        {groups.map((group, index) => {
            var hasChildren = false;
            if(group.groups) {
                hasChildren = group.groups.length > 0;
            }
            return (
                <>
                   <LayerGroup group={group} layers={layers} hasChildren={hasChildren} />
                </>

            );
        })
        }
        </>
    );
  };

  export default LayerList;