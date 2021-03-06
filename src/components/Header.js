import React, { memo } from 'react';
import styled from 'styled-components';
import { modularScale } from 'polished';
import Logotype from './Logotype';

const HeaderContainer = styled.header`
  padding: ${modularScale(1)};
  background-color: #ffdd67;
`;

const Header = memo(() => (
  <HeaderContainer>
    <Logotype />
  </HeaderContainer>
));

export { Header as default };
