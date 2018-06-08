import React from 'react';
import styled from 'styled-components';

import NumericField from './NumericField';


const RangeContainer = styled.span`
`;

function Range(props) {
  return (
    <RangeContainer>
        <NumericField placeholder="Min" small={props.small}/>
        <NumericField placeholder="Max" small={props.small}/>
    </RangeContainer>
  );
}

export default Range;
