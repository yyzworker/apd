import React, { useMemo } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { SELECTED_COLOR } from '../../constants';
import { ContextMenuTrigger } from "react-contextmenu";
import styles from './index.less'
import { useDrag } from 'react-dnd';
import classNames from 'classnames';

const mapState = state => ({
  widgets: state.widgets,
});

const Checkbox = ({widget}) => {
  const { widgets } = useMappedState(mapState);
  const selected = widget ? widget.selected : false;
  const dispatch = useDispatch();
  const [collectProps, drag] = useDrag({item: widget});
  const rootStyle = useMemo(
    () => ({
      backgroundColor: selected ? SELECTED_COLOR : null,
    }),
    [selected],);
  const { detail } = widget;
  const { label } = detail;
  return (
    <ContextMenuTrigger id="rightMenu" holdToDisplay={-1} collect={(props) => ({ widget })}>
      <label ref={drag}
             onClick={(e) => {
               dispatch({ type: 'selectWidget', payload: widget.id });
               e.stopPropagation();
             }}
             className={styles.root}
             style={rootStyle}>
        <span className={classNames(styles.icon,styles.checked)}>
          <input type="checkbox" />
          <span className={styles.inner}/>
        </span>
        <span>{label}</span>
      </label>
    </ContextMenuTrigger>
  )
};

export default Checkbox;
