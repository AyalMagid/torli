import React, {useEffect} from 'react';
import { withRouter, useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './TabsApp.scss';

export function _TabsApp(props) {
  const [value, setValue] = React.useState(0);
  const location = useLocation()
  useEffect(() => {(location.pathname !== '/cancelAppointment')? setValue(0): setValue(1)});

  // tabs style
  const style = {
    width:'50%',
    boxShadow:'none',
    color:'#172b4d'
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      props.history.push('/cancelAppointment')
    } else {
      props.history.push('/')
    }
  };

  return (

    <AppBar position="static" style={{boxShadow:'none'}} >
      <Tabs value={value} onChange={handleChange} className="tabs">
        <Tab label="זימון" style={style}/>
        <Tab label="ביטול" style={style}/>
      </Tabs>
    </AppBar>
  );
}

export const TabsApp = withRouter(_TabsApp)