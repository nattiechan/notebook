/**
 * @jest-environment jsdom
 */

import React from 'React';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';

import DropdownSummary from '../client/components/dropdownSummary';
import DropdownOrders from '../client/components/dropdownOrders';

describe('Unit testing React components', () => {
    describe('DropdownSummary', () => {
        let element;
        const expectedText = ['', 'Cash', 'CC'];
        const props = {
            id: 'payment_method',
            defaultValue: expectedText[0],
            valueList: expectedText.slice(1),
            onDropdownChange: jest.fn()
        };

        beforeEach(() => {
            element = render(<DropdownSummary {...props} />);
        })

        it('Dropdown contains all values', () => {
            element.getAllByRole('option').forEach((el, index) => {
                expect(el).toHaveTextContent(expectedText[index]);
            })
        })

        it('Dropdown change function evoked', async () => {
            await userEvent.selectOptions(element.getByRole('combobox'), element.getByText(expectedText[2]));
            expect(props.onDropdownChange).toBeCalled();
        })

        it('User selects different option successfully', async () => {
            await userEvent.selectOptions(element.getByRole('combobox'), element.getByText(expectedText[1]));
            expect(element.getByText(expectedText[1]).selected).toBeTruthy();
        })
    });

    describe('DropdownOrders', () => {
        let element;
        const expectedText = ['', '5%', '10%'];
        const props = {
            id: 'main_pre_stretch',
            orderId: 3,
            defaultValue: expectedText[0],
            valueList: expectedText.slice(1),
            onDropdownChange: jest.fn()
        };

        beforeEach(() => {
            element = render(<DropdownOrders {...props} />);
        })

        it('Dropdown contains all values', () => {
            element.getAllByRole('option').forEach((el, index) => {
                expect(el).toHaveTextContent(expectedText[index]);
            })
        })

        it('Dropdown change function evoked', async () => {
            await userEvent.selectOptions(element.getByRole('combobox'), element.getByText(expectedText[2]));
            expect(props.onDropdownChange).toBeCalled();
        })

        it('User selects different option successfully', async () => {
            await userEvent.selectOptions(element.getByRole('combobox'), element.getByText(expectedText[1]));
            expect(element.getByText(expectedText[1]).selected).toBeTruthy();
        })
    });
}
);