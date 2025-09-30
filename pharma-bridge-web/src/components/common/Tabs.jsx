import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from './Typography';

const TabsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TabHeaders = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 20px;
`;

const TabHeader = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
    transition: background-color 0.3s ease;
  }
`;

const TabContent = styled.div`
  display: ${({ $active }) => $active ? 'block' : 'none'};
  padding: 10px 0;
`;

export const TabContainer = ({ children, activeTab: externalActiveTab, onChange }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(0);
  
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  
  const handleTabClick = (index) => {
    if (onChange) {
      onChange(index);
    } else {
      setInternalActiveTab(index);
    }
  };
  
  // Filter out only Tab components
  const tabs = React.Children.toArray(children).filter(
    (child) => child.type === Tab
  );
  
  return (
    <TabsContainer>
      <TabHeaders>
        {tabs.map((tab, index) => (
          <TabHeader
            key={index}
            $active={activeTab === index}
            onClick={() => handleTabClick(index)}
          >
            <Typography variant="subtitle1" color={activeTab === index ? 'primary' : 'inherit'}>
              {tab.props.label}
            </Typography>
          </TabHeader>
        ))}
      </TabHeaders>
      
      {tabs.map((tab, index) => (
        <TabContent key={index} $active={activeTab === index}>
          {tab.props.children}
        </TabContent>
      ))}
    </TabsContainer>
  );
};

export const Tab = ({ children }) => {
  return <>{children}</>;
};