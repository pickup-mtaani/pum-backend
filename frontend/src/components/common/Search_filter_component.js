/* eslint-disable */
import React, { useState } from 'react'
import { Download, Search } from 'react-feather'
import { Button, Input, InputGroup, InputGroupText, Spinner } from 'reactstrap'
const _ = require("lodash"); 
function Search_filter_component(props) {
    const [loading, setLoading] = useState(false)
    const { onChangeFilter, download } = props
    var debounce_fun = _.debounce(function (e) {
        onChangeFilter(e)
        setLoading(false)
    }, 1000);
    const changes = (e) => {
        setLoading(true)
        debounce_fun(e)
    }


    const Arr = [{ name: "props.products" }, { name: "props.products" }, { name: "props.products" }]
    return (
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
            <InputGroup style={{ width: '500px' }}>
                <InputGroupText>
                    {loading?<Spinner className='me-25'color='primary' size='sm' />:<Search size={14} />}
                </InputGroupText>
                <Input onChange={e => changes(e.target.value)} placeholder={`Search ${props.title ? props.title.toLowerCase() : "..."} `}

                />

            </InputGroup>

            {download && <Button color="primary" style={{ marginLeft: 20 }} onClick={download}><Download size="18px" style={{ paddingRight: 3 }} />Export</Button>}

        </div>
    )
}

export default Search_filter_component