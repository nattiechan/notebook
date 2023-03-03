import React from 'react';

function SearchMobileSetups(props) {
    const { record } = props;
    const {
        main_string,
        cross_string,
        main_tension,
        cross_tension,
        main_pre_stretch,
        cross_pre_stretch,
        num_of_racquets,
        tension_measuring_unit
    } = record;
    const hasSameStrings = main_string === cross_string;
    const strings = hasSameStrings ? main_string : `${main_string} / ${cross_string}`;
    const tension = main_tension === cross_tension
        ? main_tension : `${main_tension} / ${cross_tension}`;

    const getPreStretch = () => {
        if (main_pre_stretch === '' && cross_pre_stretch === '') {
            return '';
        } else if (main_pre_stretch !== '' && cross_pre_stretch !== '') {
            return `${record.main_pre_stretch} / ${cross_pre_stretch} PS`;
        } else if (cross_pre_stretch === '') {
            return `${main_pre_stretch} PS main`;
        } else {
            return `${cross_pre_stretch} PS cross`;
        }
    }

    return (
        <div id='combo'>
            <span id='num-of-racquets'>{num_of_racquets} x{' '}</span>
            <span id='setup'>
                {strings}{hasSameStrings ? ' ' : <br />}
                @ {tension} {tension_measuring_unit}{' '}
                {getPreStretch()}
            </span>
        </div>
    );
}

export default SearchMobileSetups;