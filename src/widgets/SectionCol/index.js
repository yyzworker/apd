import React, { useEffect, useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { getWidgetAccept, getWidgetComponent, getWidgetDOMPosition } from '../../utils';
import { DROP_COLOR, SELECTED_COLOR } from '../../constants';
import { ContextMenuTrigger } from "react-contextmenu";
import styles from './index.less'

const mapState = state => ({
  widgets: state.widgets,
});

const SectionCol = ({widget}) => {
  const { widgets } = useMappedState(mapState);
  const selected = widget ? widget.selected : false;
  const dispatch = useDispatch();
  const rootRef = useRef();
  const [collectProps, drag] = useDrag({item: widget});
  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: getWidgetAccept(widget),
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        let y = monitor.getClientOffset().y+rootRef.current.scrollTop+window.scrollY;
        const idx = getWidgetDOMPosition(y,rootRef.current.children);
        dispatch({ type: 'addWidget', payload: { ...item, parentId: widget.id, idx } });
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });
  useEffect(()=>{
    drag(drop(rootRef.current));
  },[]);
  const { detail = {} } = widget;
  const { width = 'auto' } = detail;
  const rootStyle = useMemo(
    () => ({
      width,
      backgroundColor: isOverCurrent ? DROP_COLOR : selected ? SELECTED_COLOR : null,
    }),
    [isOverCurrent,selected,width],);
  return (
    <ContextMenuTrigger id="rightMenu" holdToDisplay={-1} collect={(props)=> ({ widget })}>
      <div
        ref={rootRef}
        onClick={(e)=>{
          dispatch({ type: 'selectWidget', payload: widget.id });
          e.stopPropagation()
        }}
        className={styles.root}
        style={rootStyle}
      >
        {widgets && widgets.filter(d => d.parentId === widget.id).map(item => getWidgetComponent(item))}
      </div>
    </ContextMenuTrigger>
  );
};

export default SectionCol;
