/**
 * @file
 * @module TargetDate
 * @description This file contains the `TargetDate` component.
 * @requires module:@mui/material
 * @requires module:@mui/x-date-pickers
 * @requires module:@mui/x-date-pickers/AdapterDayjs
 * @requires module:@mui/x-date-pickers/internals/demo
 * @requires module:react
 */
import React from 'react'
import { FormControl, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'

/**
 * `TargetDate` is a React functional component that renders a form control for selecting a target date.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.rules - An object representing the current rules.
 * @param {Function} props.setRules - A function to update the rules.
 * @param {Array} props.options - An array of options for the RadioGroup component.
 * @param {string} props.defaultValue - The default value for the RadioGroup component.
 *
 * @example
 * <TargetDate rules={currentRules} setRules={updateRules} options={dateOptions} defaultValue="defaultDate" />
 *
 * @returns {React.Element} The rendered form control.
 */
const TargetDate = ({ rules, setRules, options, defaultValue }) => {
    return (
        <div>
            <FormControl>
                <RadioGroup
                    row
                    aria-labelledby="radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={rules?.data || defaultValue}
                    onChange={(e) => {
                        setRules({
                            ...rules,
                            data: e.target.value,
                        })
                    }}
                >
                    {options?.map((option, index) => (
                        <FormControlLabel key={index} value={option.value} control={<Radio />} label={option.label} />
                    ))}
                </RadioGroup>
            </FormControl>

            <Stack direction="row" mt={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker
                            label="Início"
                            required
                            format="DD-MM-YYYY HH:mm"
                            views={['day', 'month', 'year', 'hours', 'minutes']}
                            value={rules?.dataInicio || null}
                            onChange={(e) => {
                                setRules({ ...rules, dataInicio: e })
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                {rules?.data === 'outro' && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']} sx={{ width: 350, marginLeft: 2 }}>
                            <DateTimePicker
                                label="Fim"
                                format="DD-MM-YYYY HH:mm"
                                views={['day', 'month', 'year', 'hours', 'minutes']}
                                value={rules?.dataFim || null}
                                onChange={(e) => setRules({ ...rules, dataFim: e })}
                                minDateTime={rules?.dataInicio}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                )}
            </Stack>
        </div>
    )
}

export default TargetDate
