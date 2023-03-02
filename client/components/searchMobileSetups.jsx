import React from 'react';

function SearchMobileSetups(props) {
    const { record } = props;
    const hasSameStrings = record.main_string === record.cross_string;
    const strings = hasSameStrings
        ? record.main_string : `${record.main_string} / ${record.cross_string}`;
    const tension = record.main_tension === record.cross_tension
        ? record.main_tension : `${record.main_tension} / ${record.cross_tension}`;

    const getPreStretch = () => {
        if (record.main_pre_stretch === '' && record.cross_pre_stretch === '') {
            return '';
        } else if (record.main_pre_stretch !== '' && record.cross_pre_stretch !== '') {
            return `${record.main_pre_stretch} / ${record.cross_pre_stretch} PS`;
        } else if (record.cross_pre_stretch === '') {
            return `${record.main_pre_stretch} PS main`;
        } else {
            return `${record.cross_pre_stretch} PS cross`;
        }
    }

    const sameStringElement = () => {
        return (
            <>
                <span id='num-of-racquets'>{record.num_of_racquets} x{' '}</span>
                <span id='setup'>
                    {strings}{' '}
                    @ {tension} {record.tension_measuring_unit}{' '}
                    {getPreStretch()}
                </span>
            </>
        );
    }

    const differentStringElement = () => {
        return (
            <>
                <span id='num-of-racquets'>{record.num_of_racquets} x{' '}</span>
                <span id='setup'>
                    {strings}<br />
                    @ {tension} {record.tension_measuring_unit}{' '}
                    {getPreStretch()}
                </span>
            </>
        );
    };

    return (
        <div id='combo'>
            {hasSameStrings ? sameStringElement() : differentStringElement()}
        </div>
    );
}

export default SearchMobileSetups;