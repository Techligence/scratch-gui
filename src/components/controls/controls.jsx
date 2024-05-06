import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import GreenFlag from '../green-flag/green-flag.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';

import styles from './controls.css';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title'
    },
    stopTitle: {
        id: 'gui.controls.stop',
        defaultMessage: 'Stop',
        description: 'Stop button title'
    }
});

const Controls = function (props) {
    const {
        active,
        className,
        intl,
        onGreenFlagClick,
        onStopAllClick,
        turbo,
        ...componentProps
    } = props;

    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (active) {
            const start = performance.now();
            intervalRef.current = setInterval(() => {
                setElapsedTime(performance.now() - start);
            }, 10);
            return () => clearInterval(intervalRef.current);
        } else {
            clearInterval(intervalRef.current);
        }
    }, [active]);

    useEffect(() => {
        if (!active) {
            const timer = elapsedTime.toFixed(3);
            localStorage.setItem('timer', timer);
        }
    }, [active, elapsedTime]);

    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            <GreenFlag
                active={active}
                title={intl.formatMessage(messages.goTitle)}
                onClick={onGreenFlagClick}
            />
            <StopAll
                active={active}
                title={intl.formatMessage(messages.stopTitle)}
                onClick={onStopAllClick}
            />
            <span style={{marginTop:'4px',fontSize:'medium'}} title="Execution Time">
                {!active ? `⏱️${(elapsedTime / 1000).toFixed(3)} sec` : `⏱️${(elapsedTime / 1000).toFixed(3)} sec`}
            </span>
            {turbo ? (
                <TurboMode />
            ) : null}
        </div>
    );
};

Controls.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onGreenFlagClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    turbo: PropTypes.bool
};

Controls.defaultProps = {
    active: false,
    turbo: false
};

export default injectIntl(Controls);
