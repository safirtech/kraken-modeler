import React, { memo, FC, CSSProperties } from 'react';

import { Card, Container, Row, Col } from 'react-bootstrap'

import { FaWarehouse, FaEye } from 'react-icons/fa'
import { MdFunctions } from 'react-icons/md'
import { HiOutlineDatabase, HiOutlineTable, HiOutlineTemplate } from 'react-icons/hi'
import { RiChatSmileLine } from 'react-icons/ri'
import { AiOutlineCloudServer } from 'react-icons/ai'

import Handle from '../Handle';
import { NodeProps, Position, Connection, Edge } from '../../types';



const targetHandleStyle: any = { background: '#97E0C7', top: 16, padding: 1, left: -6.5, borderRadius: 1 };

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params);



const SecurableGroupNode: FC<NodeProps> = ({ data }) =>
{
  const getObjectCards = ({ label, securableObjects, connector_type }: any) =>
  {
    //console.log({ securableObjects, connector_type, data })
    const topHierarchy = objectTypeHierarchy[connector_type]

    const getSubObjectCards = (hierarchy: any, parentId: string = "") =>
    {
      let cardArr = []
      //console.log({ hierarchy, parentId })
      // loop through the hierarchy to find object types and then loop through securable objects to get those
      for (const obj in hierarchy)
      {
        let { type: objType, children, icon, level } = hierarchy[obj]  // type here is { type: 'securable' }
        //console.log({ children })
        // obj is going to be something like 'warehouse'
        let counter: number = 0
        const colNum = 15

        let rowArr = []

        for (let so = 0; so < securableObjects.length; so++)
        {
          const { type, identifier, name, _id } = securableObjects[so]
          if (type === obj && identifier.startsWith(parentId))
          {
            rowArr.push(
              <Col>
                <Card className={`card-${obj}`}>
                  <Card.Header>
                    <Handle type="target" position={Position.Left} id={type + "-" + _id} style={targetHandleStyle} onConnect={onConnect} isConnectable={true} />
                    <i>{icon}</i>   {name}
                  </Card.Header>
                  <Card.Body>
                    {(children) && getSubObjectCards(children, identifier)}
                  </Card.Body>
                </Card>
              </Col>
            )
          }



          if (counter++ % colNum == 0)
          {
            if (level === 1)
              cardArr.push(<Row key={`${obj}_${_id}`}>{rowArr}</Row>)
            else
              cardArr.push(<span key={`${obj}_${_id}`}>{rowArr}</span>)

            rowArr = []
          }
        }
        if (counter % colNum != 0)
        {
          cardArr.push(<Row key={obj}>{rowArr}</Row>)
        }
      }

      //console.log({ cardArr })

      return cardArr
    }

    return <Container style={{ width: '1900px' }}>
      <Card>
        <Card.Header>
          <Handle type="target" position={Position.Left} id="account" style={targetHandleStyle} onConnect={onConnect} isConnectable={true} />
          <i><AiOutlineCloudServer /></i>    {data.label}
        </Card.Header>
        <Card.Body>
          {getSubObjectCards(topHierarchy)}
        </Card.Body>
      </Card>
    </Container>
  }


  return (
    <div
      className={'container-node-bg-' + data.objectType + ' container-node-bg'} >

      {
        getObjectCards(data)}

    </div>
  );
};

export default memo(SecurableGroupNode);

function getRandomNum(floor: number, ceil: number)
{
  const max = Math.ceil(ceil + 1);
  const min = Math.floor(floor - 1);
  return Math.floor(Math.random() * (min - max + 1)) + max;
}

const objectTypeHierarchy = {
  snowflake: {
    warehouse: { type: 'securable', icon: <FaWarehouse />, level: 1 },
    database: {
      type: 'securable',
      icon: <HiOutlineDatabase />,
      level: 1,
      children: {
        schema: {
          type: 'securable',
          icon: <HiOutlineTemplate />,
          level: 2,
          children: {
            table: {
              icon: <HiOutlineTable />,
              level: 3
            },
            view: {
              icon: <FaEye />,
              level: 3
            },
            stage: {
              icon: <RiChatSmileLine />,
              level: 3
            },
            stored_procedure: {
              icon: <RiChatSmileLine />,
              level: 3
            },
            udfs: {
              icon: <RiChatSmileLine />,
              level: 3
            },
            sequence: {
              icon: <RiChatSmileLine />,
              level: 3
            }
          }
        }
      }
    },

    efs: { type: 'securable', icon: <MdFunctions />, level: 1 },
  }
}