import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';

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

import { cloneDeep } from "lodash";

// TODO move to reducer
import { policyToView } from './util'

import store from '../../store';

const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();
const onNodeDragStop = (_, node) => console.log('drag stop', node);
const onElementClick = (_, element) => console.log('click', element);
const onDragOver = (event) =>
{
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};

// all grants
// ['USAGE', 'INSERT', 'MODIFY', 'REBUILD', 'REFERENCES', 'DELETE', 'TRUNCATE', 'UPDATE', 'CREATE ROLE', 'CREATE USER', 'CREATE DATABASE', 'CREATE WAREHOUSE',  'MANAGE GRANTS', 'OWNERSHIP', 'MONITOR', 'CREATE SCHEMA', 'REFERENCE_USAGE', 'SELECT']
const initialPolicyFilter = {
    hide: {
        role: [],     //['ACCOUNTADMIN', 'PUBLIC', 'USERADMIN', 'KRAKEN'],
        grants: [],   //['USAGE', 'INSERT', 'MODIFY', 'REBUILD', 'REFERENCES', 'DELETE', 'UPDATE', 'CREATE ROLE', 'CREATE USER', 'CREATE DATABASE', 'CREATE WAREHOUSE', 'MANAGE GRANTS', 'OWNERSHIP', 'MONITOR', 'CREATE SCHEMA', 'REFERENCE_USAGE'],
        schema: [],
        table: [],    //['SNOWFLAKE', 'SNOWFLAKE_SAMPLE_DATA'],
        database: [], //['SNOWFLAKE', 'SNOWFLAKE_SAMPLE_DATA'],
        view: [],
        warehouse: []    //['all']
    },
    mergeRoles: false
}

// this should be derived from policyData
const accessMeta = {
    grants: ['USAGE', 'INSERT', 'MODIFY', 'REBUILD', 'REFERENCES', 'DELETE', 'TRUNCATE', 'UPDATE', 'CREATE ROLE', 'CREATE USER', 'CREATE DATABASE', 'CREATE WAREHOUSE', 'MANAGE GRANTS', 'OWNERSHIP', 'MONITOR', 'CREATE SCHEMA', 'REFERENCE_USAGE', 'SELECT'],
    role: ['ACCOUNTADMIN', 'PUBLIC', 'USERADMIN', 'KRAKEN', 'ANALYST']
}
const securableMeta = {
    schema: true,
    table: true,
    database: true,
    view: true
}

const KrakenModeler = ({
    policyData,
    viewSettings,
    onUpdate,
    initialPolicyView,  // policy view is made up of elements and a filter 
    ...rest
}) =>
{

    const [elements, setElements] = useState(initialPolicyView);

    const [policyFilter, setPolicyFilter] = useState(initialPolicyFilter);

    const [localPolicyData, setPolicyData] = useState(policyData);

    const [connMeta, setConnMeta] = useState({})




    // let's first check if we're loading an existing policyView
    // if so, we don't have to build a policyView from policyData
    useEffect(() =>
    {
        //console.log("initialPolicyView is null")
        setElements(policyToView(localPolicyData, policyFilter))

    }, [policyFilter, localPolicyData])

    useEffect(() =>
    {
        console.log({ localPolicyData })
        setConnMeta(localPolicyData.reduce((acc, accounts) =>
        {
            const { access_meta, securable_meta } = accounts
            console.log({ access_meta, securable_meta })
            return { ...acc, ...access_meta, ...securable_meta }
        }, {}))
        console.log({ connMeta })
    }, [localPolicyData])




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

    const onFilterChange = (filterEvent) => 
    {
        const id = filterEvent.target.id
        const valArr = id.split("-")
        const type = valArr[1]
        const item = valArr[2]

        if (type === 'global')
        {
            if (item === 'mergeRoles')
                setPolicyFilter({ ...policyFilter, mergeRoles: !policyFilter.mergeRoles })
        }
        else
        {


            const hide = policyFilter.hide
            const typeHide = hide[type]
            if (item === 'selectAll')
            {
                // if there are any items in the array then take them out
                if (typeHide.length > 0)
                    setPolicyFilter({ ...policyFilter, hide: { ...hide, [type]: [] } })
                // if there are no items in the array then put them all in
                else
                    setPolicyFilter({ ...policyFilter, hide: { ...hide, [type]: connMeta[type] } })

            }
            else
            {
                // first see if the item is already in the array
                const itemIndex = typeHide.indexOf(item)
                console.log({ itemIndex })
                const clone = cloneDeep(policyFilter)

                if (itemIndex > -1)
                    clone.hide[type].splice(itemIndex, 1)
                else
                    clone.hide[type].push(item)

                setPolicyFilter(clone)
                // console.log({ clone })
            }
        }

    }

    console.log({ connMeta2: connMeta })

    return (
        <Provider store={store}>
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
                </ReactFlow>
                <Sidebar
                    connMeta={connMeta}
                    onFilterChange={onFilterChange}
                    policyFilter={policyFilter}
                />
            </div>
        </Provider>
    )
}

export default KrakenModeler;


function getRandomNum(floor, ceil)
{
    const max = Math.ceil(ceil + 1);
    const min = Math.floor(floor - 1);
    return Math.floor(Math.random() * (min - max + 1)) + max;
}