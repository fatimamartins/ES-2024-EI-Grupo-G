import { FormControl, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import React from 'react'

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
                    <DemoContainer components={['DateTimePicker']} sx={{ width: 350 }}>
                        <DateTimePicker
                            label="Início"
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
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                )}
            </Stack>
        </div>
    )
}

export default TargetDate
