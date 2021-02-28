
export const handleChange = (setState: any) => (e: any) => {
    const {value} = e.target;
    setState(value)
}

export const handleFormInputChange = (setState: any) => (e: any) => {
    const {value, name} = e.target;
    setState((prevState:any) => ({...prevState, [name]: value}))
}
