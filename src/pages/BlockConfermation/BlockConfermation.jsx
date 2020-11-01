import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import UtilsService from "../../services/UtilsService";
import './BlockConfermation.scss';

export function _BlockConfermation(props) {
  return (
    <>
      <header className="header-in-block-confermation-modal">
        לסגירת חלון הזמנים שנבחר לחצו 'אישור'
    </header>
      <main className="main-confermation-container flex align-center justify-center">
        <div className="block-confermation-details">
          <div className="table-cell1">חלון הזמנים שנבחר :</div>
          <div className="table-cell2">בתאריך : {UtilsService.convertDateToIsraelisDisplay(props.slotToBlock.date)}</div>
          <div className="table-cell3">בין השעות : {props.slotToBlock.end} - {props.slotToBlock.start}</div>
        </div>
      </main>
    </>
  );
}

function mapStateProps(state) {
  return {
    slotToBlock: state.CalendarReducer.slotToBlock
  }
}

const mapDispatchToProps = {

}

export const BlockConfermation = connect(mapStateProps, mapDispatchToProps)(_BlockConfermation)
