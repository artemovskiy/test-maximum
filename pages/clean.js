import React, {useReducer, useState, useEffect, useRef} from 'react'
import CleanForm from "../components/CleanForm";
import {CleanerService} from "../lib/cleaner/cleaner-service";
import debounce from "../utils/debounce";
import Head from 'next/head';

const reducer = (state, action) => {
    console.log({action, state})
    switch (action.type) {
        case 'LOAD_DATA':
            return {
                ...state,
                pending: true,data: null, error: null
            }
        case 'LOAD_DATA_SUCCESS':
            return {
                ...state,
                data: action.payload,
                error: null,
                pending: false
            }
        case 'LOAD_DATA_FAILURE':
            return {
                ...state,
                error: action.payload,
                data: null,
                pending: false
            }
        default:
            throw new Error()
    }
}

const defaultState = {
    pending: false,
    data: null,
    error: null,
}

const handleResponseError = async res => {
    if(res.status !== 200) {
        let json
        try {
            json = await res.json()
        } catch (e) {
        }
        if(json && json.error) {
            throw new Error(json.error.message)
        } else {
            throw new Error('Server error')
        }
    } else {
        return res
    }
}

const getData = (query) =>
    fetch('/api/clean?query=' + encodeURIComponent(query))
        .then(handleResponseError)
        .then(r => r.json())

const callback = debounce(async (query, dispatch) => {
        dispatch({
            type: 'LOAD_DATA'
        })
        try {
            const data = await getData(query)
            dispatch({
                type: 'LOAD_DATA_SUCCESS',
                payload: data,
            })
        } catch (e) {
            console.error('request error', e)
            dispatch({
                type: 'LOAD_DATA_FAILURE',
                payload: e,
            })
        }
}, 500);

export default function Clean(props) {
    console.log({props})

    const [state, dispatch] = useReducer(reducer, {
        ...defaultState,
        data: props.initialRequest  ? props.initialRequest.data : null,
    })
    const [query, setQuery] = useState(props.initialRequest && props.initialRequest.query || '')

    const queryHandler = React.useCallback(callback, [])

    useEffect(() => {
        if(!state.data || !Array.isArray(state.data)|| !state.data.find(item => item.source === query)) {
            queryHandler(query, dispatch)
        }
    }, [query])

       return <>
           <Head>
               <title>Cleaner</title>
           </Head>
           <CleanForm
       data={state.data}
       pending={state.pending}
       query={query}
       error={state.error}
       onQueryChange={setQuery}
       />
       </>

}

const cleaner = new CleanerService()

export async function getServerSideProps() {
    try {
        const initialRequest = await cleaner.performRandomQuery()
        return {
            props: {
                initialRequest
            }
        }
    } catch (e) {
        console.error(e)
        return {
            props: {}
        }
    }

}