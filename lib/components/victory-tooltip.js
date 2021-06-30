import React from "react";
import { G } from "react-native-svg";
import { VictoryTooltip } from "victory-tooltip/es";
import VictoryLabel from "./victory-label";
import VictoryPortal from "./victory-portal/victory-portal";
import Flyout from "./victory-primitives/flyout";

export default class extends VictoryTooltip {
  static defaultProps = Object.assign({}, VictoryTooltip.defaultProps, {
    labelComponent: <VictoryLabel/>,
    flyoutComponent: <Flyout/>,
    groupComponent: <G/>
  });
  
  static lastTargetProps = {};

  static defaultEvents = [{
    target: "data",
    eventHandlers: {
      onPressIn: (targetProps) => {
        VictoryTooltip.lastTargetProps = targetProps;
        return [
          {
            target: "labels",
            mutation: () => ({ active: true })
          }, {
            target: "data",
            mutation: () => targetProps.activateData ? ({ active: true }) : ({ active: undefined })
          }
        ];
      },
      onPressOut: () => {
        return [
          {
            target: "labels",
            mutation: () => ({ active: true })
          }, {
            target: "data",
            mutation: () => VictoryTooltip.lastTargetProps.activateData ? ({ active: true }) : ({ active: undefined })
          }
        ];
      }
    }
  }];

  renderTooltip(props) {
    const evaluatedProps = this.getEvaluatedProps(props);
    const {
      flyoutComponent, labelComponent, groupComponent, active, renderInPortal
    } = evaluatedProps;
    if (!active) {
      return renderInPortal ? <VictoryPortal><G/></VictoryPortal> : <G/>;
    }
    const calculatedValues = this.getCalculatedValues(evaluatedProps);
    const children = [
      React.cloneElement(flyoutComponent, this.getFlyoutProps(evaluatedProps, calculatedValues)),
      React.cloneElement(labelComponent, this.getLabelProps(evaluatedProps, calculatedValues))
    ];
    const tooltip = React.cloneElement(groupComponent, { role: "presentation" }, children);
    return renderInPortal ? <VictoryPortal>{tooltip}</VictoryPortal> : tooltip;
  }
}
