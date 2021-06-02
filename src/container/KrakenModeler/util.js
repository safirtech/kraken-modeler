export function policyToView(policyData)
{
    // need to take the policy data and convert it to elements
    // extract roles and send all other objects in securableGroupNode objects
    let elements = []

    for (const pd in policyData)
    {
        const { name, connector_type, identifier, objects, connector_id } = policyData[pd]

        // loop through objects to extract roles
        let securableObjects = []

        // this will get replace by something more sophisticated
        let roleY = -45
        const roleYInc = 50

        for (const o in objects)
        {
            const object = objects[o]
            const { type: objectType, identifier: objectId, name: objectName } = object

            if (objectType === 'role')
            {
                elements.push({
                    id: `${objectType}-${objectId}`,
                    type: 'input',
                    data: { label: objectName, connector_id },
                    position: { x: 50, y: roleY += roleYInc },
                    sourcePosition: 'right'
                })
            }
            else
                securableObjects.push(object)


        }

        // now we have our securable objects.  let's put them in a securable group node
        elements.push({
            id: `sg_${identifier}`,
            type: 'securable_group',
            data: { label: name, connector_id, securableObjects, connector_type },
            position: { x: 250, y: 5 }
        })


    } // loop on connectors

    console.log(elements)
    return elements
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

