import React, { useState, useEffect } from 'react';

import ReactFlow, {
    MiniMap,
    addEdge,
    removeElements,
    Controls,
    OnLoadParams,
    Elements,
    Connection,
    Edge,
    ElementId,
    Node,
    Background,
    Sidebar
} from '../../index';

import { policyToView } from './util'

const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();
const onNodeDragStop = (_, node) => console.log('drag stop', node);
const onElementClick = (_, element) => console.log('click', element);
const onDragOver = (event) =>
{
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};

const KrakenModeler = ({
    policyData,
    viewSettings,
    onUpdate,
    initialPolicyView,
    ...rest
}) =>
{

    const [elements, setElements] = useState(initialPolicyView);

    // let's first check if we're loading an existing policyView
    // if so, we don't have to build a policyView from policyData
    useEffect(() =>
    {
        if (initialPolicyView.length < 1)
        {
            console.log("initialPolicyView is null")
            setElements(policyToView(policyData))
        }
    }, [])

    const onElementsRemove = (elementsToRemove) =>
    {
        console.log("removing..." + elementsToRemove)
        setElements((els) => removeElements(elementsToRemove, els));
        onUpdate(elementsToRemove)
        // if a role was removed, we can ignore the removed edges with same source value
    }
    const onConnect = (params) => 
    {
        // set edge styles based on viewSettings and conn type
        const strokeStyles = ['springgreen', 'white', 'green', 'lightblue', 'Azure', 'coral']
        params = { animated: true, style: { stroke: strokeStyles[getRandomNum(0, 5)] }, ...params }
        setElements((els) => addEdge(params, els));
        onUpdate(params)
    }



    return (
        <div className="reactflow-wrapper">
            <ReactFlow
                elements={elements}
                onElementClick={onElementClick}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                onNodeDragStop={onNodeDragStop}
                onLoad={onLoad}
                snapToGrid={true}
            >
                <MiniMap />
                <Controls />
                <Sidebar />
            </ReactFlow>
        </div>
    )
}



export default KrakenModeler;


function getRandomNum(floor, ceil)
{
    const max = Math.ceil(ceil + 1);
    const min = Math.floor(floor - 1);
    return Math.floor(Math.random() * (min - max + 1)) + max;
}