import React, { DragEvent, useState } from 'react';

import { Card, Container, Row, Col, Collapse, Button, Form, Accordion } from 'react-bootstrap'
import { AiOutlineConsoleSql } from 'react-icons/ai';

import { MdSearch, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

const onDragStart = (event: DragEvent, nodeType: string) =>
{
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const globalFilters = []




interface SidebarProps
{
  connMeta: any,
  onFilterChange: any,
  policyFilter: any
}

const Sidebar = (
  {
    connMeta,
    onFilterChange,
    policyFilter
  }: SidebarProps
) =>
{
  const [collapsers, setCollapsers] = useState({})


  const handleCheckChange = (event: any) =>
  {
    console.log("ehlloadslfkja")
    onFilterChange(event)
  }

  const handleAccordionChange = (type: string) =>
  {
    console.log(type)
    setCollapsers({ ...collapsers, [type]: (collapsers[type]) ? false : true })
  }

  return (
    <div className="kraken-modeler-sidebar">
      <div className='mv-props-title'>Model View Properties</div>
      <Accordion>
        <Card>
          <Card.Header>
            Object Filters
            <Accordion.Toggle as={Button} variant='link' eventKey='0'>
              <MdKeyboardArrowDown />
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              {Object.getOwnPropertyNames(connMeta).map((type: string, i: number) =>
              {
                //console.log({ type })
                //console.log(policyFilter.hide[type])
                return (
                  <Accordion key={getRandomNum(10000000, 99999999)} activeKey={Object.getOwnPropertyNames(collapsers).find(item => item === type && collapsers[item] === true)}>
                    <Card>
                      <Card.Header onClick={() => handleAccordionChange(type)} >
                        {type.toUpperCase()}
                        <Accordion.Toggle as={Button} variant='link' eventKey={type} >
                          {collapsers[type] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey={type}>
                        <Card.Body>
                          <Form>
                            <Form.Check
                              type='checkbox'
                              id={`filter-${type}-selectAll`}
                              label='select all'
                              defaultChecked={policyFilter.hide[type].length < 1}
                              onChange={handleCheckChange}
                            />
                            {connMeta[type].sort().map((item: string) =>
                            {
                              return (
                                <Form.Check
                                  key={getRandomNum(10000000, 99999999)}
                                  type='checkbox'
                                  id={`filter-${type}-${item}`}
                                  label={item.toUpperCase()}
                                  defaultChecked={!policyFilter.hide[type].includes(item)}
                                  onChange={handleCheckChange}
                                />
                              )
                            })}
                          </Form>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>

                  </Accordion>
                )
              })}

            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion>
        <Card>
          <Card.Header>
            Global Properties
            <Accordion.Toggle as={Button} variant='link' eventKey='1'>
              <MdKeyboardArrowDown />
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Form>
                <Form.Check
                  type='checkbox'
                  id={`filter-global-mergeRoles`}
                  label='Merge Roles'
                  defaultChecked={policyFilter.mergeRoles}
                  onChange={handleCheckChange}
                />
              </Form>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default Sidebar;


function getRandomNum(floor: number, ceil: number)
{
  const max = Math.ceil(ceil + 1);
  const min = Math.floor(floor - 1);
  return Math.floor(Math.random() * (min - max + 1)) + max;
}