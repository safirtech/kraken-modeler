export function policyToView(policyData, filter)
{
    // need to take the policy data and convert it to elements
    // extract roles and send all other objects in securableGroupNode objects
    let elements = []

    // this will get replace by something more sophisticated
    let roleY = -45
    const roleYInc = 50
    let sgY = -500
    const sgYInc = 505

    // array for roles in case of mergeRoles
    let roleArr = []

    // array for edges for combining purposes
    let edgesArr = []

    // top level loop on accounts
    for (const pd in policyData)
    {
        const { name, connector_type, identifier, access_objects, securable_objects, connector_id } = policyData[pd]



        // loop through objects to extract roles
        let securableObjects = []



        for (const o in securable_objects)
        {
            const object = securable_objects[o]
            const { type: objectType, identifier: objectId, name: objectName, grants, hasGrants } = object

            //console.log({ objectType, objectId })

            if (!filter.hide[objectType]?.includes("all") && !filter.hide[objectType]?.includes(objectId))
                securableObjects.push(object)


        }

        for (const a in access_objects)
        {
            const object = access_objects[a]
            const { type: objectType, identifier: objectId, name: objectName, grants, hasGrants } = object

            //console.log({ objectType, objectId })

            if (!filter.hide.role.includes("all") && objectType === 'role')
            {


                if (!filter.hide.role.includes(objectId))
                {

                    let id = `${objectType}-${objectName}-${getRandomNum(1000000000, 9999999999)}`

                    let createNewRole = true
                    if (filter.mergeRoles)
                    {
                        for (const e in elements)
                        {
                            const el = elements[e]
                            if (el.data && objectName === el.data.label)
                            {
                                //console.log("we've got a dup here")
                                createNewRole = false
                                id = el.id
                                el.data.accounts.push(identifier)
                            }
                        }
                    }

                    if (createNewRole)
                    {
                        //console.log("pushing role: " + createNewRole)
                        elements.push({
                            id,
                            type: 'input',
                            data: { label: objectName, connector_id, objectType, accounts: [identifier] },
                            position: { x: 5, y: roleY += roleYInc },
                            sourcePosition: 'right'
                        })
                    }

                    // now we need to set our edges
                    if (hasGrants)
                    {
                        // loop through grants
                        for (const g in grants)
                        {
                            const grant = grants[g]
                            const grantSections = grant.split(";")
                            const grantType = grantSections[0]
                            const grantObjType = grantSections[1].toLowerCase()
                            const grantObjID = grantSections[2]

                            if (!filter.hide.grants.includes("all") && !filter.hide.grants.includes(grantType))
                            {
                                const target = `sg-${identifier}`
                                const targetHandle = (grantObjType != 'account') ? `${grantObjType}-${grantObjID}` : 'account'
                                // need to check if the edge already exists... if so just add the grantType
                                let edgeIndex = edgesArr.findIndex(edge => edge.targetHandle === targetHandle && edge.target === target)

                                const strokeStyles = ['springgreen', 'white', 'green', 'lightblue', 'Azure', 'coral']
                                //console.log(edgeIndex)
                                if (edgeIndex > -1)
                                {
                                    const edgeCopy = edgesArr[edgeIndex]
                                    //console.log(edgeCopy)
                                    edgesArr[edgeIndex] = { ...edgeCopy, permissions: [...edgeCopy.permissions, grantType] }
                                }
                                else
                                    edgesArr.push({
                                        id: getRandomNum(100000000000, 999999999999),
                                        animated: true,
                                        source: id,
                                        style: { stroke: strokeStyles[getRandomNum(0, 5)] },
                                        target,
                                        targetHandle,
                                        permissions: [grantType]
                                    })
                            }
                        }
                    }
                }
            }
        }

        // now we have our securable objects.  let's put them in a securable group node
        elements.push({
            id: `sg-${identifier}`,
            type: 'securable_group',
            data: { label: name, connector_id, securableObjects, connector_type },
            position: { x: 450, y: sgY += sgYInc }
        })


    } // loop on connectors






    return elements.concat(edgesArr)
}

/*
{
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
    sourcePosition: 'right'
  },
  {
    id: '2',
    type: 'warehouse',
    data: { label: 'warehouse' },
    position: { x: 250, y: 150 }
  }

  */

function getRandomNum(floor, ceil)
{
    const max = Math.ceil(ceil + 1);
    const min = Math.floor(floor - 1);
    return Math.floor(Math.random() * (min - max + 1)) + max;
}