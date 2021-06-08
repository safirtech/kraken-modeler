import React, { memo, FC, useState } from 'react';

import { Card, Container, Row, Col, Collapse, Button } from 'react-bootstrap'

import { FaWarehouse, FaEye } from 'react-icons/fa'
import { MdFunctions } from 'react-icons/md'
import { HiOutlineDatabase, HiOutlineTable, HiOutlineTemplate } from 'react-icons/hi'
import { RiChatSmileLine } from 'react-icons/ri'
import { AiOutlineCloudServer, AiOutlineMinusSquare } from 'react-icons/ai'

import Handle from '../Handle';
import { NodeProps, Position, Connection, Edge } from '../../types';



const targetHandleStyle: any = { background: '#97E0C7', top: 16, padding: 1, left: -6.5, borderRadius: 1 };

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params);



const SecurableGroupNode: FC<NodeProps> = ({ data }) =>
{
  const [secObjects, setSecObjects] = useState(data.securableObjects);

  const onCollapseClick = () =>
  {
    console.log("collapse clicked")
  }
  //console.log({ data })

  const getObjectCards = ({ label, connector_type }: any) =>
  {
    //console.log({ securableObjects, connector_type, data })
    const topHierarchy = objectTypeHierarchy[connector_type]

    const getSubObjectCards = (hierarchy: any, parentId: string = "") =>
    {
      let cardArr = []
      //console.log({ hierarchy, parentId })
      // loop through the hierarchy to find object types and then loop through securable objects to get those
      let rowArr = []
      for (const obj in hierarchy)
      {
        //console.log({ obj })
        let { type: objType, children, icon, level } = hierarchy[obj]  // type here is { type: 'securable' }
        //console.log({ children })
        // obj is going to be something like 'warehouse'
        let counter: number = 0
        const colNum = 5


        let inLoopArr = false

        for (let so = 0; so < data.securableObjects?.length; so++)
        {
          const { type, identifier, name, _id } = data.securableObjects[so]
          if (type === obj && identifier.startsWith(parentId))
          {
            //console.log({ identifier })
            rowArr.push(
              <Col key={`${obj}_${getRandomNum(1000000000, 9999999999)}`}>
                <Card className={`card-${obj}`}>
                  <Card.Header>
                    <Handle type="target" position={Position.Left} id={type + "-" + identifier} style={targetHandleStyle} onConnect={onConnect} isConnectable={true} />
                    <i>{icon}</i>   {name}
                  </Card.Header>
                  <Card.Body>
                    {(children) && getSubObjectCards(children, identifier)}
                  </Card.Body>
                </Card>
              </Col>
            )
            //console.log({ indetifier2: identifier, level, rowArr, so, secObjsLen: securableObjects.length })
            if (level === 1 && ++counter % colNum == 0)
            {
              console.log("level 1 push")
              cardArr.push(<Row key={`${obj}_${_id}`}>{rowArr}</Row>)

              rowArr = []
            }
          }

          if (level !== 1 && so == data.securableObjects?.length - 1 && rowArr.length > 0)
          {
            //console.log("lower level push")
            cardArr.push(<Row key={`${obj}_${_id}`}>{rowArr}</Row>)

            rowArr = []
          }
        }
        if (level === 1 && rowArr.length > 0 && ++counter % colNum != 0)
        {
          //console.log("outer level 1 push")
          cardArr.push(<Row key={`${obj}_${getRandomNum(1000000000, 9999999999)}`}>{rowArr}</Row>)

          rowArr = []
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

          <i style={{ position: 'relative', left: 1050 }}><AiOutlineMinusSquare /></i>

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