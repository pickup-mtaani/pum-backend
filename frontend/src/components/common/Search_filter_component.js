/* eslint-disable */
import React, { useState } from 'react'

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
    return (
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10, }}>
            <div className="border border-slate-300 flex rounded-md px-2 py-1">
                <div className="justify-center items-center flex">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <input type='text' name="" placeholder="search" onChange={e => onChangeFilter(e.target.value)}  className=" rounded-md pl-2 focus:outline-none  " />
            </div>

            <button className="border ml-2 bg-primary-500 hover:bg-primary-600 rounded-md px-2 py-1"  onClick={download}>DownLoad</button>
           
        </div>
    )
}

export default Search_filter_component