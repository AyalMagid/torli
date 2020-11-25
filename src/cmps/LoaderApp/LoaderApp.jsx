import React from 'react';
import Loader from 'react-loader-spinner'
export class LoaderApp extends React.Component {
  //other logic
  render() {
    return (
      <Loader
        type="Oval"
        color="var(--color1)"
        height={75}
        width={75}
        timeout={3000} //3 secs
      />
    );
  }
}