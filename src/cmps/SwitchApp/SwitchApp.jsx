import React, { useState } from 'react';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset,createMuiTheme,ThemeProvider } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import './SwitchApp.scss'

const theme = createMuiTheme({
  direction: 'rtl',
});

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export function SwitchApp(props) {

  const [checked, setChecked] = useState(props.marked);

  const handleChange = (event) => {
    if (!checked) {
      props.updateDuration(true)
      props.updatePickedTreatments(true)
    }
    else {
      // props.setIsActive(false)
      props.updateDuration(false)
      props.updatePickedTreatments(false)
    }
    setChecked(event.target.checked)
  };

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <Switch
            checked={checked}
            onChange={handleChange}
            name="checked"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>
      </ThemeProvider>
    </StylesProvider>
  );
}