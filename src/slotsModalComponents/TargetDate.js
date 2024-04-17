import { FormControl, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import dayjs from 'dayjs'
import React from 'react'

const TargetDate = ({ rules, setRules, options, dateTime, defaultValue }) => {
    return (
        <div>
            <FormControl>
                <RadioGroup
                    row
                    aria-labelledby="radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={rules?.data?.label || defaultValue}
                    onChange={(e) => {
                        setRules({
                            ...rules,
                            data: {
                                label: e.target.value,
                                value: dayjs(dateTime, { timeZone: 'GMT' }),
                            },
                        })
                    }}
                >
                    {options?.map((option, index) => (
                        <FormControlLabel key={index} value={option.value} control={<Radio />} label={option.label} />
                    ))}
                </RadioGroup>
            </FormControl>
            {rules?.data?.label === 'outro' && (
                <Stack direction="row">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']} sx={{ width: 350 }}>
                            <DateTimePicker
                                label="Início"
                                format="DD-MM-YYYY HH:mm"
                                views={['day', 'month', 'year', 'hours', 'minutes']}
                                value={rules?.dataInicio || dayjs(dateTime, { timeZone: 'GMT' })}
                                onChange={(e) => {
                                    setRules({ ...rules, dataInicio: e })
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker']} sx={{ width: 350, marginLeft: 2 }}>
                            <DateTimePicker
                                label="Fim"
                                format="DD-MM-YYYY HH:mm"
                                views={['day', 'month', 'year', 'hours', 'minutes']}
                                value={rules?.dataFim || dayjs(dateTime, { timeZone: 'GMT' })}
                                onChange={(e) => setRules({ ...rules, dataFim: e })}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Stack>
            )}
        </div>
    )
}

export default TargetDate
