import React, { Component } from 'react';
import RecursiveAccordion from './RecursiveAccordion';

var baseItems = [
  { id: 1, title: "Land", body: "", parentId: 0 },
  { id: 2, title: "Sea", body: "Submarine", parentId: 0 },
  {
    id: 8,
    title: "Air",
    body: "Helicopter<br />Aeroplanes<br />Drones",
    parentId: 0
  },
  { id: 3, title: "Cars", body: "", parentId: 1 },
  { id: 4, title: "Vans", body: "Transit<br />Sprinter", parentId: 1 },
  {
    id: 5,
    title: "Boats",
    body: "Speedboat<br />Fishing Boat<br />Dinghy",
    parentId: 2
  },
  { id: 6, title: "Petrol", body: "", parentId: 3 },
  { id: 7, title: "Automatic", body: "", parentId: 6 },
  { id: 9, title: "2.0L", body: "BMW X3<br />Mercedes GLC<br />Audi Q5", parentId: 7 }
];



export const LayerList = () => {

    return (
      <RecursiveAccordion items={baseItems} recurse={false} />
      );
};


export default LayerList;