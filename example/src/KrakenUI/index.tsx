import React from 'react';
import { KrakenModeler } from 'react-flow-renderer';



import './dnd.css';

const policyData = require('./policyData.json')
const initialPolicyView: any = [

]


const KrakenUI = ({
  viewSettings = {}
}) =>
{
  const onUpdate = (newPolicyData: any) =>
  {
    console.log("there is a policy update") // need to check if an existing line was redrawn
    console.log(newPolicyData)
  }

  const onSavePolicyView = (policyView: any) =>
  {
    console.log("time to back up policyView...")
    console.log(policyView)
  }


  return (
    <div className="dndflow">
      <KrakenModeler
        onUpdate={onUpdate}
        onSavePolicyView={onSavePolicyView}
        policyData={policyData}
        viewSettings
        initialPolicyView={initialPolicyView}
      >
      </KrakenModeler>
    </div>
  );
};

export default KrakenUI;
