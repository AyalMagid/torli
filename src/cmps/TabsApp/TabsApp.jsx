import React, {useEffect} from 'react';
import { withRouter, useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './TabsApp.scss';

export function _TabsApp(props) {
  const [value, setValue] = React.useState(0);
  const location = useLocation()
  useEffect(() => {(location.pathname !== '/cancelAppointment')? setValue(0): setValue(1)},[value,location]);

  // tabs style
  const style = {
    width:'25%',
    boxShadow:'none',
    color:'white'
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      props.history.push('/cancelAppointment')
    } else {
      props.history.push('/treatments')
    }
  };

  return (

    <AppBar position="static" style={{boxShadow:'none'}} >
      <Tabs value={value} onChange={handleChange} className="tabs flex space-between">
        <Tab label="זימון" style={style}/>
        <Tab label="ניהול תורים" style={style}/>
        <h2 id="text" className="logo"> Tori<i  className="fas fa-tasks"></i></h2>
      </Tabs>
    </AppBar>
  );
}

export const TabsApp = withRouter(_TabsApp)