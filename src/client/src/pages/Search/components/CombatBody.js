import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import CombatBodyConstants from '../constants/CombatBodyConstants';
import MediaQuery from 'shared/helpers/MediaQuery';
import Label from './Label';
import Range from './Range';

const title = 'Combat';

const mapStateToProps = (state, props) => {
  return {...props, selectedTab: state.searchPage.tab.selectedTab };
};

const Div = styled.div`
  height: ${CombatBodyConstants.height}${CombatBodyConstants.heightUnit};
  width: ${CombatBodyConstants.width}${CombatBodyConstants.widthUnit};

  display: ${props => props.selectedTab !== title ? 'none' : 'block'};

  max-width: 95%;
`;



const gridMediaQueries = MediaQuery.create([
  {
    property: 'grid-template-columns',
    function: MediaQuery.arrayAndUnitToSizes,
    args: {
      sizes: Object.values(CombatBodyConstants.gridColumns.sizes),
    },
    recipeArgsGetter: (args, index) => {
      return {
        sizes: args.sizes[index],
        unit: CombatBodyConstants.gridColumns.unit,
      };
    },
  },
  {
    property: 'grid-template-rows',
    function: MediaQuery.arrayAndUnitToSizes,
    args: {
      sizes: CombatBodyConstants.gridRows.sizes,
    },
    recipeArgsGetter: (args, index) => {
      return {
        sizes: args.sizes[index],
        unit: CombatBodyConstants.gridRows.unit,
      };
    },
  }
]);

const Grid = styled.div`
  display: grid;

  margin-left: ${CombatBodyConstants.gridLeftMargin}${CombatBodyConstants.gridLeftMarginUnit};
  height: 100%;
  width: 100%;

  justify-content: center;

  ${gridMediaQueries};

  grid-template-areas:
    "offenseLabel offenseLabel . defenseLabel defenseLabel"
    "damage damageRange . armour armourRange"
    "dps dpsRange . block blockRange"
    "aps apsRange . evasion evasionRange"
    "edps edpsRange . shield shieldRange"
    "criticalStrike criticalStrikeRange . . ."
    "pdps pdpsRange . . .";
`;

const GridArea = styled.span`
  grid-area: ${props => props.area};
  display: flex;

  align-items: center;
`;

const HeadingGridArea = GridArea.extend`

  &&& {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
`;

@connect(mapStateToProps)
class CombatBody extends Component {
  render() {
    return (
      <Div selectedTab={this.props.selectedTab}>
          <Grid>
            <HeadingGridArea area="offenseLabel">
              <Label value="Offense" heading={true} />
            </HeadingGridArea>

            <GridArea area="damage">
              <Label value="Damage" />
            </GridArea>
            <GridArea area="dps">
              <Label value="DPS" />
            </GridArea>
            <GridArea area="aps">
              <Label value="APS" />
            </GridArea>
            <GridArea area="edps">
              <Label value="eDPS" />
            </GridArea>
            <GridArea area="criticalStrike">
              <Label value="Critical Strike" />
            </GridArea>
            <GridArea area="pdps">
              <Label value="pDPS" />
            </GridArea>

            <GridArea area="damageRange">
              <Range />
            </GridArea>
            <GridArea area="dpsRange">
              <Range />
            </GridArea>
            <GridArea area="apsRange">
              <Range />
            </GridArea>
            <GridArea area="edpsRange">
              <Range />
            </GridArea>
            <GridArea area="criticalStrikeRange">
              <Range />
            </GridArea>
            <GridArea area="pdpsRange">
              <Range />
            </GridArea>


            <HeadingGridArea area="defenseLabel">
              <Label value="Defense" heading={true} />
            </HeadingGridArea>

            <GridArea area="armour">
              <Label value="Armour" />
            </GridArea>
            <GridArea area="block">
              <Label value="Block" />
            </GridArea>
            <GridArea area="evasion">
              <Label value="Evasion" />
            </GridArea>
            <GridArea area="shield">
              <Label value="Shield" />
            </GridArea>

            <GridArea area="armourRange">
              <Range />
            </GridArea>
            <GridArea area="blockRange">
              <Range />
            </GridArea>
            <GridArea area="evasionRange">
              <Range />
            </GridArea>
            <GridArea area="shieldRange">
              <Range />
            </GridArea>
          </Grid>
      </Div>
    );
  }
}

export default CombatBody;
