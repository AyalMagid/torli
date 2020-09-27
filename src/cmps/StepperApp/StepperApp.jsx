import React from 'react';
import { connect } from 'react-redux';
import {MuiThemeProvider,createMuiTheme,makeStyles} from "@material-ui/core/styles";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import './StepperApp.scss'

// StepperApp style
const theme = createMuiTheme({
// add margin left from the circules
  palette: {
    primary: {
      main: '#e91e63'
    }
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));


export function _StepperApp(props) {

  const classes = useStyles();



  return (
    <div className={classes.root}>

  <MuiThemeProvider theme={theme}>
      <Stepper activeStep={props.activeStep}>
        {props.steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step  key={label} {...stepProps}>
              <StepLabel  {...labelProps}>{label}  </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </MuiThemeProvider>
    </div>
  );
}


function mapStateProps(state) {
  return {
    steps: state.StepperReducer.steps,
    activeStep:state.StepperReducer.step
  }
}

const mapDispatchToProps = {

}

export const StepperApp = connect(mapStateProps, mapDispatchToProps)(_StepperApp)