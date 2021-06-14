import React, { Component } from 'react';
import RecursiveAccordion from './RecursiveAccordion';

var groups =[{"name":"Taustakartat","layers":[3,5],"groups":[{"name":"testi","layers":[5],"id":2,"parentId":1}],"id":1,"parentId":-1}];

var baseItems = [
  { id: 1, title: "Land", body: "", parentId: 0 },
  { id: 2, title: "Sea", body: "Submarine", parentId: 0 },
  {
    id: 8,
    title: "Air",
    body: "Helicopter",
    parentId: 0
  },
  { id: 3, title: "Cars", body: "", parentId: 1 },
  { id: 4, title: "Vans", body: "TransitSprinter", parentId: 1 },
  {
    id: 5,
    title: "Boats",
    body: "Speedboat",
    parentId: 2
  },
  { id: 6, title: "Petrol", body: "", parentId: 3 },
  { id: 7, title: "Automatic", body: "", parentId: 6 },
  { id: 9, title: "2.0L", body: "BMW", parentId: 7 }
];



export const LayerList = () => {

    return (
      <RecursiveAccordion items={baseItems} recurse={false} />
      );
};


export default LayerList;