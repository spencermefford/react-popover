import React, { useCallback, useState } from 'react';
import { withPropsTable } from 'storybook-addon-react-docgen';
import { motion } from 'framer-motion';
import Popover from './Popover';
import { POPOVER_TRIGGER_TYPES } from './constants';
import placementsConfig from './placementsConfig';

export default {
  title: 'Popover',
  component: Popover,
  argTypes: {
    placement: {
      control: { type: 'select', options: Object.keys(placementsConfig) },
      description: "Where popover should show it's content",
      defaultValue: 'top',
      table: {
        defaultValue: { summary: 'top' },
      },
    },
    trigger: {
      control: {
        type: 'select',
        options: Object.values(POPOVER_TRIGGER_TYPES),
      },
      description: `Event name, on which popover should change visibility. 
      If trigger is 'focus' and you want to listen for onFocus on child then provide popover with this listener.
      If trigger is 'focus' then root child should accept event onFocus, use forwardRef to choose another child.`,
      defaultValue: POPOVER_TRIGGER_TYPES.hover,
      table: {
        defaultValue: { summary: POPOVER_TRIGGER_TYPES.hover },
      },
    },
    onFocus: {
      action: 'onFocus',
      description:
        "onFocus event of child component, triggered if trigger === 'focus'",
    },
    withArrow: {
      control: 'boolean',
      description: 'Whether show popover arrow or not',
      defaultValue: true,
      table: {
        defaultValue: { summary: true },
      },
    },
    children: {
      disable: true,
      description: `Popover children. 
    If it's function then it provided with {close: close popover, open: open popover, toggle: toggle popover, isOpen: is popover open}`,
    },
    content: {
      disable: true,
      description:
        "Popover content. If it's function then it provided with {close: close popover}",
    },
    onClose: {
      action: 'onClose',
      description: 'Function, triggered when popover closed',
    },
    offset: {
      control: 'array',
      description:
        'Offset from computed popover position, if offset = [x, y] then popover position would be [position.x + x, position.y + y]',
      defaultValue: [0, 0],
      table: {
        defaultValue: { summary: [0, 0] },
      },
    },
    getContainer: {
      disable: true,
      description:
        'Function, that should return component inside which popover should render its content',
    },
    isOpen: {
      control: 'boolean',
      description:
        'If isOpenControlled then it defines popover visibility else it defines initial popover visibility',
    },
    isOpenControlled: {
      control: 'boolean',
      description:
        'Whether popover visibility controlled or not, use if you want control visibility from external component',
      defaultValue: false,
      table: {
        defaultValue: { summary: false },
      },
    },
    onChangeOpen: {
      action: 'onChangeOpen',
      description: 'Function triggered when popover should change visibility',
    },
    className: {
      control: 'string',
      description: 'Popover content className',
    },
    considerTriggerMotion: {
      control: 'boolean',
      description:
        'Whether consider trigger position and size changes and follow it or not',
      defaultValue: false,
      table: {
        defaultValue: { summary: false },
      },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether close on escape button press or not',
      defaultValue: true,
      table: {
        defaultValue: { summary: true },
      },
    },
    closeOnEnter: {
      control: 'boolean',
      description: 'Whether close on enter button press or not',
      defaultValue: false,
      table: {
        defaultValue: { summary: false },
      },
    },
    closeOnRemoteClick: {
      control: 'boolean',
      description:
        "Whether close on remote click or not. Default trigger === 'click' || trigger === 'contextMenu'.",
      defaultValue: undefined,
      table: {
        defaultValue: { summary: undefined },
      },
    },
    guessBetterPosition: {
      control: 'boolean',
      description: 'Whether popover should change position if there is no room',
      defaultValue: true,
    },
    mouseEnterDelay: {
      control: 'number',
      description: 'Delay in ms before opening popover on mouseEnter',
      defaultValue: 100,
      table: {
        defaultValue: { summary: 100 },
      },
    },
    mouseLeaveDelay: {
      control: 'number',
      description: 'Delay in ms before closing popover on mouseLeave',
      defaultValue: 300,
      table: {
        defaultValue: { summary: 300 },
      },
    },
    triggerContainerDisplay: {
      control: 'string',
      description: 'display of popover trigger container',
    },
    triggerContainerTag: {
      control: 'string',
      description: 'tag of popover trigger container',
      defaultValue: 'span',
      table: {
        defaultValue: { summary: 'span' },
      },
    },
    maxWidth: {
      control: 'string',
      description: 'max content width',
      defaultValue: 'available space - 25px',
      table: {
        defaultValue: { summary: 'available space - 25px' },
      },
    },
    maxHeight: {
      control: 'string',
      description: 'max content height',
      defaultValue: 'available space - 25',
      table: {
        defaultValue: { summary: 'available space - 25px' },
      },
    },
    animationTranslateDistance: {
      control: 'number',
      description: 'Distance in % that content should slide during opening',
      defaultValue: 30,
      table: {
        defaultValue: { summary: 30 },
      },
    },
    animation: {
      disable: true,
      description:
        'framer-motion props for opening/closing content animation {initial, animate, exit}',
    },
  },
  decorators: [withPropsTable],
  parameters: {
    props: {
      propTablesInclude: [Popover],
    },
  },
};

export function playground(props) {
  return (
    <Popover {...props}>
      <button>
        Trigger &quot;{props.trigger || 'hover'}&quot; event to open Popover
      </button>
    </Popover>
  );
}

playground.args = {
  placement: 'top',
  trigger: 'click',
  withArrow: 'true',
  offset: [0, 0],
  isOpen: undefined,
  isOpenControlled: false,
  considerTriggerMotion: false,
  closeOnEscape: true,
  closeOnEnter: true,
  closeOnRemoteClick: undefined,
  guessBetterPosition: true,
  mouseEnterDelay: 100,
  mouseLeaveDelay: 300,
  content: 'Hi!',
};

export function draggable() {
  return (
    <div
      style={{
        width: 600,
        height: 450,
        padding: 10,
        borderRadius: 30,
        backgroundColor: '#eaeaea',
      }}
    >
      <div style={{ padding: '1rem' }}>Note: considerTriggerMotion = true</div>
      <Popover content="Hi! I follow trigger)" considerTriggerMotion>
        <motion.div
          style={{
            width: 100,
            height: 100,
            borderRadius: 30,
            backgroundColor: '#247c79',
            color: '#fff',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          drag
          whileTap={{ cursor: 'grabbing' }}
        >
          Drag Me
        </motion.div>
      </Popover>
    </div>
  );
}

export function Slider(props) {
  const [left, setLeft] = useState(0);

  const handleChangeRange = useCallback((e) => {
    setLeft(e.target.value);
  }, []);

  return (
    <div>
      <div style={{ position: 'relative', width: '500px' }}>
        <Popover
          {...props}
          considerTriggerMotion
          isOpen
          isOpenControlled
          triggerContainerDisplay="inline"
          content="Hi! I follow trigger)"
        >
          <span
            style={{
              position: 'absolute',
              left: `calc(${left}% - 5px)`,
              display: 'inline',
              width: '10px',
            }}
          />
        </Popover>
        <input
          type="range"
          min={0}
          max={100}
          onChange={handleChangeRange}
          value={left}
          style={{ width: '100%' }}
        />
      </div>
      <div className="note">
        Note: popover is visible and visibility controlled only for example
      </div>
      <div className="note">
        Note: triggerContainerDisplay provided because popover computes wrong
        value in storybook..
      </div>
    </div>
  );
}

const longContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porta ut metus at rutrum. Sed est magna, mattis vel tincidunt sed, sagittis fringilla nunc. Proin faucibus euismod facilisis. In ac finibus ex, eu dapibus dui. Sed in mauris ut dolor rhoncus tincidunt id vel velit. Aliquam quam diam, rhoncus a dui id, sodales sagittis dui. Nulla interdum neque ut urna mollis, bibendum sodales quam ornare. Cras rutrum ullamcorper felis, et pellentesque enim consectetur sed. In posuere non justo eget euismod. Cras fringilla justo eget placerat sodales. Pellentesque varius orci vitae nibh pellentesque, a malesuada orci hendrerit. Quisque tempus sapien sapien, quis dignissim purus molestie sed. Vestibulum sit amet fringilla nulla. Integer sollicitudin tortor ut urna varius gravida. Mauris feugiat nunc nec lorem tincidunt, sed mattis felis lacinia.

Nam euismod a risus et dictum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque nec convallis sapien. In ultrices massa vitae erat pellentesque, dignissim porttitor nulla vestibulum. Ut vehicula elit nec justo auctor interdum vel vitae tortor. Ut egestas nunc et dui molestie, lacinia pretium turpis mollis. Curabitur vehicula malesuada commodo. Nulla auctor lacus urna, eu fringilla risus vestibulum pharetra. Aenean sit amet justo sit amet nunc porta ullamcorper. Curabitur blandit vehicula facilisis. Maecenas vulputate dui ut magna luctus sodales. Etiam euismod odio vitae magna accumsan auctor. Donec sodales turpis quam, nec eleifend diam pellentesque eget.

Maecenas condimentum purus vitae tempor tristique. Etiam neque dolor, imperdiet at aliquam rutrum, consequat eget justo. Suspendisse elementum, sapien nec volutpat facilisis, enim nisl gravida est, vel rutrum elit diam at metus. Sed ut euismod ipsum. Etiam ipsum nibh, euismod quis facilisis ac, lobortis eu lorem. Suspendisse potenti. Maecenas mattis ut sapien ac vestibulum. Aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porta lacus ipsum, ac sagittis lacus molestie ut. Nam ullamcorper urna dui, sed commodo urna egestas et. Vestibulum ligula est, rutrum vel egestas ac, lobortis sit amet enim. Nullam a hendrerit odio.

Integer commodo est in consectetur maximus. Sed tincidunt vulputate lectus, non elementum libero tempus at. Integer congue ac urna id dignissim. Aliquam erat volutpat. Cras vitae vestibulum velit, et auctor erat. Integer vitae odio erat. Pellentesque eu hendrerit justo. Cras nec luctus eros, eu eleifend mauris. Curabitur tempor vitae orci vel laoreet. Nulla tempus sodales dolor, sit amet gravida tellus fringilla et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam ligula erat, semper vel vestibulum in, convallis vitae velit. Curabitur nec eleifend sapien.

Morbi convallis, sapien id sagittis faucibus, odio nibh ornare velit, sit amet molestie metus diam at neque. Nunc iaculis, tellus vulputate facilisis euismod, nisl nisl luctus velit, nec scelerisque diam sapien sit amet nisl. In luctus erat consequat, sollicitudin nisi sit amet, dapibus eros. Morbi tortor tellus, pretium at placerat id, aliquam et est. Phasellus tempor eu dolor vel varius. Etiam convallis dapibus mollis. Fusce mollis sodales augue at aliquam. Quisque egestas leo a consectetur elementum. Fusce cursus augue quis lorem iaculis, ut bibendum lorem sodales. Nam ut quam dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce mattis nisl sit amet mauris luctus lacinia.

Duis at maximus lorem. Vivamus vitae quam porttitor, euismod libero eu, tempor lorem. Proin ut ligula arcu. Duis accumsan vel diam et interdum. Ut scelerisque tristique nulla, a consectetur purus posuere ut. Duis finibus turpis sem, non cursus mi laoreet ut. Nulla felis lorem, varius et iaculis laoreet, laoreet in nisi. Mauris laoreet dictum condimentum. Proin porttitor turpis eget rutrum vestibulum. Praesent rutrum tristique gravida. Nunc viverra placerat ullamcorper. Sed dignissim et diam ut pretium. Ut ultrices sagittis sem, at convallis tortor vehicula non. Morbi vel arcu tincidunt, tempus libero eget, vulputate libero. Cras semper arcu elementum pulvinar egestas.

Sed odio justo, egestas nec felis in, fringilla luctus nulla. Fusce bibendum consectetur condimentum. Ut at ex eu dui pretium pellentesque congue id dui. Etiam ex diam, condimentum vestibulum aliquet vel, viverra sed nunc. Quisque nec nulla dolor. Pellentesque dignissim vitae massa sit amet pellentesque. Integer purus magna, cursus sit amet nisi eu, faucibus fermentum eros. Mauris ac elit ut enim vehicula porttitor id ut lacus. Proin quis justo eu sem euismod malesuada sed ut ex. Ut fermentum mattis dui id pharetra. Integer quis turpis lacus. Nam eget sem eu elit consequat faucibus vitae et purus. Praesent semper magna auctor, vehicula risus ut, porta odio. Nunc vel mauris magna. Vivamus nec viverra sem. Fusce lectus ex, dictum ut viverra fusce.`;

export function popoverWithLongContent(props) {
  return (
    <Popover {...props} content={longContent}>
      <button>{props.trigger || 'hover'} to open</button>
    </Popover>
  );
}

export function popoverWithFunctionChildren(props) {
  return (
    <Popover
      {...props}
      considerTriggerMotion
      placement="top"
      content="Hi!"
      trigger="click"
    >
      {({ isOpen }) => <button>{isOpen ? 'Opened' : 'Click to Open'}</button>}
    </Popover>
  );
}

const Input = React.forwardRef((props, ref) => (
  <div>
    <input type="text" {...props} ref={ref} />
  </div>
));

export function popoverWithFocusTrigger(props) {
  return (
    <div>
      <Popover {...props} content="I was opened on focus" trigger="focus">
        <Input type="text" placeholder="Focus" />
      </Popover>
      <div className="note">
        Note: Input uses forwardRef for changing trigger component to input
      </div>
    </div>
  );
}

export function popoverWithCustomAnimation(props) {
  return (
    <Popover
      {...props}
      content={longContent}
      animation={{
        initial: {
          opacity: 0,
          scale: 0.5,
        },

        animate: {
          opacity: 1,
          scale: 1,
        },

        exit: {
          opacity: 0,
          scale: 0.5,
          transition: { duration: 0.1 },
        },
      }}
    >
      <button>{props.trigger || 'hover'} to open</button>
    </Popover>
  );
}
