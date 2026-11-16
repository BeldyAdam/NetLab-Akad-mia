import React from 'react';
import type { SimulationType } from '../../types/curriculum';
import { TopologySimulator } from './TopologySimulator';
import { OsiEncapsulationSim } from './OsiEncapsulationSim';
import { SwitchMacTableSim } from './SwitchMacTableSim';
import { SubnetCalculatorSim } from './SubnetCalculatorSim';
import { RouterForwardingSim } from './RouterForwardingSim';
import { VlanTrunkSim } from './VlanTrunkSim';
import { DhcpNatSim } from './DhcpNatSim';
import { CapstoneBuilderSim } from './CapstoneBuilderSim';

interface SimulationHostProps {
  type: SimulationType;
}

export const SimulationHost: React.FC<SimulationHostProps> = ({ type }) => {
  switch (type) {
    case 'topology':
      return <TopologySimulator />;
    case 'osi-encapsulation':
      return <OsiEncapsulationSim />;
    case 'switch-mac-table':
      return <SwitchMacTableSim />;
    case 'subnet-calculator':
      return <SubnetCalculatorSim />;
    case 'router-forwarding':
      return <RouterForwardingSim />;
    case 'vlan-trunk':
      return <VlanTrunkSim />;
    case 'dhcp-nat':
      return <DhcpNatSim />;
    case 'capstone-verify':
      return <CapstoneBuilderSim />;
    default:
      return null;
  }
};
