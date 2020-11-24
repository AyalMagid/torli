import React, {useEffect} from 'react';
import { withRouter, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import StoreService from '../../services/StoreService';
import './TabsApp.scss';

export function _TabsApp(props) {
  const [value, setValue] = React.useState(0);
  const location = useLocation()
  useEffect(() => {(location.pathname !== '/cancelAppointment')? setValue(0): setValue(1)},[value,location]);

  // tabs style
  const style = {
    width:'28%',
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

  function navToHomePage() {
    StoreService.initApp()
    // props.history.push('/')

    // routim
    props.history.push(`/${props.owner.workPlace}`)
}

  return (

    <AppBar position="static" style={{boxShadow:'none'}} >
      <Tabs value={value} onChange={handleChange} className="tabs flex space-between">
        <Tab label="זימון תור" style={style}/>
        <Tab label="התורים שלי" style={style}/>
        <h2 onClick={navToHomePage} id="text" className="logo"> Tori<i  className="fas fa-tasks"></i></h2>
      </Tabs>
    </AppBar>
  );
}

function mapStateProps(state) {
  return {
      // routim
      owner:state.UserReducer.owner
  }
}

const mapDispatchToProps = {
}


export const TabsApp = withRouter(connect(mapStateProps, mapDispatchToProps)(_TabsApp))


