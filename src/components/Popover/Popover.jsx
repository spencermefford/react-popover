import React, {
  useCallback,
  useMemo,
  useRef,
  Fragment,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { AnimatePresence } from 'framer-motion';
import {
  useOpen,
  usePosition,
  useHandlers,
  useNodeDimensions,
  useElementMotion,
} from './hooks';
import { CheckTargetDimensionsHelper, Container } from './styled';
import popoverPropsGetters from './placementsConfig';
import { POPOVER_TRIGGER_TYPES } from './constants';
import useResizeListener from './hooks/useResizeListener';

function Popover(
  {
    children,
    content,
    placement,
    trigger,
    withArrow,
    onClose,
    offset,
    getContainer,
    isOpen: providedIsOpen,
    isOpenControlled,
    onChangeOpen,
    className,
    considerTriggerMotion,
    closeOnEscape,
    closeOnEnter,
    closeOnRemoteClick: providedCloseOnRemoteClick,
    guessBetterPosition,
    onFocus,
    onBlur,
    mouseEnterDelay,
    mouseLeaveDelay,
    triggerContainerDisplay,
    ...wrapperProps
  },
  ref
) {
  const { target, isOpen, setOpen, open, close, toggle } = useOpen({
    onClose,
    closeOnRemoteClick:
      providedCloseOnRemoteClick ||
      [POPOVER_TRIGGER_TYPES.click, POPOVER_TRIGGER_TYPES.contextMenu].includes(
        trigger
      ),
    closeOnEscape,
    closeOnEnter,
    isOpen: providedIsOpen,
    isOpenControlled,
    onChangeOpen,
  });

  const triggerElementRef = useRef();

  const container = useMemo(() => getContainer(), [getContainer]);

  const [
    targetDimensions,
    checkTargetDimensions,
    isCheckingTargetDimensions,
    setCheckingTargetDimensions,
  ] = useNodeDimensions();
  const [containerProps, updatePosition] = usePosition({
    targetDimensions,
    triggerElementRef,
    placement,
    offset,
    withArrow,
    guessBetterPosition,
  });

  const updatePositionIfOpen = useCallback(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  const setupElementMotionObserver = useElementMotion(updatePosition);

  useResizeListener(updatePositionIfOpen);

  const openDebounced = useMemo(() => _.debounce(open, mouseEnterDelay), [
    mouseEnterDelay,
    open,
  ]);

  const closeDebounced = useMemo(() => _.debounce(close, mouseLeaveDelay), [
    mouseLeaveDelay,
    close,
  ]);

  const showContent = useCallback(
    (force, customSetOpen) => {
      const show = () => {
        updatePosition();
        (customSetOpen || setOpen)(!isOpen, force);
      };

      if (!targetDimensions.current) {
        setCheckingTargetDimensions(true);
        setTimeout(() => {
          show();
        }, 100);
      } else {
        show();
      }
    },
    [
      targetDimensions,
      updatePosition,
      setOpen,
      isOpen,
      setCheckingTargetDimensions,
    ]
  );

  useEffect(() => {
    if (isOpenControlled && isOpen !== providedIsOpen) {
      if (providedIsOpen) {
        showContent(true);
      } else {
        setOpen(providedIsOpen, true);
      }
    }
  }, [isOpen, isOpenControlled, providedIsOpen, setOpen, showContent]);

  const {
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  } = useHandlers({
    isOpen,
    openDebounced,
    closeDebounced,
    showContent,
    setOpen,
    onFocus,
    onBlur,
  });

  const setContainerRef = useCallback(
    (node) => {
      if (node && node.children.length) {
        const child = node.children[0];
        if (considerTriggerMotion) {
          setupElementMotionObserver(child);
        }
        triggerElementRef.current = child;
        if (triggerContainerDisplay) {
          node.style.display = triggerContainerDisplay;
        } else {
          const style = window.getComputedStyle(child);
          node.style.display = style.display;
        }
      } else {
        triggerElementRef.current = node;
      }
      if (ref) {
        if (_.isFunction(ref)) {
          ref(node);
        } else {
          ref.current = node;
        }
      }
    },
    [
      ref,
      considerTriggerMotion,
      triggerContainerDisplay,
      setupElementMotionObserver,
    ]
  );

  const transformedContent = useMemo(
    () => (_.isFunction(content) ? content({ close }) : content),
    [close, content]
  );

  const triggerProps = useMemo(
    () =>
      _.fromPairs(
        _.filter(
          [
            [
              'onMouseDown',
              trigger === POPOVER_TRIGGER_TYPES.click && handleClick,
            ],
            [
              'onMouseEnter',
              trigger === POPOVER_TRIGGER_TYPES.hover && handleMouseEnter,
            ],
            [
              'onMouseLeave',
              trigger === POPOVER_TRIGGER_TYPES.hover && handleMouseLeave,
            ],
            [
              'onContextMenu',
              trigger === POPOVER_TRIGGER_TYPES.contextMenu && handleClick,
            ],
          ],
          1
        )
      ),
    [handleClick, handleMouseEnter, handleMouseLeave, trigger]
  );

  return (
    <Fragment>
      {isCheckingTargetDimensions && (
        <CheckTargetDimensionsHelper ref={checkTargetDimensions}>
          {transformedContent}
        </CheckTargetDimensionsHelper>
      )}
      {createPortal(
        <AnimatePresence initial={null}>
          {isOpen && (
            <Container
              ref={target}
              withArrow={withArrow}
              positionStyles={containerProps.style}
              initial={containerProps.initial}
              animate={containerProps.animate}
              exit={containerProps.exit}
              onMouseEnter={triggerProps.onMouseEnter}
              onMouseLeave={triggerProps.onMouseLeave}
              className={className}
            >
              {transformedContent}
            </Container>
          )}
        </AnimatePresence>,
        container
      )}
      {trigger === POPOVER_TRIGGER_TYPES.focus ? (
        React.cloneElement(
          React.Children.only(
            _.isFunction(children)
              ? children({ isOpen, open, close, toggle })
              : children
          ),
          {
            onFocus: handleFocus,
            onBlur: handleBlur,
            ref: setContainerRef,
            ...wrapperProps,
          }
        )
      ) : (
        <span {...triggerProps} ref={setContainerRef} {...wrapperProps}>
          {_.isFunction(children)
            ? children({ isOpen, open, close, toggle })
            : children}
        </span>
      )}
    </Fragment>
  );
}

const PopoverWithRef = React.forwardRef(Popover);

PopoverWithRef.propTypes = {
  /**
   * Where popover should show it's content
   * @default _.noop
   */
  placement: PropTypes.oneOf(Object.keys(popoverPropsGetters)),
  /**
   * Event name, on which popover should change visibility
   * If trigger is 'focus' and you want to listen for onFocus/onBlur on child then provide popover with these listeners
   * If trigger is 'focus' then root child should accept event onFocus, use forwardRef to choose another child
   * @default hover
   */
  trigger: PropTypes.oneOf(Object.keys(POPOVER_TRIGGER_TYPES)),
  /**
   * onFocus event of child component, triggered if trigger === 'focus'
   * @default _.noop
   */
  onFocus: PropTypes.func,
  /**
   * onBlur event of child component, triggered if trigger === 'focus'
   * @default _.noop
   */
  onBlur: PropTypes.func,
  /**
   * Whether show popover arrow or not
   * @default true
   */
  withArrow: PropTypes.bool,
  /**
   * Popover children
   * If it's function then it provided with {close: close popover, open: open popover, toggle: toggle popover, isOpen: is popover open}
   * @default undefined
   */
  children: PropTypes.any.isRequired,
  /**
   * Popover content
   * If it's function then it provided with {close: close popover}
   * @default undefined
   */
  content: PropTypes.any.isRequired,
  /**
   * Function, triggered when popover closed
   * @default _.noop
   */
  onClose: PropTypes.func,
  /**
   * Offset from computed popover position, if offset = [x, y] then popover position would be [position.x + x, position.y + y]
   * @default [0, 0]
   */
  offset: PropTypes.arrayOf(PropTypes.number),
  /**
   * Function, that should return component inside which popover should render its content
   * @default () => document.body
   */
  getContainer: PropTypes.func,
  /**
   * If isOpenControlled then it defines popover visibility else it defines initial popover visibility
   * @default undefined
   */
  isOpen: PropTypes.bool,
  /**
   * Whether popover visibility controlled or not, use if you want control visibility from external component
   * @default false
   */
  isOpenControlled: PropTypes.bool,
  /**
   * Function triggered when popover should change visibility
   * @default _.noop
   */
  onChangeOpen: PropTypes.func,
  /**
   * Popover content className
   * @default undefined
   */
  className: PropTypes.string,
  /**
   * Whether consider trigger position and size changes and follow it or not
   * @default false
   */
  considerTriggerMotion: PropTypes.bool,
  /**
   * Whether close on escape button press or not
   * @default true
   */
  closeOnEscape: PropTypes.bool,
  /**
   * Whether close on enter button press or not
   * @default false
   */
  closeOnEnter: PropTypes.bool,
  /**
   * Whether close on remote click or not
   * @default trigger === 'click' || trigger === 'contextMenu'
   */
  closeOnRemoteClick: PropTypes.bool,
  /**
   * Whether popover should change position if there is no room
   * @default true
   */
  guessBetterPosition: PropTypes.bool,
  /**
   * Delay in ms before opening popover on mouseEnter
   * @default 100
   */
  mouseEnterDelay: PropTypes.number,
  /**
   * Delay in ms before closing popover on mouseLeave
   * @default 300
   */
  mouseLeaveDelay: PropTypes.number,
  /**
   * display of popover trigger container
   * @default display of root child
   */
  triggerContainerDisplay: PropTypes.string,
};

PopoverWithRef.defaultProps = {
  placement: 'top',
  trigger: POPOVER_TRIGGER_TYPES.hover,
  withArrow: true,
  onClose: _.noop,
  offset: [0, 0],
  isOpen: false,
  onChangeOpen: _.noop,
  considerTriggerMotion: false,
  closeOnEscape: true,
  closeOnEnter: false,
  getContainer: () => document.body,
  guessBetterPosition: true,
  mouseEnterDelay: 100,
  mouseLeaveDelay: 300,
  onFocus: _.noop,
  onBlur: _.noop,
};

export default PopoverWithRef;